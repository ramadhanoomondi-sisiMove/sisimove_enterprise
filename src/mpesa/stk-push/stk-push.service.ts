/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 STK Push Service
 * -----------------------------------------------------------------------------
 *
 * Initiates customer payments through Safaricom Daraja M-PESA Express.
 *
 * Responsibilities:
 * - Retrieve and validate the configured M-PESA provider.
 * - Retrieve the provider's encrypted STK Push configuration.
 * - Retrieve the STK callback URL from runtime environment configuration.
 * - Obtain a Daraja OAuth access token.
 * - Normalize and validate Kenyan phone numbers for Daraja.
 * - Generate the Daraja timestamp and STK Push password.
 * - Submit the STK Push request.
 * - Return normalized Safaricom request identifiers.
 *
 * Architectural boundary:
 * - Does not create or update financial payment records.
 * - Does not update wallets, balances, or ledger entries.
 * - FinancialModule exclusively owns financial state transitions.
 * - Request acceptance does not mean payment completion.
 * - Payment completion is handled through the callback workflow.
 *
 * -----------------------------------------------------------------------------
 */

import { Buffer } from 'node:buffer';

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { MpesaOAuthService } from '../auth/mpesa-oauth.service';

import { MpesaHttpService } from '../common/mpesa-http.service';

import {
  MPESA_STK_PUSH,
  MPESA_STK_TRANSACTION_TYPES,
} from '../common/mpesa.constants';

import type { MpesaEnvironment } from '../common/mpesa.config';

import { MpesaErrorCode, MpesaException } from '../common/mpesa-exception';

import type {
  MpesaStkPushRequest,
  MpesaStkPushResponse,
} from '../common/mpesa.types';

import { FinancialPaymentProviderPublicId } from '../../domains/financial-payment-providers/domain/value-objects/financial-payment-provider-public-id.vo';

import type { FinancialPaymentProviderRepository } from '../../domains/financial-payment-providers/domain/repositories/financial-payment-provider.repository';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../domains/financial-payment-providers/application/financial-payment-providers.tokens';

import { FinancialPaymentProviderConfigurationService } from '../../domains/financial-payment-providers/application/services/financial-payment-provider-configuration.service';

import type { StkPushRequestDto } from './dto/stk-push-request.dto';

