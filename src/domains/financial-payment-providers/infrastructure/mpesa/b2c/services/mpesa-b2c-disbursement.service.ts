import { Inject, Injectable, Logger } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../../application/financial-payment-providers.tokens';

import type { FinancialPaymentProviderRepository } from '../../../../domain/repositories/financial-payment-provider.repository';

import { FinancialPaymentProviderCode } from '../../../../domain/value-objects/financial-payment-provider-code.vo';

import { FinancialPaymentProviderPublicId } from '../../../../domain/value-objects/financial-payment-provider-public-id.vo';

import { FinancialPaymentProviderConfigurationService } from '../../../../application/services/financial-payment-provider-configuration.service';

import { MpesaOAuthService } from '../../authentication/mpesa-oauth.service';

import { MpesaHttpClient } from '../../http/mpesa-http.client';

import type {
  MpesaB2CRequest,
  MpesaB2CCommandId,
} from '../contracts/mpesa-b2c-request.interface';

import type { MpesaB2CResponse } from '../contracts/mpesa-b2c-response.interface';

// =============================================================================
// Constants
// =============================================================================

const MPESA_SANDBOX_BASE_URL = 'https://sandbox.safaricom.co.ke';

const MPESA_PRODUCTION_BASE_URL = 'https://api.safaricom.co.ke';

const MPESA_B2C_ENDPOINT = '/mpesa/b2c/v3/paymentrequest';

// Financial amounts are stored in integer minor units.
// Daraja B2C accepts whole KES amounts.
const MINIMUM_AMOUNT_MINOR_UNITS = 100;

// =============================================================================
// Types
// =============================================================================

export interface MpesaB2CDisbursementInput {
  providerPublicId: string;

  /**
   * Must be generated and persisted by the application
   * before this service is called.
   */
  originatorConversationId: string;

  /** Financial domain amount in minor units. */
  amount: number;

  /** Recipient phone number. */
  phoneNumber: string;

  commandId: MpesaB2CCommandId;

  remarks: string;

  occasion?: string;
}

/**
 * Input accepted by the preflight readiness check.
 * The originator conversation ID is not needed because this
 * method does not create or submit a provider request.
 */
export type MpesaB2CDisbursementReadinessInput = Omit<
  MpesaB2CDisbursementInput,
  'originatorConversationId'
>;

export interface MpesaB2CDisbursementResult {
  outcome: 'ACCEPTED' | 'REJECTED' | 'UNCERTAIN';

  accepted: boolean;

  conversationId: string | null;

  originatorConversationId: string;

  responseCode: string | null;

  responseDescription: string | null;
}

