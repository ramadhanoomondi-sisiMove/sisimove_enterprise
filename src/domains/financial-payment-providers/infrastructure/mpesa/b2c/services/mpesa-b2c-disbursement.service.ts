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

const MINIMUM_AMOUNT_MINOR_UNITS = 100;

// =============================================================================
// Types
// =============================================================================

export interface MpesaB2CDisbursementInput {
  providerPublicId: string;
  originatorConversationId: string;
  amount: number;
  phoneNumber: string;
  commandId: MpesaB2CCommandId;
  remarks: string;
  occasion?: string;
}

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

interface SafeHttpErrorDetails {
  name: string;
  message: string;
  code: string | null;
  status: number | null;
  statusText: string | null;
  method: string | null;
  url: string | null;
  responseData: unknown;
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
  // Validate Readiness
  // ===========================================================================

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
    this.logger.log('Starting M-PESA B2C submission.');

    // -------------------------------------------------------------------------
    // 1. Validate input
    // -------------------------------------------------------------------------

    this.validateInput(input);

    const originatorConversationId = input.originatorConversationId.trim();

    // -------------------------------------------------------------------------
    // 2. Resolve provider configuration
    // -------------------------------------------------------------------------

    const configuration = await this.resolveConfiguration(
      input.providerPublicId,
    );

    this.logger.log(
      `B2C provider configuration resolved. Environment endpoint: ${configuration.endpoint}`,
    );

    // -------------------------------------------------------------------------
    // 3. Obtain OAuth token
    // -------------------------------------------------------------------------

    // OAuth failures are deliberately allowed to propagate.
    // They must not be misrepresented as successful B2C submissions.

    const accessToken = await this.oauthService.getAccessToken(
      configuration.providerPublicId,
    );

    this.logger.log('M-PESA OAuth access token obtained successfully.');

    // -------------------------------------------------------------------------
    // 4. Normalize recipient
    // -------------------------------------------------------------------------

    const phoneNumber = this.normalizePhoneNumber(input.phoneNumber);

    // -------------------------------------------------------------------------
    // 5. Build provider request
    // -------------------------------------------------------------------------

    const request: MpesaB2CRequest = {
      OriginatorConversationID: originatorConversationId,
      InitiatorName: configuration.initiatorName,
      SecurityCredential: configuration.securityCredential,
      CommandID: input.commandId,
      Amount: input.amount / 100,
      PartyA: configuration.shortcode,
      PartyB: phoneNumber,
      Remarks: input.remarks.trim(),
      QueueTimeOutURL: configuration.queueTimeoutUrl,
      ResultURL: configuration.resultUrl,
      ...(input.occasion?.trim() ? { Occassion: input.occasion.trim() } : {}),
    };

    // -------------------------------------------------------------------------
    // 6. Submit request
    // -------------------------------------------------------------------------

    // IMPORTANT:
    // A transport failure does not prove Safaricom did not receive the request.
    // Never automatically submit the same payment again.

    this.logger.log(
      `Submitting M-PESA B2C request. OriginatorConversationID: ${originatorConversationId}; Amount: ${input.amount / 100} KES; CommandID: ${input.commandId}.`,
    );

    let response;

