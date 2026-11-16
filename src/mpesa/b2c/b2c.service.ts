/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 B2C Withdrawal Service
 * -----------------------------------------------------------------------------
 *
 * Initiates withdrawals of available funds from SisiMove financial accounts
 * to mobile-money destinations through Safaricom Daraja B2C.
 *
 * Responsibilities:
 * - Retrieve configured M-PESA provider credentials.
 * - Validate B2C provider configuration and callback URLs.
 * - Obtain a Daraja OAuth access token.
 * - Submit B2C BusinessPayment requests.
 * - Normalize Safaricom's immediate response.
 *
 * Important:
 * - This service submits withdrawals only.
 * - It does not determine how funds became available.
 * - It does not introduce payout classifications.
 * - Financial amounts are supplied in minor units and converted to whole KES.
 * - Request acceptance does not mean the recipient received the funds.
 * - Final success or failure is established through the B2C result callback.
 * - This service does not update financial account balances.
 * -----------------------------------------------------------------------------
 */

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { MpesaOAuthService } from '../auth/mpesa-oauth.service';
import { MpesaHttpService } from '../common/mpesa-http.service';

import { MPESA_B2C, MPESA_B2C_COMMANDS } from '../common/mpesa.constants';

import type {
  MpesaEnvironment,
  MpesaB2CConfiguration,
} from '../common/mpesa.config';

import type { MpesaB2CRequest, MpesaB2CResponse } from '../common/mpesa.types';

import { FinancialPaymentProviderPublicId } from '../../domains/financial-payment-providers/domain/value-objects/financial-payment-provider-public-id.vo';

import type { FinancialPaymentProviderRepository } from '../../domains/financial-payment-providers/domain/repositories/financial-payment-provider.repository';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../domains/financial-payment-providers/application/financial-payment-providers.tokens';

import { FinancialPaymentProviderConfigurationService } from '../../domains/financial-payment-providers/application/services/financial-payment-provider-configuration.service';

// =============================================================================
// Withdrawal Request
// =============================================================================

/**
 * Amount is expressed in Financial domain minor units.
 *
 * For KES:
 * - 100 = KES 1
 * - 1,000 = KES 10
 * - 10,000 = KES 100
 */
export interface MpesaB2CWithdrawalRequest {
  readonly providerPublicId: string;
  readonly amount: number;
  readonly phoneNumber: string;
  readonly remarks: string;
}

// =============================================================================
// Normalized Submission Result
// =============================================================================

export type MpesaB2CSubmissionOutcome = 'ACCEPTED' | 'REJECTED' | 'UNCERTAIN';

export interface MpesaB2CSubmissionResult {
  readonly outcome: MpesaB2CSubmissionOutcome;
  readonly originatorConversationId: string | null;
  readonly conversationId: string | null;
  readonly responseCode: string | null;
  readonly responseDescription: string | null;
}

// =============================================================================
// Resolved Provider Configuration
// =============================================================================

