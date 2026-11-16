/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 STK Query Service
 * -----------------------------------------------------------------------------
 *
 * Queries the status of an existing M-PESA STK Push transaction.
 *
 * Responsibilities:
 * - Validate the provider and CheckoutRequestID.
 * - Retrieve the configured M-PESA provider.
 * - Retrieve the provider's encrypted STK configuration.
 * - Obtain a Daraja OAuth access token.
 * - Generate the Daraja timestamp and STK Query password.
 * - Submit the existing CheckoutRequestID to Safaricom.
 * - Return the provider query response.
 *
 * Architectural boundary:
 * - Never initiates a new payment.
 * - Does not create or modify financial payment records.
 * - Does not update payment attempts, wallets or ledger entries.
 * - Does not independently determine final payment status.
 * - FinancialModule remains responsible for financial state transitions.
 * -----------------------------------------------------------------------------
 */

import { Buffer } from 'node:buffer';

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { MpesaOAuthService } from '../auth/mpesa-oauth.service';

import { MpesaHttpService } from '../common/mpesa-http.service';

import { MPESA_STK_PUSH } from '../common/mpesa.constants';

import type { MpesaEnvironment } from '../common/mpesa.config';

import { MpesaErrorCode, MpesaException } from '../common/mpesa-exception';

import type {
  MpesaStkPushQueryRequest,
  MpesaStkPushQueryResponse,
} from '../common/mpesa.types';

import { FinancialPaymentProviderPublicId } from '../../domains/financial-payment-providers/domain/value-objects/financial-payment-provider-public-id.vo';

import type { FinancialPaymentProviderRepository } from '../../domains/financial-payment-providers/domain/repositories/financial-payment-provider.repository';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../domains/financial-payment-providers/application/financial-payment-providers.tokens';

import { FinancialPaymentProviderConfigurationService } from '../../domains/financial-payment-providers/application/services/financial-payment-provider-configuration.service';

// =============================================================================
// Input
// =============================================================================

export interface MpesaStkQueryInput {
  readonly providerPublicId: string;
  readonly checkoutRequestId: string;
}

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class MpesaStkQueryService {
  private static readonly NAIROBI_TIME_ZONE = 'Africa/Nairobi';

  public constructor(
    private readonly oauthService: MpesaOAuthService,

    private readonly httpService: MpesaHttpService,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly configurationService: FinancialPaymentProviderConfigurationService,
  ) {}

  // ===========================================================================
  // Query STK Push
  // ===========================================================================

  public async query(
    input: MpesaStkQueryInput,
  ): Promise<MpesaStkPushQueryResponse> {
    // -------------------------------------------------------------------------
    // 1. Validate input
    // -------------------------------------------------------------------------

    const providerPublicId = input.providerPublicId?.trim();
    const checkoutRequestId = input.checkoutRequestId?.trim();

    if (!providerPublicId) {
      throw new MpesaException({
        code: MpesaErrorCode.VALIDATION_FAILED,
        message: 'M-PESA provider public ID is required.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (!checkoutRequestId) {
      throw new MpesaException({
        code: MpesaErrorCode.VALIDATION_FAILED,
        message: 'M-PESA CheckoutRequestID is required.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // -------------------------------------------------------------------------
    // 2. Retrieve provider
    // -------------------------------------------------------------------------

    const provider = await this.providerRepository.findByPublicId(
      new FinancialPaymentProviderPublicId(providerPublicId),
    );

    if (provider === null) {
      throw new HttpException(
        'M-PESA payment provider was not found.',
        HttpStatus.NOT_FOUND,
      );
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

    const shortcode = configuration.shortcode?.trim();
    const passkey = configuration.passkey;

    if (!shortcode || !passkey?.trim()) {
      throw new MpesaException({
        code: MpesaErrorCode.CONFIGURATION_ERROR,
        message: 'STK Query requires a shortcode and passkey.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // -------------------------------------------------------------------------
    // 5. Generate Daraja timestamp
    // -------------------------------------------------------------------------

    const timestamp = this.generateTimestamp();

    // -------------------------------------------------------------------------
    // 6. Generate STK Query password
    // -------------------------------------------------------------------------

    const password = Buffer.from(
      `${shortcode}${passkey}${timestamp}`,
      'utf8',
    ).toString('base64');

    // -------------------------------------------------------------------------
    // 7. Obtain OAuth access token
    // -------------------------------------------------------------------------

    const accessToken =
      await this.oauthService.getAccessToken(providerPublicId);

    // -------------------------------------------------------------------------
    // 8. Build Daraja query request
    // -------------------------------------------------------------------------

    const request: MpesaStkPushQueryRequest = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    // -------------------------------------------------------------------------
    // 9. Submit query to Safaricom
    // -------------------------------------------------------------------------

    return this.httpService.post<MpesaStkPushQueryResponse>(
      environment,
      MPESA_STK_PUSH.QUERY_PATH,
      request,
      {
        accessToken,
      },
    );
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
      timeZone: MpesaStkQueryService.NAIROBI_TIME_ZONE,
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

export default MpesaStkQueryService;
