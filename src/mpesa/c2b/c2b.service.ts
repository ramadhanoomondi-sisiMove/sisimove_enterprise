/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Service
 * -----------------------------------------------------------------------------
 *
 * Handles:
 * - C2B validation and confirmation URL registration;
 * - Sandbox C2B payment simulation;
 * - Retrieval of customer payment instructions.
 *
 * C2B uses its independently configured shortcode and business type.
 * STK Push and B2C configurations remain separate.
 *
 * This service communicates with Safaricom only. FinancialModule owns
 * payment matching, reconciliation, payment state and financial effects.
 * -----------------------------------------------------------------------------
 */

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { MpesaOAuthService } from '../auth/mpesa-oauth.service';
import { MpesaHttpService } from '../common/mpesa-http.service';

import { MPESA_C2B, MPESA_C2B_COMMANDS } from '../common/mpesa.constants';

import type { MpesaEnvironment } from '../common/mpesa.config';

import type {
  MpesaC2BRegisterUrlRequest,
  MpesaC2BRegisterUrlResponse,
  MpesaC2BSimulationRequest,
  MpesaApiResponse,
} from '../common/mpesa.types';

// -----------------------------------------------------------------------------
// Financial Payment Provider — Domain
// -----------------------------------------------------------------------------

import { FinancialPaymentProviderPublicId } from '../../domains/financial-payment-providers/domain/value-objects/financial-payment-provider-public-id.vo';

import { FinancialPaymentProviderCode } from '../../domains/financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';

import { FinancialPaymentProviderCapabilityType } from '../../domains/financial-payment-providers/domain/value-objects/financial-payment-provider-capability-type.vo';

import type { FinancialPaymentProviderRepository } from '../../domains/financial-payment-providers/domain/repositories/financial-payment-provider.repository';

// -----------------------------------------------------------------------------
// Financial Payment Provider — Application
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../domains/financial-payment-providers/application/financial-payment-providers.tokens';

import { FinancialPaymentProviderConfigurationService } from '../../domains/financial-payment-providers/application/services/financial-payment-provider-configuration.service';

// -----------------------------------------------------------------------------
// DTOs
// -----------------------------------------------------------------------------

import type C2BRegisterUrlDto from './dto/c2b-register-urls.dto';

import type C2BSimulateRequestDto from './dto/c2b-simulate-request.dto';

// =============================================================================
// Types
// =============================================================================

export type MpesaC2BBusinessType = 'PAYBILL' | 'BUY_GOODS';

