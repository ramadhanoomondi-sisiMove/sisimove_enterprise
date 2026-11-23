/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Service
 * -----------------------------------------------------------------------------
 *
 * Handles:
 * - C2B validation and confirmation URL registration;
 * - Sandbox C2B PayBill payment simulation;
 * - Retrieval of customer PayBill payment instructions.
 *
 * C2B uses its independently configured shortcode.
 * Only PAYBILL is supported.
 *
 * STK Push and B2C configurations remain separate.
 *
 * Callback URLs are loaded from runtime environment configuration.
 *
 * This service communicates with Safaricom only.
 *
 * FinancialModule owns:
 * - Payment matching;
 * - Reconciliation;
 * - Payment state;
 * - Financial effects.
 * -----------------------------------------------------------------------------
 */

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

// =============================================================================
// M-PESA Infrastructure
// =============================================================================

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

// =============================================================================
// Financial Payment Provider — Domain
// =============================================================================

import { FinancialPaymentProviderPublicId } from '../../domains/financial-payment-providers/domain/value-objects/financial-payment-provider-public-id.vo';

import { FinancialPaymentProviderCode } from '../../domains/financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';

import { FinancialPaymentProviderCapabilityType } from '../../domains/financial-payment-providers/domain/value-objects/financial-payment-provider-capability-type.vo';

import type { FinancialPaymentProviderRepository } from '../../domains/financial-payment-providers/domain/repositories/financial-payment-provider.repository';

// =============================================================================
// Financial Payment Provider — Application
// =============================================================================

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../domains/financial-payment-providers/application/financial-payment-providers.tokens';

import { FinancialPaymentProviderConfigurationService } from '../../domains/financial-payment-providers/application/services/financial-payment-provider-configuration.service';

// =============================================================================
// DTOs
// =============================================================================

import type C2BRegisterUrlDto from './dto/c2b-register-urls.dto';

import type C2BSimulateRequestDto from './dto/c2b-simulate-request.dto';

// =============================================================================
// Types
// =============================================================================

export type MpesaC2BBusinessType = 'PAYBILL';

