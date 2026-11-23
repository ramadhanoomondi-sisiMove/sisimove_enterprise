/**
 * -----------------------------------------------------------------------------
 * SisiMove — C2B Diagnostic Registration Service
 * -----------------------------------------------------------------------------
 *
 * Independently registers diagnostic C2B callback URLs with Safaricom.
 *
 * Reuses:
 * - Existing M-PESA provider configuration.
 * - Existing OAuth authentication.
 * - Existing Daraja HTTP transport.
 * - Existing C2B PayBill configuration validation.
 *
 * Does not:
 * - Modify the existing C2BService.
 * - Create financial payments.
 * - Modify FinancialModule records.
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

import { C2BService } from '../../c2b/c2b.service';
import { MpesaOAuthService } from '../../auth/mpesa-oauth.service';
import { MpesaHttpService } from '../../common/mpesa-http.service';

import { MPESA_C2B } from '../../common/mpesa.constants';

import { FinancialPaymentProviderCode } from '../../../domains/financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';

import type { FinancialPaymentProviderRepository } from '../../../domains/financial-payment-providers/domain/repositories/financial-payment-provider.repository';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../domains/financial-payment-providers/application/financial-payment-providers.tokens';

import type {
  MpesaC2BRegisterUrlRequest,
  MpesaC2BRegisterUrlResponse,
} from '../../common/mpesa.types';

@Injectable()
export class C2BDiagnosticRegistrationService {
  private readonly logger = new Logger(C2BDiagnosticRegistrationService.name);

  constructor(
    private readonly configService: ConfigService,

    private readonly c2bService: C2BService,

    private readonly oauthService: MpesaOAuthService,

    private readonly httpService: MpesaHttpService,

    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,
  ) {}

  /**
   * Registers independent diagnostic callback URLs with Safaricom.
   *
   * Sandbox only.
   */
  async register(): Promise<MpesaC2BRegisterUrlResponse> {
    // -------------------------------------------------------------------------
    // 1. Resolve the configured M-PESA provider.
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // 2. Resolve and validate the existing C2B configuration.
    // -------------------------------------------------------------------------

    const instructions = await this.c2bService.getPaymentInstructions();

    if (instructions.environment !== 'sandbox') {
      throw new HttpException(
        'C2B diagnostic registration is restricted to sandbox.',
        HttpStatus.FORBIDDEN,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Resolve independent diagnostic callback URLs.
    // -------------------------------------------------------------------------

    const confirmationUrl = this.configService
      .get<string>('MPESA_C2B_DIAGNOSTIC_CONFIRMATION_URL')
      ?.trim();

    const validationUrl = this.configService
      .get<string>('MPESA_C2B_DIAGNOSTIC_VALIDATION_URL')
      ?.trim();

    if (!confirmationUrl || !validationUrl) {
      throw new HttpException(
        'Diagnostic confirmation and validation URLs must be configured.',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.validateDiagnosticUrl(confirmationUrl);
    this.validateDiagnosticUrl(validationUrl);

    if (confirmationUrl === validationUrl) {
      throw new HttpException(
        'Diagnostic callback URLs must be different.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Obtain the existing Daraja access token.
    // -------------------------------------------------------------------------

    const accessToken =
      await this.oauthService.getAccessToken(providerPublicId);

    // -------------------------------------------------------------------------
    // 5. Build the diagnostic registration request.
    // -------------------------------------------------------------------------

    const request: MpesaC2BRegisterUrlRequest = {
      ShortCode: instructions.shortcode,
      ResponseType: 'Completed',
      ConfirmationURL: confirmationUrl,
      ValidationURL: validationUrl,
    };

    this.logger.log(
      `C2B diagnostic registration starting: ${JSON.stringify({
        environment: instructions.environment,
        shortcode: instructions.shortcode,
        businessType: instructions.businessType,
        confirmationHost: new URL(confirmationUrl).host,
        validationHost: new URL(validationUrl).host,
        responseType: request.ResponseType,
      })}`,
    );

    // -------------------------------------------------------------------------
    // 6. Submit registration to Safaricom.
    // -------------------------------------------------------------------------

    const response = await this.httpService.post<MpesaC2BRegisterUrlResponse>(
      instructions.environment,
      MPESA_C2B.REGISTER_URL_PATH,
      request,
      { accessToken },
    );

    // -------------------------------------------------------------------------
    // 7. Record safe provider response diagnostics.
    // -------------------------------------------------------------------------

    const responseCode = String(response.ResponseCode ?? '').trim();

    this.logger.log(
      `C2B diagnostic registration response: ${JSON.stringify({
        responseCode: response.ResponseCode ?? null,
        responseDescription: response.ResponseDescription ?? null,
        originatorConversationID: response.OriginatorConversationID ?? null,
        conversationID: response.ConversationID ?? null,
      })}`,
    );

    // -------------------------------------------------------------------------
    // 8. Validate registration result.
    // -------------------------------------------------------------------------

    if (responseCode !== '0' && responseCode !== '00000000') {
      throw new HttpException(
        response.ResponseDescription ||
          'Safaricom rejected diagnostic C2B registration.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return response;
  }

  /**
   * Validates diagnostic callback URL syntax and security.
   */
  private validateDiagnosticUrl(value: string): void {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(value);
    } catch {
      throw new HttpException(
        'A diagnostic callback URL is invalid.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (parsedUrl.protocol !== 'https:') {
      throw new HttpException(
        'Diagnostic callback URLs must use HTTPS.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (parsedUrl.username || parsedUrl.password) {
      throw new HttpException(
        'Diagnostic callback URLs must not contain credentials.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

export default C2BDiagnosticRegistrationService;