    try {
      response = await this.httpClient.post<MpesaB2CResponse>(
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
    } catch (error: unknown) {
      const details = this.extractHttpErrorDetails(error);

      this.logger.error(
        `M-PESA B2C HTTP submission failed. ` +
          `OriginatorConversationID: ${originatorConversationId}; ` +
          `HTTP Status: ${details.status ?? 'NO HTTP RESPONSE'}; ` +
          `Status Text: ${details.statusText ?? 'N/A'}; ` +
          `Error Name: ${details.name}; ` +
          `Error Code: ${details.code ?? 'N/A'}; ` +
          `Method: ${details.method ?? 'N/A'}; ` +
          `URL: ${details.url ?? 'N/A'}; ` +
          `Message: ${details.message}`,
      );

      // If Safaricom returned an HTTP response, inspect its body.
      // Never silently discard a structured rejection.

      if (details.status !== null && details.responseData !== null) {
        this.logger.error(
          `M-PESA B2C HTTP error response body: ${this.safeResponseSummary(details.responseData)}`,
        );

        const normalized = this.normalizeApiResponse(
          details.responseData,
          originatorConversationId,
        );

        this.logger.warn(
          `M-PESA B2C HTTP error response interpreted as ${normalized.outcome}.`,
        );

        return normalized;
      }

      // No structured provider response.
      // The outcome remains uncertain.

      this.logger.error(
        `M-PESA B2C outcome is UNCERTAIN. ` +
          `No structured provider response was received. ` +
          `OriginatorConversationID: ${originatorConversationId}. ` +
          `Do not resubmit automatically.`,
        error instanceof Error ? error.stack : undefined,
      );

      return {
        outcome: 'UNCERTAIN',
        accepted: false,
        conversationId: null,
        originatorConversationId,
        responseCode: null,
        responseDescription:
          `Transport failure: ${details.name}; ` +
          `${details.code ?? 'NO_ERROR_CODE'}; ${details.message}`,
      };
    }

    // -------------------------------------------------------------------------
    // 7. Log successful HTTP response
    // -------------------------------------------------------------------------

    this.logger.log(
      `M-PESA B2C HTTP response received. ` +
        `HTTP Status: ${response.status}; ` +
        `Status Text: ${response.statusText}; ` +
        `OriginatorConversationID: ${originatorConversationId}.`,
    );

    this.logger.log(
      `M-PESA B2C response body: ${this.safeResponseSummary(response.data)}`,
    );

    // -------------------------------------------------------------------------
    // 8. Normalize and classify response
    // -------------------------------------------------------------------------

    const result = this.normalizeApiResponse(
      response.data,
      originatorConversationId,
    );

    this.logger.log(
      `M-PESA B2C submission classification: ${result.outcome}; ` +
        `Accepted: ${result.accepted}; ` +
        `ResponseCode: ${result.responseCode ?? 'MISSING'}; ` +
        `ConversationID: ${result.conversationId ?? 'MISSING'}; ` +
        `OriginatorConversationID: ${result.originatorConversationId}.`,
    );

    if (result.outcome === 'ACCEPTED') {
      this.logger.log(
        'Safaricom accepted the B2C request for processing. Final payout outcome is still pending the ResultURL callback.',
      );
    }

    if (result.outcome === 'REJECTED') {
      this.logger.error(
        `Safaricom rejected the B2C submission. Code: ${result.responseCode}; Description: ${result.responseDescription ?? 'No description returned'}.`,
      );
    }

    if (result.outcome === 'UNCERTAIN') {
      this.logger.error(
        `Safaricom B2C response could not be reliably classified. ` +
          `Code: ${result.responseCode ?? 'MISSING'}; ` +
          `Description: ${result.responseDescription ?? 'MISSING'}.`,
      );
    }

    return result;
  }

  // ===========================================================================
  // Resolve Provider Configuration
  // ===========================================================================

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
  // Normalize Safaricom Response
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
      this.logger.error(
        `Invalid M-PESA B2C response type. Expected object; received ${payload === null ? 'null' : Array.isArray(payload) ? 'array' : typeof payload}.`,
      );

