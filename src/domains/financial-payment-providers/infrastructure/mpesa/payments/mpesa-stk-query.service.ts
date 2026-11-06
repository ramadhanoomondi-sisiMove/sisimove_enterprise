// -----------------------------------------------------------------------------
// M-PESA STK Query Service
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Resolve the configured M-PESA provider.
// - Read the provider environment and encrypted configuration.
// - Obtain a Safaricom OAuth access token.
// - Generate the Daraja timestamp and password.
// - Query an existing STK Push using its CheckoutRequestID.
// - Return Safaricom's response without changing payment records.
//
// This service does NOT:
//
// - Initiate another STK Push.
// - Create Financial Payment Attempts.
// - Update Financial Payment statuses.
// - Mark payments as successful or failed.
// - Create Financial Transactions.
// - Update account balances.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable, Logger } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../application/financial-payment-providers.tokens';

import type { FinancialPaymentProviderRepository } from '../../../domain/repositories/financial-payment-provider.repository';

import { FinancialPaymentProviderCode } from '../../../domain/value-objects/financial-payment-provider-code.vo';

import { FinancialPaymentProviderPublicId } from '../../../domain/value-objects/financial-payment-provider-public-id.vo';

import { FinancialPaymentProviderConfigurationService } from '../../../application/services/financial-payment-provider-configuration.service';

import { MpesaOAuthService } from '../authentication/mpesa-oauth.service';

import { MpesaHttpClient } from '../http/mpesa-http.client';

import type {
  MpesaStkQueryApiResponse,
  MpesaStkQueryInput,
  MpesaStkQueryRequest,
} from './mpesa-stk-query.types';

// =============================================================================
// Constants
// =============================================================================

const MPESA_SANDBOX_BASE_URL = 'https://sandbox.safaricom.co.ke';

const MPESA_PRODUCTION_BASE_URL = 'https://api.safaricom.co.ke';

const MPESA_STK_QUERY_ENDPOINT = '/mpesa/stkpushquery/v1/query';

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class MpesaStkQueryService {
  private readonly logger = new Logger(MpesaStkQueryService.name);

  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly configurationService: FinancialPaymentProviderConfigurationService,

    private readonly oauthService: MpesaOAuthService,

    private readonly httpClient: MpesaHttpClient,
  ) {}

  // ===========================================================================
  // Query Existing STK Push
  // ===========================================================================

  public async query(
    input: MpesaStkQueryInput,
  ): Promise<MpesaStkQueryApiResponse> {
    // -------------------------------------------------------------------------
    // 1. Validate input
    // -------------------------------------------------------------------------

    if (!input.providerPublicId?.trim()) {
      throw new Error('M-PESA provider public ID is required.');
    }

    if (!input.checkoutRequestId?.trim()) {
      throw new Error('M-PESA CheckoutRequestID is required.');
    }

    const checkoutRequestId = input.checkoutRequestId.trim();

    // -------------------------------------------------------------------------
    // 2. Resolve M-PESA provider
    // -------------------------------------------------------------------------

    const providerPublicId = new FinancialPaymentProviderPublicId(
      input.providerPublicId.trim(),
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

    // -------------------------------------------------------------------------
    // 3. Resolve provider environment
    // -------------------------------------------------------------------------

    const environment = provider.environment;

    const baseUrl = environment.isSandbox()
      ? MPESA_SANDBOX_BASE_URL
      : MPESA_PRODUCTION_BASE_URL;

    const endpoint = `${baseUrl}${MPESA_STK_QUERY_ENDPOINT}`;

    // -------------------------------------------------------------------------
    // 4. Retrieve encrypted provider configuration
    // -------------------------------------------------------------------------

    const configuration = await this.configurationService.getConfiguration(
      provider.id.toString(),
      environment,
    );

    if (configuration === null) {
      throw new Error('M-PESA provider configuration was not found.');
    }

    const shortcode = configuration.shortcode?.trim();

    const passkey = configuration.passkey?.trim();

    if (!shortcode || !passkey) {
      throw new Error(
        'M-PESA shortcode or passkey is missing from provider configuration.',
      );
    }

    // -------------------------------------------------------------------------
    // 5. Obtain OAuth access token
    // -------------------------------------------------------------------------

    const accessToken =
      await this.oauthService.getAccessToken(providerPublicId);

    // -------------------------------------------------------------------------
    // 6. Generate Daraja timestamp and password
    // -------------------------------------------------------------------------

    const timestamp = this.generateTimestamp();

    const password = this.generatePassword(shortcode, passkey, timestamp);

    // -------------------------------------------------------------------------
    // 7. Build STK Query request
    // -------------------------------------------------------------------------

    const request: MpesaStkQueryRequest = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    // -------------------------------------------------------------------------
    // 8. Submit query
    //
    // This endpoint checks an existing STK Push. It does not initiate a
    // new customer payment prompt.
    // -------------------------------------------------------------------------

    try {
      const response = await this.httpClient.post<MpesaStkQueryApiResponse>(
        endpoint,
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      this.logger.log(
        `M-PESA STK Query response received for CheckoutRequestID ${checkoutRequestId}.`,
      );

      return response.data;
    } catch (error: unknown) {
      this.logger.error(
        `M-PESA STK Query failed for CheckoutRequestID ${checkoutRequestId}.`,
      );

      // Preserve the original error for the calling application.
      // A query failure must never trigger a new STK Push.
      throw error;
    }
  }

  // ===========================================================================
  // Daraja Timestamp
  // ===========================================================================

  private generateTimestamp(): string {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date());

    const values: Record<string, string> = {};

    for (const part of parts) {
      if (part.type !== 'literal') {
        values[part.type] = part.value;
      }
    }

    const { year, month, day, hour, minute, second } = values;

    if (!year || !month || !day || !hour || !minute || !second) {
      throw new Error('Unable to generate a valid M-PESA timestamp.');
    }

    return year + month + day + hour + minute + second;
  }

  // ===========================================================================
  // Lipa Na M-PESA Password
  // ===========================================================================

  private generatePassword(
    shortcode: string,
    passkey: string,
    timestamp: string,
  ): string {
    const rawPassword = `${shortcode}${passkey}${timestamp}`;

    return Buffer.from(rawPassword, 'utf8').toString('base64');
  }
}

export default MpesaStkQueryService;