interface ResolvedC2BConfiguration {
  readonly environment: MpesaEnvironment;
  readonly shortcode: string;
  readonly businessType: MpesaC2BBusinessType;
  readonly validationUrl?: string;
  readonly confirmationUrl?: string;
}

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class C2BService {
  private readonly logger = new Logger(C2BService.name);

  public constructor(
    private readonly oauthService: MpesaOAuthService,

    private readonly httpService: MpesaHttpService,

    private readonly configService: ConfigService,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly configurationService: FinancialPaymentProviderConfigurationService,
  ) {}

  // ===========================================================================
  // Register C2B Validation and Confirmation URLs
  // ===========================================================================

  /**
   * Registers the configured C2B callback URLs with Safaricom.
   *
   * C2B shortcode and business type are resolved from encrypted provider
   * configuration.
   *
   * Callback URLs are resolved from runtime environment configuration.
   *
   * The request DTO supplies the provider public ID and Daraja response type.
   *
   * This method only registers URLs with Safaricom. It does not create or
   * modify any FinancialModule payment records.
   */
  public async registerUrls(
    dto: C2BRegisterUrlDto,
  ): Promise<MpesaC2BRegisterUrlResponse> {
    const configuration = await this.getC2BConfiguration(dto.providerPublicId);

    const { environment, shortcode, validationUrl, confirmationUrl } =
      configuration;

    if (!validationUrl || !confirmationUrl) {
      throw new HttpException(
        'C2B validation and confirmation URLs must be configured using MPESA_C2B_VALIDATION_URL and MPESA_C2B_CONFIRMATION_URL.',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.validateCallbackUrl(validationUrl, environment);

    this.validateCallbackUrl(confirmationUrl, environment);

    if (validationUrl === confirmationUrl) {
      throw new HttpException(
        'C2B validation and confirmation URLs must be different.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const accessToken = await this.oauthService.getAccessToken(
      dto.providerPublicId,
    );

    const request: MpesaC2BRegisterUrlRequest = {
      ShortCode: shortcode,
      ResponseType: dto.responseType,
      ConfirmationURL: confirmationUrl,
      ValidationURL: validationUrl,
    };
    this.logger.log(
      `Registering M-PESA C2B URLs: ${JSON.stringify({
        environment,
        shortcode,
        responseType: dto.responseType,
        confirmationUrl,
        validationUrl,
      })}`,
    );
    const response = await this.httpService.post<MpesaC2BRegisterUrlResponse>(
      environment,
      MPESA_C2B.REGISTER_URL_PATH,
      request,
      { accessToken },
    );

    // -------------------------------------------------------------------------
    // Safe provider response diagnostics.
    // Never log access tokens, credentials, or request headers.
    // -------------------------------------------------------------------------

    this.logger.log(
      `C2B URL registration response: ${JSON.stringify({
        responseCode: response.ResponseCode ?? null,
        responseDescription: response.ResponseDescription ?? null,
        originatorConversationID: response.OriginatorConversationID ?? null,
        conversationID: response.ConversationID ?? null,
      })}`,
    );

    // -------------------------------------------------------------------------
    // Validate Daraja response.
    // Handles both numeric 0 and string "0".
    // -------------------------------------------------------------------------

    const responseCode = String(response.ResponseCode ?? '').trim();
    const responseDescription = String(
      response.ResponseDescription ?? '',
    ).trim();

    const registrationSuccessful =
      responseCode === '0' || responseCode === '00000000';

    if (!registrationSuccessful) {
      throw new HttpException(
        responseDescription || 'Safaricom rejected C2B URL registration.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return response;
  }

  // ===========================================================================
  // Simulate C2B PayBill Payment — Sandbox Only
  // ===========================================================================

  /**
   * Initiates a Daraja C2B PayBill simulation.
   *
   * Simulation is strictly restricted to sandbox.
   * The command ID must match the PayBill configuration.
   *
   * BillRefNumber is passed through as supplied. In the SisiMove payment
   * workflow, this should be the payment-specific C2B reference generated
   * by FinancialModule.
   */
  public async simulatePayment(
    dto: C2BSimulateRequestDto,
  ): Promise<MpesaApiResponse> {
    const configuration = await this.getC2BConfiguration(dto.providerPublicId);

    const { environment, shortcode } = configuration;

    if (environment !== 'sandbox') {
      throw new HttpException(
        'C2B simulation is only available in the M-PESA sandbox environment.',
        HttpStatus.FORBIDDEN,
      );
    }

    const expectedCommandId = MPESA_C2B_COMMANDS.CUSTOMER_PAYBILL_ONLINE;

    if (dto.commandId !== expectedCommandId) {
      throw new HttpException(
        'The C2B command ID must be CUSTOMER_PAYBILL_ONLINE.',
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
        ? {
            BillRefNumber: dto.billRefNumber.trim(),
          }
        : {}),
    };

    this.logger.log(
      `Submitting M-PESA C2B simulation: ${JSON.stringify({
        environment,
        shortcode,
        commandId: expectedCommandId,
        amount: dto.amount,
        billRefNumber: dto.billRefNumber?.trim() ?? null,
      })}`,
    );

    const response = await this.httpService.post<MpesaApiResponse>(
      environment,
      MPESA_C2B.SIMULATE_PATH,
      request,
      { accessToken },
    );

    this.logger.warn(
      `C2B_SIMULATION_PROVIDER_RESPONSE: ${JSON.stringify({
        environment,
        shortcode,
        responseCode: response.ResponseCode ?? null,
        responseDescription: response.ResponseDescription ?? null,
        originatorConversationID: response.OriginatorConversationID ?? null,
        conversationID: response.ConversationID ?? null,
      })}`,
    );

    return response;
  }

  // ===========================================================================
  // Get Customer PayBill Payment Instructions
  // ===========================================================================

  /**
   * Resolves the operational M-PESA provider and returns its configured
   * C2B PayBill shortcode and environment.
   *
   * Customers do not supply provider identifiers.
   *
   * This method does not resolve customer financial accounts.
   * Payment-specific references are generated by FinancialModule.
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

  /**
   * Resolves the M-PESA provider configuration for the requested environment.
   *
   * C2B uses its own shortcode.
   * Only PAYBILL is accepted.
   *
   * STK Push and B2C configuration values are not used here.
   *
   * Callback URLs are loaded independently from runtime configuration.
   */
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

    // -------------------------------------------------------------------------
    // Verify provider operational status.
    // -------------------------------------------------------------------------

    if (!provider.isEnabled || !provider.status.isReady()) {
      throw new HttpException(
        'M-PESA provider is not operational.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // -------------------------------------------------------------------------
    // Verify webhook capability.
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Resolve provider environment.
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Resolve encrypted provider configuration.
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Resolve the independent C2B shortcode.
    // -------------------------------------------------------------------------

    const shortcode = configuration.c2bShortCode?.trim();

    if (!shortcode || !/^\d{5,10}$/.test(shortcode)) {
      throw new HttpException(
        'A valid M-PESA C2B PayBill shortcode is not configured.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // -------------------------------------------------------------------------
    // Enforce PayBill-only configuration.
    // -------------------------------------------------------------------------

    if (configuration.c2bBusinessType !== 'PAYBILL') {
      throw new HttpException(
        'SisiMove C2B is configured for PayBill only. Set c2bBusinessType to PAYBILL.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // -------------------------------------------------------------------------
    // Resolve C2B callback URLs from runtime environment configuration.
    // -------------------------------------------------------------------------

    const validationUrl = this.configService
      .get<string>('MPESA_C2B_VALIDATION_URL')
      ?.trim();

    const confirmationUrl = this.configService
      .get<string>('MPESA_C2B_CONFIRMATION_URL')
      ?.trim();

    return {
      environment,
      shortcode,
      businessType: 'PAYBILL',
      ...(validationUrl ? { validationUrl } : {}),
      ...(confirmationUrl ? { confirmationUrl } : {}),
    };
  }

  // ===========================================================================
  // Callback URL Validation
  // ===========================================================================

  /**
   * Validates callback URL syntax and protocol.
   *
   * Production callback URLs must use HTTPS.
   *
   * Credentials embedded in URLs are not allowed.
   */
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

    if (parsedUrl.username || parsedUrl.password) {
      throw new HttpException(
        'C2B callback URLs must not contain credentials.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

export default C2BService;