      return this.uncertainResult(
        expectedOriginatorConversationId,
        'Safaricom returned a non-object response.',
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

    // -------------------------------------------------------------------------
    // Required response fields
    // -------------------------------------------------------------------------

    const missingFields: string[] = [];

    if (conversationId === null) {
      missingFields.push('ConversationID');
    }

    if (returnedOriginatorId === null) {
      missingFields.push('OriginatorConversationID');
    }

    if (responseCode === null) {
      missingFields.push('ResponseCode');
    }

    if (responseDescription === null) {
      missingFields.push('ResponseDescription');
    }

    if (missingFields.length > 0) {
      this.logger.error(
        `M-PESA B2C response is incomplete. Missing fields: ${missingFields.join(', ')}. Actual response: ${this.safeResponseSummary(payload)}`,
      );
    }

    // -------------------------------------------------------------------------
    // Correlation validation
    // -------------------------------------------------------------------------

    if (
      returnedOriginatorId !== null &&
      returnedOriginatorId !== expectedOriginatorConversationId
    ) {
      this.logger.error(
        `M-PESA B2C correlation mismatch. Expected OriginatorConversationID: ${expectedOriginatorConversationId}; Received: ${returnedOriginatorId}.`,
      );

      return this.uncertainResult(
        expectedOriginatorConversationId,
        'Safaricom response correlation identifier did not match the submitted request.',
        conversationId,
        responseCode,
      );
    }

    // Missing correlation ID must never be treated as acceptance/rejection.

    if (returnedOriginatorId === null || responseCode === null) {
      return this.uncertainResult(
        expectedOriginatorConversationId,
        responseDescription ??
          `Incomplete Safaricom response. Missing: ${missingFields.join(', ')}.`,
        conversationId,
        responseCode,
      );
    }

    // -------------------------------------------------------------------------
    // Accepted
    // -------------------------------------------------------------------------

    if (responseCode === '0') {
      return {
        outcome: 'ACCEPTED',
        accepted: true,
        conversationId,
        originatorConversationId: returnedOriginatorId,
        responseCode,
        responseDescription,
      };
    }

    // -------------------------------------------------------------------------
    // Explicit rejection
    // -------------------------------------------------------------------------

    return {
      outcome: 'REJECTED',
      accepted: false,
      conversationId,
      originatorConversationId: returnedOriginatorId,
      responseCode,
      responseDescription:
        responseDescription ??
        'Safaricom returned a non-zero B2C response code.',
    };
  }

  // ===========================================================================
  // Extract HTTP Error Details
  // ===========================================================================

  private extractHttpErrorDetails(error: unknown): SafeHttpErrorDetails {
    const details: SafeHttpErrorDetails = {
      name: 'UnknownError',
      message: 'Unknown HTTP client error.',
      code: null,
      status: null,
      statusText: null,
      method: null,
      url: null,
      responseData: null,
    };

    if (error instanceof Error) {
      details.name = error.name;
      details.message = error.message;
    }

    if (typeof error !== 'object' || error === null) {
      return details;
    }

    if ('code' in error && typeof error.code === 'string') {
      details.code = error.code;
    }

    if (
      'config' in error &&
      typeof error.config === 'object' &&
      error.config !== null
    ) {
      const config = error.config as {
        method?: unknown;
        url?: unknown;
      };

      if (typeof config.method === 'string') {
        details.method = config.method.toUpperCase();
      }

      // Only record the URL when it is the known Safaricom endpoint.
      // Never log query parameters or authorization information.

      if (
        typeof config.url === 'string' &&
        config.url.includes('/mpesa/b2c/v3/paymentrequest')
      ) {
        details.url = config.url;
      }
    }

    if (
      'response' in error &&
      typeof error.response === 'object' &&
      error.response !== null
    ) {
      const response = error.response as {
        status?: unknown;
        statusText?: unknown;
        data?: unknown;
      };

      if (typeof response.status === 'number') {
        details.status = response.status;
      }

      if (typeof response.statusText === 'string') {
        details.statusText = response.statusText;
      }

      if ('data' in response) {
        details.responseData = response.data;
      }
    }

    return details;
  }

  // ===========================================================================
  // Safe Response Summary
  // ===========================================================================

  /**
   * Whitelist only known non-secret Daraja response fields.
   * Never stringify arbitrary provider payloads because they may contain
   * unexpected sensitive fields.
   */
  private safeResponseSummary(payload: unknown): string {
    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      return JSON.stringify({
        responseType:
          payload === null
            ? 'null'
            : Array.isArray(payload)
              ? 'array'
              : typeof payload,
      });
    }

    const data = payload as Record<string, unknown>;

    const safe: Record<string, string | null> = {
      ResponseCode: this.normalizeResponseCode(data.ResponseCode),
      ResponseDescription: this.normalizeIdentifier(
        typeof data.ResponseDescription === 'string'
          ? data.ResponseDescription
          : null,
      ),
      ConversationID: this.normalizeIdentifier(
        typeof data.ConversationID === 'string' ? data.ConversationID : null,
      ),
      OriginatorConversationID: this.normalizeIdentifier(
        typeof data.OriginatorConversationID === 'string'
          ? data.OriginatorConversationID
          : null,
      ),
    };

    return JSON.stringify(safe);
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

    if (input.commandId !== 'BusinessPayment') {
      throw new Error(
        'Only BusinessPayment is supported by the SisiMove B2C workflow.',
      );
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