interface ResolvedC2BConfiguration {
  readonly environment: MpesaEnvironment;
  readonly shortcode: string;
  readonly businessType: MpesaC2BBusinessType;
  readonly validationUrl: string | undefined;
  readonly confirmationUrl: string | undefined;
}

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class C2BService {
  public constructor(
    private readonly oauthService: MpesaOAuthService,

    private readonly httpService: MpesaHttpService,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly configurationService: FinancialPaymentProviderConfigurationService,
  ) {}

  // ===========================================================================
  // Register C2B URLs
  // ===========================================================================

  public async registerUrls(
    dto: C2BRegisterUrlDto,
  ): Promise<MpesaC2BRegisterUrlResponse> {
    const configuration = await this.getC2BConfiguration(dto.providerPublicId);

    const { environment, shortcode, validationUrl, confirmationUrl } =
      configuration;

    if (!validationUrl || !confirmationUrl) {
      throw new HttpException(
        'C2B validation and confirmation URLs must be configured.',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.validateCallbackUrl(validationUrl, environment);
    this.validateCallbackUrl(confirmationUrl, environment);

    const accessToken = await this.oauthService.getAccessToken(
      dto.providerPublicId,
    );

    const request: MpesaC2BRegisterUrlRequest = {
      ShortCode: shortcode,
      ResponseType: dto.responseType,
      ConfirmationURL: confirmationUrl,
      ValidationURL: validationUrl,
    };

    const response = await this.httpService.post<MpesaC2BRegisterUrlResponse>(
      environment,
      MPESA_C2B.REGISTER_URL_PATH,
      request,
      { accessToken },
    );

    if (response.ResponseCode !== '0') {
      throw new HttpException(
        response.ResponseDescription ||
          'Safaricom rejected C2B URL registration.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return response;
  }

  // ===========================================================================
  // Simulate C2B Payment — Sandbox Only
  // ===========================================================================

  public async simulatePayment(
    dto: C2BSimulateRequestDto,
  ): Promise<MpesaApiResponse> {
    const configuration = await this.getC2BConfiguration(dto.providerPublicId);

    const { environment, shortcode, businessType } = configuration;

    if (environment !== 'sandbox') {
      throw new HttpException(
        'C2B simulation is only available in the M-PESA sandbox environment.',
        HttpStatus.FORBIDDEN,
      );
    }

    const expectedCommandId =
      businessType === 'PAYBILL'
        ? MPESA_C2B_COMMANDS.CUSTOMER_PAYBILL_ONLINE
        : MPESA_C2B_COMMANDS.CUSTOMER_BUY_GOODS_ONLINE;

    if (dto.commandId !== expectedCommandId) {
      throw new HttpException(
        'The C2B command ID does not match the configured business type.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const accessToken = await this.oauthService.getAccessToken(
      dto.providerPublicId,
    );

    const request: MpesaC2BSimulationRequest = {
      ShortCode: shortcode,
      CommandID: expectedCommandId,
      Amount: dto.amount,
      Msisdn: dto.phoneNumber,
      ...(dto.billRefNumber !== undefined
        ? { BillRefNumber: dto.billRefNumber }
        : {}),
    };

    return this.httpService.post<MpesaApiResponse>(
      environment,
      MPESA_C2B.SIMULATE_PATH,
      request,
      { accessToken },
    );
  }

  // ===========================================================================
  // Get Customer Payment Instructions
  // ===========================================================================

  /**
   * Resolves the operational M-PESA provider and returns its configured
   * C2B shortcode, business type and environment.
   *
   * Customers do not supply provider identifiers.
   */
  public async getPaymentInstructions(): Promise<{
    shortcode: string;
    businessType: MpesaC2BBusinessType;
    environment: MpesaEnvironment;
  }> {
    const provider = await this.providerRepository.findByCode(
      FinancialPaymentProviderCode.create('MPESA'),
    );

    if (provider === null) {
      throw new HttpException(
        'M-PESA payment provider was not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    const webhookCapability =
      FinancialPaymentProviderCapabilityType.create('WEBHOOKS');

    try {
      provider.ensureCanPerform(webhookCapability);
    } catch {
      throw new HttpException(
        'M-PESA C2B webhook capability is not operational.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (provider.environment === null) {
      throw new HttpException(
        'M-PESA environment is not configured.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const providerPublicId = provider.publicId.value;

    const { shortcode, businessType, environment } =
      await this.getC2BConfiguration(providerPublicId);

    return {
      shortcode,
      businessType,
      environment,
    };
  }

  // ===========================================================================
  // Resolve Provider Configuration
  // ===========================================================================

  private async getC2BConfiguration(
    providerPublicId: string,
  ): Promise<ResolvedC2BConfiguration> {
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

    const configuration = await this.configurationService.getConfiguration(
      provider.id.toString(),
      providerEnvironment,
    );

    if (configuration === null) {
      throw new HttpException(
        'M-PESA configuration was not found.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // C2B must use its own shortcode, never the STK Push shortcode.
    const shortcode = configuration.c2bShortcode;

    if (!shortcode) {
      throw new HttpException(
        'M-PESA C2B shortcode is not configured.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // The C2B business type must be explicitly configured.
    const businessType = configuration.c2bBusinessType;

    if (businessType !== 'PAYBILL' && businessType !== 'BUY_GOODS') {
      throw new HttpException(
        'M-PESA C2B business type must be configured as PAYBILL or BUY_GOODS.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      environment,
      shortcode,
      businessType,
      validationUrl: configuration.validationUrl,
      confirmationUrl: configuration.confirmationUrl,
    };
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
      throw new HttpException(
        'C2B callback URL is invalid.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      throw new HttpException(
        'C2B callback URLs must use HTTP or HTTPS.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (environment === 'production' && parsedUrl.protocol !== 'https:') {
      throw new HttpException(
        'Production C2B callback URLs must use HTTPS.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

export default C2BService;