import type { StkPushResponseDto } from './dto/stk-push-response.dto';

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class StkPushService {
  private static readonly NAIROBI_TIME_ZONE = 'Africa/Nairobi';

  public constructor(
    private readonly oauthService: MpesaOAuthService,

    private readonly httpService: MpesaHttpService,

    private readonly configService: ConfigService,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly configurationService: FinancialPaymentProviderConfigurationService,
  ) {}

  // ===========================================================================
  // Initiate STK Push
  // ===========================================================================

  public async initiate(dto: StkPushRequestDto): Promise<StkPushResponseDto> {
    // -------------------------------------------------------------------------
    // 1. Validate provider public ID
    // -------------------------------------------------------------------------

    const providerPublicId = dto.providerPublicId.trim();

    if (!providerPublicId) {
      throw new MpesaException({
        code: MpesaErrorCode.VALIDATION_FAILED,
        message: 'M-PESA provider public ID is required.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // -------------------------------------------------------------------------
    // 2. Retrieve and validate provider
    // -------------------------------------------------------------------------

    const publicId = new FinancialPaymentProviderPublicId(providerPublicId);

    const provider = await this.providerRepository.findByPublicId(publicId);

    if (provider === null) {
      throw new HttpException(
        'M-PESA payment provider was not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!provider.isEnabled || !provider.status.isReady()) {
      throw new MpesaException({
        code: MpesaErrorCode.PROVIDER_UNAVAILABLE,
        message: 'M-PESA provider is not operational.',
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      });
    }

    // -------------------------------------------------------------------------
    // 3. Resolve provider environment
    // -------------------------------------------------------------------------

    const providerEnvironment = provider.environment;

    if (providerEnvironment === null) {
      throw new MpesaException({
        code: MpesaErrorCode.CONFIGURATION_ERROR,
        message: 'M-PESA provider environment is not configured.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const environment: MpesaEnvironment = providerEnvironment.isSandbox()
      ? 'sandbox'
      : 'production';

    // -------------------------------------------------------------------------
    // 4. Retrieve encrypted provider configuration
    // -------------------------------------------------------------------------

    const configuration = await this.configurationService.getConfiguration(
      provider.id.toString(),
      providerEnvironment,
    );

    if (configuration === null) {
      throw new MpesaException({
        code: MpesaErrorCode.CONFIGURATION_ERROR,
        message: 'M-PESA provider configuration was not found.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Shortcode and passkey remain provider-specific encrypted credentials.
    const shortcode = configuration.stkBusinessShortCode?.trim();
    const passkey = configuration.stkPasskey?.trim();

    // Callback URL is supplied through runtime environment configuration.
    const callbackUrl = this.configService
      .get<string>('MPESA_CALLBACK_URL')
      ?.trim();

    // -------------------------------------------------------------------------
    // 5. Validate required STK Push configuration
    // -------------------------------------------------------------------------

    if (!shortcode || !passkey || !callbackUrl) {
      throw new MpesaException({
        code: MpesaErrorCode.CONFIGURATION_ERROR,
        message:
          'STK Push requires a provider shortcode, passkey and MPESA_CALLBACK_URL.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // -------------------------------------------------------------------------
    // 6. Validate callback URL
    // -------------------------------------------------------------------------

    this.validateCallbackUrl(callbackUrl, environment);

    // -------------------------------------------------------------------------
    // 7. Normalize and validate customer phone number
    // -------------------------------------------------------------------------

    const phoneNumber = this.normalizeDarajaPhoneNumber(dto.phoneNumber);

    // -------------------------------------------------------------------------
    // 8. Generate Daraja timestamp
    // -------------------------------------------------------------------------

    const timestamp = this.generateTimestamp();

    // -------------------------------------------------------------------------
    // 9. Generate STK Push password
    // -------------------------------------------------------------------------

    const password = Buffer.from(
      `${shortcode}${passkey}${timestamp}`,
      'utf8',
    ).toString('base64');

    // -------------------------------------------------------------------------
    // 10. Obtain OAuth access token
    // -------------------------------------------------------------------------

    const accessToken =
      await this.oauthService.getAccessToken(providerPublicId);

    // -------------------------------------------------------------------------
    // 11. Build Daraja STK Push request
    // -------------------------------------------------------------------------

    const request: MpesaStkPushRequest = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: MPESA_STK_TRANSACTION_TYPES.CUSTOMER_PAYBILL_ONLINE,
      Amount: dto.amount,
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: dto.accountReference,
      TransactionDesc: dto.transactionDescription,
    };

    // -------------------------------------------------------------------------
    // 12. Submit STK Push request
    // -------------------------------------------------------------------------

    const response = await this.httpService.post<MpesaStkPushResponse>(
      environment,
      MPESA_STK_PUSH.PROCESS_REQUEST_PATH,
      request,
      {
        accessToken,
      },
    );

    // -------------------------------------------------------------------------
    // 13. Validate Daraja response
    // -------------------------------------------------------------------------

    const checkoutRequestId = response.CheckoutRequestID?.trim();
    const merchantRequestId = response.MerchantRequestID?.trim();

    if (
      response.ResponseCode !== '0' ||
      !checkoutRequestId ||
      !merchantRequestId
    ) {
      throw new MpesaException({
        code: MpesaErrorCode.REQUEST_FAILED,
        message: 'Safaricom did not accept the STK Push request.',
        statusCode: HttpStatus.BAD_GATEWAY,
        ...((response.errorCode ?? response.ResponseCode) !== undefined
          ? {
              providerCode: response.errorCode ?? response.ResponseCode,
            }
          : {}),
      });
    }

    // -------------------------------------------------------------------------
    // 14. Normalize response
    // -------------------------------------------------------------------------

    const customerMessage = response.CustomerMessage?.trim();

    const paymentReference = dto.paymentReference?.trim();

    return {
      responseCode: response.ResponseCode,
      responseDescription:
        response.ResponseDescription?.trim() || 'STK Push request accepted.',
      merchantRequestId,
      checkoutRequestId,

      ...(customerMessage ? { customerMessage } : {}),

      ...(paymentReference ? { paymentReference } : {}),
    };
  }

  // ===========================================================================
  // Daraja Phone Number Normalization
  // ===========================================================================

  /**
   * Converts supported Kenyan mobile number formats into the format
   * required by Safaricom Daraja.
   *
   * FinancialModule stores phone numbers in canonical +254 format.
   * Daraja requires 254 format without the leading plus sign.
   *
   * Accepted:
   * - 0712345678
   * - 0112345678
   * - 254712345678
   * - 254112345678
   * - +254712345678
   * - +254112345678
   *
   * Returns:
   * - 254712345678
   * - 254112345678
   */
  private normalizeDarajaPhoneNumber(value: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new MpesaException({
        code: MpesaErrorCode.VALIDATION_FAILED,
        message: 'Customer M-PESA phone number is required.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const normalized = value.trim().replace(/[\s()-]/g, '');

    const internationalPhoneNumber = normalized.startsWith('+')
      ? normalized.slice(1)
      : normalized;

    if (!/^254[17]\d{8}$/.test(internationalPhoneNumber)) {
      throw new MpesaException({
        code: MpesaErrorCode.VALIDATION_FAILED,
        message: 'Invalid Kenyan M-PESA phone number.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return internationalPhoneNumber;
  }

  // ===========================================================================
  // Callback URL Validation
  // ===========================================================================

  private validateCallbackUrl(
    callbackUrl: string,
    environment: MpesaEnvironment,
  ): void {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(callbackUrl);
    } catch {
      throw new MpesaException({
        code: MpesaErrorCode.CONFIGURATION_ERROR,
        message: 'STK Push callback URL is invalid.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (!parsedUrl.hostname) {
      throw new MpesaException({
        code: MpesaErrorCode.CONFIGURATION_ERROR,
        message: 'STK Push callback URL must contain a valid hostname.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (environment === 'production' && parsedUrl.protocol !== 'https:') {
      throw new MpesaException({
        code: MpesaErrorCode.CONFIGURATION_ERROR,
        message: 'Production STK Push callback URL must use HTTPS.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      throw new MpesaException({
        code: MpesaErrorCode.CONFIGURATION_ERROR,
        message: 'STK Push callback URL must use HTTP or HTTPS.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (parsedUrl.username || parsedUrl.password) {
      throw new MpesaException({
        code: MpesaErrorCode.CONFIGURATION_ERROR,
        message: 'STK Push callback URL must not contain credentials.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  // ===========================================================================
  // Daraja Timestamp
  // ===========================================================================

  /**
   * Generates YYYYMMDDHHmmss in the Africa/Nairobi timezone.
   *
   * This avoids relying on the server's configured timezone.
   */
  private generateTimestamp(): string {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: StkPushService.NAIROBI_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date());

    const getPart = (type: Intl.DateTimeFormatPartTypes): string => {
      const value = parts.find((part) => part.type === type)?.value;

      if (value === undefined) {
        throw new MpesaException({
          code: MpesaErrorCode.UNKNOWN_ERROR,
          message: 'Unable to generate the M-PESA request timestamp.',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }

      return value;
    };

    return [
      getPart('year'),
      getPart('month'),
      getPart('day'),
      getPart('hour'),
      getPart('minute'),
      getPart('second'),
    ].join('');
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default StkPushService;
