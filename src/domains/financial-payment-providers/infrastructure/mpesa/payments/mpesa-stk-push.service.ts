// -----------------------------------------------------------------------------
// M-PESA STK Push Service
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
  MpesaStkPushApiResponse,
  MpesaStkPushInput,
  MpesaStkPushRequest,
  MpesaStkPushResult,
} from './mpesa-stk-push.types';

// =============================================================================
// Constants
// =============================================================================

const MPESA_SANDBOX_BASE_URL = 'https://sandbox.safaricom.co.ke';

const MPESA_PRODUCTION_BASE_URL = 'https://api.safaricom.co.ke';

const MPESA_STK_PUSH_ENDPOINT = '/mpesa/stkpush/v1/processrequest';

const MINIMUM_AMOUNT = 1;

const MAXIMUM_ACCOUNT_REFERENCE_LENGTH = 12;

const MAXIMUM_TRANSACTION_DESCRIPTION_LENGTH = 13;

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class MpesaStkPushService {
  private readonly logger = new Logger(MpesaStkPushService.name);

  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly configurationService: FinancialPaymentProviderConfigurationService,

    private readonly oauthService: MpesaOAuthService,

    private readonly httpClient: MpesaHttpClient,
  ) {}

  // ===========================================================================
  // Initiate STK Push
  // ===========================================================================

  public async initiate(input: MpesaStkPushInput): Promise<MpesaStkPushResult> {
    // -------------------------------------------------------------------------
    // 1. Validate caller-supplied input
    // -------------------------------------------------------------------------

    this.validateInput(input);

    // -------------------------------------------------------------------------
    // 2. Resolve M-PESA provider
    // -------------------------------------------------------------------------

    const providerPublicId = new FinancialPaymentProviderPublicId(
      input.providerPublicId,
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

    const endpoint = `${baseUrl}${MPESA_STK_PUSH_ENDPOINT}`;

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
    // 5. Resolve trusted backend callback URL
    // -------------------------------------------------------------------------

    const callbackUrl = process.env.MPESA_CALLBACK_URL?.trim();

    if (!callbackUrl) {
      throw new Error(
        'MPESA_CALLBACK_URL is not configured in the backend environment.',
      );
    }

    this.validateCallbackUrl(callbackUrl);

    // -------------------------------------------------------------------------
    // 6. Obtain OAuth access token
    // -------------------------------------------------------------------------

    const accessToken =
      await this.oauthService.getAccessToken(providerPublicId);

    // -------------------------------------------------------------------------
    // 7. Generate Daraja timestamp
    // -------------------------------------------------------------------------

    const timestamp = this.generateTimestamp();

    // -------------------------------------------------------------------------
    // 8. Generate Lipa Na M-PESA password
    // -------------------------------------------------------------------------

    const password = this.generatePassword(shortcode, passkey, timestamp);

    // -------------------------------------------------------------------------
    // 9. Normalize customer phone number
    // -------------------------------------------------------------------------

    const phoneNumber = this.normalizePhoneNumber(input.phoneNumber);

    // -------------------------------------------------------------------------
    // 10. Build Daraja STK Push request
    // -------------------------------------------------------------------------

    const request: MpesaStkPushRequest = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: input.transactionType ?? 'CustomerPayBillOnline',
      Amount: input.amount,
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: input.accountReference.trim(),
      TransactionDesc: input.transactionDescription.trim(),
    };

    // -------------------------------------------------------------------------
    // 11. Submit STK Push request
    // -------------------------------------------------------------------------
    //
    // Once this HTTP submission begins, a connection failure or timeout
    // cannot safely establish that Safaricom did not receive the request.
    //
    // Therefore, submission errors are treated as UNCERTAIN unless a
    // structured Safaricom response establishes another outcome.
    //
    // Any returned identifiers must be preserved for reconciliation.
    //
    // Never automatically submit another STK Push from this service.
    // -------------------------------------------------------------------------

    try {
      const response = await this.httpClient.post<MpesaStkPushApiResponse>(
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

      return this.normalizeApiResponse(response.data);
    } catch (error: unknown) {
      // Axios may reject an HTTP response even when Safaricom returned
      // a structured response body.
      //
      // Always normalize and preserve that body, including partial
      // MerchantRequestID and CheckoutRequestID values.

      const responseData = this.extractErrorResponseData(error);

      if (responseData !== null) {
        return this.normalizeApiResponse(responseData);
      }

      // No structured response was received.
      //
      // The request may nevertheless have reached Safaricom.
      // Do not classify this as a confirmed rejection.

      this.logger.error(
        'M-PESA STK Push submission outcome is uncertain. Manual or callback reconciliation is required.',
      );

      return {
        outcome: 'UNCERTAIN',
        accepted: false,
        merchantRequestId: null,
        checkoutRequestId: null,
        responseCode: null,
        responseDescription:
          'The STK Push submission outcome could not be established.',
        customerMessage:
          'Payment status is being verified. Do not initiate another payment.',
      };
    }
  }

  // ===========================================================================
  // Normalize Safaricom API Response
  // ===========================================================================

  private normalizeApiResponse(payload: unknown): MpesaStkPushResult {
    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      return this.uncertainResult(
        'Safaricom returned an invalid or incomplete response.',
      );
    }

    const response = payload as Partial<MpesaStkPushApiResponse>;

    // -------------------------------------------------------------------------
    // Preserve every identifier independently
    // -------------------------------------------------------------------------

    const merchantRequestId = this.normalizeIdentifier(
      response.MerchantRequestID,
    );

    const checkoutRequestId = this.normalizeIdentifier(
      response.CheckoutRequestID,
    );

    const responseCode = this.normalizeIdentifier(response.ResponseCode);

    const responseDescription = this.normalizeIdentifier(
      response.ResponseDescription,
    );

    const customerMessage = this.normalizeIdentifier(response.CustomerMessage);

    // -------------------------------------------------------------------------
    // Explicit acceptance
    // -------------------------------------------------------------------------

    // ResponseCode 0 means Safaricom has accepted the STK Push request.
    //
    // Missing identifiers do not turn acceptance into rejection.
    // Preserve any identifier that was returned.

    if (responseCode === '0') {
      return {
        outcome: 'ACCEPTED',
        accepted: true,
        merchantRequestId,
        checkoutRequestId,
        responseCode,
        responseDescription,
        customerMessage,
      };
    }

    // -------------------------------------------------------------------------
    // Explicit rejection
    // -------------------------------------------------------------------------

    // A structured Daraja response containing a non-zero ResponseCode
    // is treated as an explicit rejection.
    //
    // Responses without a ResponseCode remain uncertain.

    if (responseCode !== null) {
      return {
        outcome: 'REJECTED',
        accepted: false,
        merchantRequestId,
        checkoutRequestId,
        responseCode,
        responseDescription,
        customerMessage,
      };
    }

    // -------------------------------------------------------------------------
    // Incomplete or ambiguous response
    // -------------------------------------------------------------------------

    // Preserve partial identifiers even when Safaricom did not provide
    // enough information to establish acceptance or rejection.

    return {
      outcome: 'UNCERTAIN',
      accepted: false,
      merchantRequestId,
      checkoutRequestId,
      responseCode,
      responseDescription:
        responseDescription ??
        'Safaricom response did not establish the request outcome.',
      customerMessage:
        customerMessage ??
        'Payment status is being verified. Do not initiate another payment.',
    };
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
  // Normalize Identifier
  // ===========================================================================

  private normalizeIdentifier(value: string | null | undefined): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim();

    return normalized.length > 0 ? normalized : null;
  }

  // ===========================================================================
  // Uncertain Result
  // ===========================================================================

  private uncertainResult(description: string): MpesaStkPushResult {
    return {
      outcome: 'UNCERTAIN',
      accepted: false,
      merchantRequestId: null,
      checkoutRequestId: null,
      responseCode: null,
      responseDescription: description,
      customerMessage:
        'Payment status is being verified. Do not initiate another payment.',
    };
  }

  // ===========================================================================
  // Input Validation
  // ===========================================================================

  private validateInput(input: MpesaStkPushInput): void {
    if (!input.providerPublicId?.trim()) {
      throw new Error('M-PESA provider public ID is required.');
    }

    if (!Number.isInteger(input.amount) || input.amount < MINIMUM_AMOUNT) {
      throw new Error(
        'M-PESA transaction amount must be a positive whole number.',
      );
    }

    if (!input.accountReference?.trim()) {
      throw new Error('M-PESA account reference is required.');
    }

    if (
      input.accountReference.trim().length > MAXIMUM_ACCOUNT_REFERENCE_LENGTH
    ) {
      throw new Error(
        `M-PESA account reference must not exceed ${MAXIMUM_ACCOUNT_REFERENCE_LENGTH} characters.`,
      );
    }

    if (!input.transactionDescription?.trim()) {
      throw new Error('M-PESA transaction description is required.');
    }

    if (
      input.transactionDescription.trim().length >
      MAXIMUM_TRANSACTION_DESCRIPTION_LENGTH
    ) {
      throw new Error(
        `M-PESA transaction description must not exceed ${MAXIMUM_TRANSACTION_DESCRIPTION_LENGTH} characters.`,
      );
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
      throw new Error('M-PESA callback URL must be a valid URL.');
    }

    if (parsedUrl.protocol !== 'https:') {
      throw new Error('M-PESA callback URL must use HTTPS.');
    }

    if (!parsedUrl.hostname) {
      throw new Error('M-PESA callback URL must have a valid hostname.');
    }
  }

  // ===========================================================================
  // Phone Number Normalization
  // ===========================================================================

  private normalizePhoneNumber(value: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('M-PESA customer phone number is required.');
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

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default MpesaStkPushService;