interface ResolvedB2CProvider {
  readonly environment: MpesaEnvironment;
  readonly configuration: MpesaB2CConfiguration;
}

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class B2CService {
  public constructor(
    private readonly oauthService: MpesaOAuthService,

    private readonly httpService: MpesaHttpService,

    private readonly configService: ConfigService,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly configurationService: FinancialPaymentProviderConfigurationService,
  ) {}

  // ===========================================================================
  // Validate Readiness
  // ===========================================================================

  /**
   * Validates the withdrawal request and M-PESA configuration before the
   * Financial Disbursement Attempt is created.
   *
   * This method does not obtain an OAuth token or contact Safaricom.
   */
  public async validateReadiness(
    request: MpesaB2CWithdrawalRequest,
  ): Promise<void> {
    this.validateWithdrawalRequest(request);

    await this.resolveProviderConfiguration(request.providerPublicId);
  }

  // ===========================================================================
  // Submit Withdrawal
  // ===========================================================================

  /**
   * Submits a withdrawal request to Safaricom.
   *
   * ACCEPTED means Safaricom accepted the request for processing.
   * It does not mean the withdrawal has completed.
   *
   * Explicit non-zero Daraja ResponseCode is REJECTED.
   * An incomplete or ambiguous response is UNCERTAIN.
   *
   * Transport exceptions propagate so the FinancialModule can preserve
   * the attempt as unresolved without automatically resubmitting it.
   */
  public async submit(
    request: MpesaB2CWithdrawalRequest,
  ): Promise<MpesaB2CSubmissionResult> {
    this.validateWithdrawalRequest(request);

    const resolved = await this.resolveProviderConfiguration(
      request.providerPublicId,
    );

    const accessToken = await this.oauthService.getAccessToken(
      request.providerPublicId,
    );

    // FinancialModule supplies minor units.
    // Daraja B2C requires a whole KES amount.
    const amountKes = request.amount / 100;

    const darajaRequest: MpesaB2CRequest = {
      InitiatorName: resolved.configuration.initiatorName,
      SecurityCredential: resolved.configuration.securityCredential,
      CommandID: MPESA_B2C_COMMANDS.BUSINESS_PAYMENT,
      Amount: amountKes,
      PartyA: resolved.configuration.shortcode,
      PartyB: request.phoneNumber.trim(),
      Remarks: request.remarks.trim(),
      QueueTimeOutURL: resolved.configuration.queueTimeoutUrl,
      ResultURL: resolved.configuration.resultUrl,
    };

    const response = await this.httpService.post<MpesaB2CResponse>(
      resolved.environment,
      MPESA_B2C.PAYMENT_REQUEST_PATH,
      darajaRequest,
      { accessToken },
    );

    return this.normalizeSubmissionResponse(response);
  }

  // ===========================================================================
  // Resolve Provider Configuration
  // ===========================================================================

  private async resolveProviderConfiguration(
    providerPublicId: string,
  ): Promise<ResolvedB2CProvider> {
    const publicId = new FinancialPaymentProviderPublicId(providerPublicId);

    const provider = await this.providerRepository.findByPublicId(publicId);

    if (provider === null) {
      throw new HttpException(
        'M-PESA payment provider was not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!provider.isEnabled || !provider.status.isReady()) {
      throw new HttpException(
        'M-PESA provider is not operational.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const providerEnvironment = provider.environment;

    if (providerEnvironment === null) {
      throw new HttpException(
        'M-PESA environment is not configured.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const environment: MpesaEnvironment = providerEnvironment.isSandbox()
      ? 'sandbox'
      : 'production';

    const storedConfiguration =
      await this.configurationService.getConfiguration(
        provider.id.toString(),
        providerEnvironment,
      );

    if (storedConfiguration === null) {
      throw new HttpException(
        'M-PESA configuration was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // B2C callback URLs are resolved from backend environment configuration.
    const resultUrl = this.configService
      .get<string>('MPESA_B2C_RESULT_URL')
      ?.trim();

    const queueTimeoutUrl = this.configService
      .get<string>('MPESA_B2C_QUEUE_TIMEOUT_URL')
      ?.trim();

    if (!resultUrl || !queueTimeoutUrl) {
      throw new HttpException(
        'B2C result and queue timeout callback URLs must be configured.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const configuration: MpesaB2CConfiguration = {
      shortcode: storedConfiguration.b2cShortcode ?? '',
      initiatorName: storedConfiguration.initiatorName ?? '',
      securityCredential: storedConfiguration.securityCredential ?? '',
      resultUrl,
      queueTimeoutUrl,
    };

    if (
      !configuration.shortcode.trim() ||
      !configuration.initiatorName.trim() ||
      !configuration.securityCredential.trim()
    ) {
      throw new HttpException(
        'B2C requires a shortcode, initiator name and security credential.',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.validateCallbackUrl(configuration.resultUrl, environment, 'result');

    this.validateCallbackUrl(
      configuration.queueTimeoutUrl,
      environment,
      'queue timeout',
    );

    return {
      environment,
      configuration,
    };
  }

  // ===========================================================================
  // Validate Withdrawal Request
  // ===========================================================================

  private validateWithdrawalRequest(request: MpesaB2CWithdrawalRequest): void {
    if (
      typeof request.providerPublicId !== 'string' ||
      !request.providerPublicId.trim()
    ) {
      throw new HttpException(
        'M-PESA provider public ID is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      !Number.isSafeInteger(request.amount) ||
      request.amount < 100 ||
      request.amount % 100 !== 0
    ) {
      throw new HttpException(
        'M-PESA B2C requires a positive whole KES amount represented in minor units.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof request.phoneNumber !== 'string' ||
      !/^254(?:7|1)\d{8}$/.test(request.phoneNumber.trim())
    ) {
      throw new HttpException(
        'Withdrawal destination must be a valid Kenyan phone number in 254 format.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof request.remarks !== 'string' ||
      !request.remarks.trim() ||
      request.remarks.trim().length > 100
    ) {
      throw new HttpException(
        'Withdrawal remarks are required and must not exceed 100 characters.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ===========================================================================
  // Normalize Daraja Response
  // ===========================================================================

  private normalizeSubmissionResponse(
    response: MpesaB2CResponse,
  ): MpesaB2CSubmissionResult {
    const responseCode =
      typeof response.ResponseCode === 'string'
        ? response.ResponseCode.trim()
        : null;

    const responseDescription =
      typeof response.ResponseDescription === 'string'
        ? response.ResponseDescription.trim()
        : null;

    const originatorConversationId = this.normalizeOptionalIdentifier(
      response.OriginatorConversationID,
    );

    const conversationId = this.normalizeOptionalIdentifier(
      response.ConversationID,
    );

    // An explicit non-zero response means Daraja rejected the request.
    if (responseCode !== null && responseCode !== '0') {
      return {
        outcome: 'REJECTED',
        originatorConversationId,
        conversationId,
        responseCode,
        responseDescription:
          responseDescription ||
          'Safaricom rejected the B2C withdrawal request.',
      };
    }

    // A successful acceptance response must contain both correlation IDs.
    if (
      responseCode === '0' &&
      originatorConversationId !== null &&
      conversationId !== null
    ) {
      return {
        outcome: 'ACCEPTED',
        originatorConversationId,
        conversationId,
        responseCode,
        responseDescription:
          responseDescription ||
          'Safaricom accepted the B2C withdrawal request.',
      };
    }

    // Missing or incomplete provider response requires reconciliation.
    return {
      outcome: 'UNCERTAIN',
      originatorConversationId,
      conversationId,
      responseCode,
      responseDescription:
        responseDescription ||
        'Safaricom returned an incomplete B2C response. The withdrawal outcome requires reconciliation.',
    };
  }

  // ===========================================================================
  // Callback URL Validation
  // ===========================================================================

  private validateCallbackUrl(
    callbackUrl: string,
    environment: MpesaEnvironment,
    description: string,
  ): void {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(callbackUrl);
    } catch {
      throw new HttpException(
        `B2C ${description} callback URL is invalid.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      throw new HttpException(
        `B2C ${description} callback URL must use HTTP or HTTPS.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (environment === 'production' && parsedUrl.protocol !== 'https:') {
      throw new HttpException(
        `Production B2C ${description} callback URL must use HTTPS.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ===========================================================================
  // Identifier Normalization
  // ===========================================================================

  private normalizeOptionalIdentifier(
    value: string | undefined,
  ): string | null {
    const normalized = value?.trim();

    return normalized ? normalized : null;
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default B2CService;