interface ResolvedMpesaB2CConfiguration {
  providerPublicId: FinancialPaymentProviderPublicId;
  endpoint: string;
  shortcode: string;
  initiatorName: string;
  securityCredential: string;
  resultUrl: string;
  queueTimeoutUrl: string;
}

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class MpesaB2CDisbursementService {
  private readonly logger = new Logger(MpesaB2CDisbursementService.name);

  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly configurationService: FinancialPaymentProviderConfigurationService,

    private readonly oauthService: MpesaOAuthService,

    private readonly httpClient: MpesaHttpClient,
  ) {}

  // ===========================================================================
  // Validate B2C Disbursement Readiness
  // ===========================================================================

  /**
   * Performs deterministic local/provider-configuration checks before the
   * application creates and persists a disbursement attempt.
   *
   * This method deliberately does not obtain an OAuth token and does not
   * submit a request to Safaricom.
   */
  public async validateReadiness(
    input: MpesaB2CDisbursementReadinessInput,
  ): Promise<void> {
    this.validateReadinessInput(input);
    await this.resolveConfiguration(input.providerPublicId);
  }

  // ===========================================================================
  // Submit B2C Disbursement
  // ===========================================================================

  public async submit(
    input: MpesaB2CDisbursementInput,
  ): Promise<MpesaB2CDisbursementResult> {
    // -------------------------------------------------------------------------
    // 1. Validate caller-supplied input
    // -------------------------------------------------------------------------

    this.validateInput(input);

    const originatorConversationId = input.originatorConversationId.trim();

    // -------------------------------------------------------------------------
    // 2. Resolve provider configuration
    // -------------------------------------------------------------------------

    const configuration = await this.resolveConfiguration(
      input.providerPublicId,
    );

    // -------------------------------------------------------------------------
    // 3. Obtain OAuth access token
    // -------------------------------------------------------------------------

    const accessToken = await this.oauthService.getAccessToken(
      configuration.providerPublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Normalize recipient phone number
    // -------------------------------------------------------------------------

    const phoneNumber = this.normalizePhoneNumber(input.phoneNumber);

    // -------------------------------------------------------------------------
    // 5. Build Daraja B2C request
    // -------------------------------------------------------------------------

    const request: MpesaB2CRequest = {
      OriginatorConversationID: originatorConversationId,
      InitiatorName: configuration.initiatorName,
      SecurityCredential: configuration.securityCredential,
      CommandID: input.commandId,

      // Convert domain minor units into whole KES at provider boundary.
      Amount: input.amount / 100,

      PartyA: configuration.shortcode,
      PartyB: phoneNumber,
      Remarks: input.remarks.trim(),
      QueueTimeOutURL: configuration.queueTimeoutUrl,
      ResultURL: configuration.resultUrl,
      ...(input.occasion?.trim() ? { Occassion: input.occasion.trim() } : {}),
    };

    // -------------------------------------------------------------------------
    // 6. Submit B2C request
    // -------------------------------------------------------------------------

    // A connection failure or timeout does not prove Safaricom
    // failed to receive the request.
    //
    // Never automatically resubmit from this service.
    // The application must preserve the attempt for reconciliation.

    try {
      const response = await this.httpClient.post<MpesaB2CResponse>(
        configuration.endpoint,
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      return this.normalizeApiResponse(response.data, originatorConversationId);
    } catch (error: unknown) {
      // Axios can reject an HTTP response even when Safaricom
      // returned a structured response body.

      const responseData = this.extractErrorResponseData(error);

      if (responseData !== null) {
        return this.normalizeApiResponse(
          responseData,
          originatorConversationId,
        );
      }

      // No structured response was received.
      // Safaricom may nevertheless have received the request.

      this.logger.error(
        'M-PESA B2C submission outcome is uncertain. Reconciliation is required.',
      );

      return {
        outcome: 'UNCERTAIN',
        accepted: false,
        conversationId: null,
        originatorConversationId,
        responseCode: null,
        responseDescription:
          'The B2C submission outcome could not be established.',
      };
    }
  }

  // ===========================================================================
  // Resolve and Validate Provider Configuration
  // ===========================================================================

  /**
   * Resolves all deterministic provider settings required by a B2C request.
   * Shared by readiness validation and the actual submit operation.
   */
  private async resolveConfiguration(
    providerPublicIdValue: string,
  ): Promise<ResolvedMpesaB2CConfiguration> {
    const providerPublicId = new FinancialPaymentProviderPublicId(
      providerPublicIdValue.trim(),
    );

    const provider =
      await this.providerRepository.findByPublicId(providerPublicId);

    if (provider === null) {
      throw new Error('M-PESA payment provider was not found.');
    }

    const mpesaCode = FinancialPaymentProviderCode.create('MPESA');

    if (!provider.code.equals(mpesaCode)) {
      throw new Error('The selected payment provider is not M-PESA.');
    }

    if (!provider.isOperational) {
      throw new Error('M-PESA payment provider is not operational.');
    }

    const environment = provider.environment;

    const baseUrl = environment.isSandbox()
      ? MPESA_SANDBOX_BASE_URL
      : MPESA_PRODUCTION_BASE_URL;

    const endpoint = `${baseUrl}${MPESA_B2C_ENDPOINT}`;

    const providerConfiguration =
      await this.configurationService.getConfiguration(
        provider.id.toString(),
        environment,
      );

    if (providerConfiguration === null) {
      throw new Error('M-PESA provider configuration was not found.');
    }

    const shortcode = providerConfiguration.shortcode?.trim();
    const initiatorName = providerConfiguration.initiatorName?.trim();
    const securityCredential = providerConfiguration.securityCredential?.trim();

    if (!shortcode) {
      throw new Error(
        'M-PESA shortcode is missing from provider configuration.',
      );
    }

    if (!initiatorName) {
      throw new Error(
        'M-PESA initiator name is missing from provider configuration.',
      );
    }

    if (!securityCredential) {
      throw new Error(
        'M-PESA security credential is missing from provider configuration.',
      );
    }

    const resultUrl = process.env.MPESA_B2C_RESULT_URL?.trim();
    const queueTimeoutUrl = process.env.MPESA_B2C_QUEUE_TIMEOUT_URL?.trim();

    if (!resultUrl) {
      throw new Error(
        'MPESA_B2C_RESULT_URL is not configured in the backend environment.',
      );
    }

    if (!queueTimeoutUrl) {
      throw new Error(
        'MPESA_B2C_QUEUE_TIMEOUT_URL is not configured in the backend environment.',
      );
    }

    this.validateCallbackUrl(resultUrl);
    this.validateCallbackUrl(queueTimeoutUrl);

    return {
      providerPublicId,
      endpoint,
      shortcode,
      initiatorName,
      securityCredential,
      resultUrl,
      queueTimeoutUrl,
    };
  }

  // ===========================================================================
  // Normalize Safaricom API Response
  // ===========================================================================

  private normalizeApiResponse(
    payload: unknown,
    expectedOriginatorConversationId: string,
  ): MpesaB2CDisbursementResult {
    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      return this.uncertainResult(
        expectedOriginatorConversationId,
        'Safaricom returned an invalid or incomplete response.',
      );
    }

    const response = payload as Partial<MpesaB2CResponse>;

    const conversationId = this.normalizeIdentifier(response.ConversationID);

    const returnedOriginatorId = this.normalizeIdentifier(
      response.OriginatorConversationID,
    );

    const responseCode = this.normalizeResponseCode(response.ResponseCode);

    const responseDescription = this.normalizeIdentifier(
      response.ResponseDescription,
    );

    // Do not accept a response that identifies a different request.
    if (
      returnedOriginatorId !== null &&
      returnedOriginatorId !== expectedOriginatorConversationId
    ) {
      return this.uncertainResult(
        expectedOriginatorConversationId,
        'Safaricom response correlation identifier did not match the submitted request.',
        conversationId,
        responseCode,
      );
    }

    // ResponseCode 0 means Safaricom accepted the request for processing.
    // It does not confirm successful payout.
    if (responseCode === '0' && returnedOriginatorId !== null) {
      return {
        outcome: 'ACCEPTED',
        accepted: true,
        conversationId,
        originatorConversationId: returnedOriginatorId,
        responseCode,
        responseDescription,
      };
    }

    // An explicit non-zero response code with the matching correlation ID
    // establishes rejection of the submission.
    if (
      responseCode !== null &&
      responseCode !== '0' &&
      returnedOriginatorId !== null
    ) {
      return {
        outcome: 'REJECTED',
        accepted: false,
        conversationId,
        originatorConversationId: returnedOriginatorId,
        responseCode,
        responseDescription,
      };
    }

    return this.uncertainResult(
      expectedOriginatorConversationId,
      responseDescription ??
        'Safaricom response did not establish the submission outcome.',
      conversationId,
      responseCode,
    );
  }

  // ===========================================================================
  // Extract Axios Error Response
  // ===========================================================================

  private extractErrorResponseData(error: unknown): unknown {
    if (typeof error !== 'object' || error === null || !('response' in error)) {
      return null;
    }

    const response = error.response;

    if (
      typeof response !== 'object' ||
      response === null ||
      !('data' in response)
    ) {
      return null;
    }

    return response.data;
  }

  // ===========================================================================
  // Uncertain Result
  // ===========================================================================

  private uncertainResult(
    originatorConversationId: string,
    description: string,
    conversationId: string | null = null,
    responseCode: string | null = null,
  ): MpesaB2CDisbursementResult {
    return {
      outcome: 'UNCERTAIN',
      accepted: false,
      conversationId,
      originatorConversationId,
      responseCode,
      responseDescription: description,
    };
  }

  // ===========================================================================
  // Input Validation
  // ===========================================================================

  private validateReadinessInput(
    input: MpesaB2CDisbursementReadinessInput,
  ): void {
    this.validateCommonInput(input);
  }

  private validateInput(input: MpesaB2CDisbursementInput): void {
    this.validateCommonInput(input);

    if (!input.originatorConversationId?.trim()) {
      throw new Error('B2C originator conversation ID is required.');
    }
  }

  private validateCommonInput(input: MpesaB2CDisbursementReadinessInput): void {
    if (!input.providerPublicId?.trim()) {
      throw new Error('M-PESA provider public ID is required.');
    }

    if (
      !Number.isSafeInteger(input.amount) ||
      input.amount < MINIMUM_AMOUNT_MINOR_UNITS ||
      input.amount % 100 !== 0
    ) {
      throw new Error(
        'B2C amount must be a positive whole KES amount represented in minor units.',
      );
    }

    if (
      !['SalaryPayment', 'BusinessPayment', 'PromotionPayment'].includes(
        input.commandId,
      )
    ) {
      throw new Error('Invalid M-PESA B2C command ID.');
    }

    if (
      typeof input.remarks !== 'string' ||
      input.remarks.trim().length < 2 ||
      input.remarks.trim().length > 100
    ) {
      throw new Error('B2C remarks must contain between 2 and 100 characters.');
    }

    if (
      input.occasion !== undefined &&
      (typeof input.occasion !== 'string' || input.occasion.trim().length > 100)
    ) {
      throw new Error('B2C occasion must not exceed 100 characters.');
    }

    this.normalizePhoneNumber(input.phoneNumber);
  }

  // ===========================================================================
  // Callback URL Validation
  // ===========================================================================

  private validateCallbackUrl(value: string): void {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(value);
    } catch {
      throw new Error('M-PESA B2C callback URL must be a valid URL.');
    }

    if (parsedUrl.protocol !== 'https:') {
      throw new Error('M-PESA B2C callback URL must use HTTPS.');
    }

    if (!parsedUrl.hostname) {
      throw new Error('M-PESA B2C callback URL must have a valid hostname.');
    }
  }

  // ===========================================================================
  // Phone Number Normalization
  // ===========================================================================

  private normalizePhoneNumber(value: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('M-PESA recipient phone number is required.');
    }

    const normalized = value.replace(/[\s+()-]/g, '');

    if (/^0[17]\d{8}$/.test(normalized)) {
      return `254${normalized.substring(1)}`;
    }

    if (/^[17]\d{8}$/.test(normalized)) {
      return `254${normalized}`;
    }

    if (/^254[17]\d{8}$/.test(normalized)) {
      return normalized;
    }

    throw new Error(
      'Invalid Kenyan M-PESA phone number. Use 07XXXXXXXX, 01XXXXXXXX, or 254XXXXXXXXX.',
    );
  }

  // ===========================================================================
  // Response Code Normalization
  // ===========================================================================

  private normalizeResponseCode(value: unknown): string | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }

    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim();

    return normalized.length > 0 ? normalized : null;
  }

  // ===========================================================================
  // Identifier Normalization
  // ===========================================================================

  private normalizeIdentifier(value: string | null | undefined): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim();

    return normalized.length > 0 ? normalized : null;
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default MpesaB2CDisbursementService;
