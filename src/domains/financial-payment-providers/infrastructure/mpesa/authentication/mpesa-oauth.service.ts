import { Inject, Injectable, Logger } from '@nestjs/common';
import type { AxiosError } from 'axios';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../../application/financial-payment-providers.tokens';

import type { FinancialPaymentProviderRepository } from '../../../domain/repositories/financial-payment-provider.repository';

import { FinancialPaymentProviderCode } from '../../../domain/value-objects/financial-payment-provider-code.vo';

import type { FinancialPaymentProviderPublicId } from '../../../domain/value-objects/financial-payment-provider-public-id.vo';

import { FinancialPaymentProviderConfigurationService } from '../../../application/services/financial-payment-provider-configuration.service';

import { MpesaHttpClient } from '../http/mpesa-http.client';

import type {
  MpesaOAuthApiResponse,
  MpesaOAuthAccessToken,
  MpesaOAuthAuthenticationResult,
} from './mpesa-oauth.types';

// =============================================================================
// Constants
// =============================================================================

const MPESA_OAUTH_ENDPOINTS = {
  SANDBOX:
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',

  PRODUCTION:
    'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
} as const;

const TOKEN_EXPIRY_BUFFER_SECONDS = 60;

// =============================================================================
// Diagnostic Types
// =============================================================================

interface SafeOAuthErrorDetails {
  name: string;
  message: string;
  code?: string;
  status?: number;
  statusText?: string;
  responseData?: unknown;
}

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class MpesaOAuthService {
  private readonly logger = new Logger(MpesaOAuthService.name);

  private readonly tokenCache = new Map<string, MpesaOAuthAccessToken>();

  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly configurationService: FinancialPaymentProviderConfigurationService,

    private readonly httpClient: MpesaHttpClient,
  ) {}

  // ===========================================================================
  // Authenticate
  // ===========================================================================

  public async authenticate(
    providerPublicId: FinancialPaymentProviderPublicId,
  ): Promise<MpesaOAuthAuthenticationResult> {
    const token = await this.getOAuthToken(providerPublicId);

    return {
      authenticated: true,
      expiresAt: token.expiresAt,
    };
  }

  // ===========================================================================
  // Get Access Token
  // ===========================================================================

  public async getAccessToken(
    providerPublicId: FinancialPaymentProviderPublicId,
  ): Promise<string> {
    const token = await this.getOAuthToken(providerPublicId);

    return token.accessToken;
  }

  // ===========================================================================
  // Get OAuth Token
  // ===========================================================================

  private async getOAuthToken(
    providerPublicId: FinancialPaymentProviderPublicId,
  ): Promise<MpesaOAuthAccessToken> {
    const provider =
      await this.providerRepository.findByPublicId(providerPublicId);

    if (provider === null) {
      throw new Error('M-PESA payment provider was not found.');
    }

    const mpesaCode = FinancialPaymentProviderCode.create('MPESA');

    if (!provider.code.equals(mpesaCode)) {
      throw new Error('The selected provider is not M-PESA.');
    }

    const environment = provider.environment;

    const cacheKey = `${provider.id.toString()}:${environment.value}`;

    const cachedToken = this.tokenCache.get(cacheKey);

    if (
      cachedToken &&
      cachedToken.expiresAt > Date.now() + TOKEN_EXPIRY_BUFFER_SECONDS * 1000
    ) {
      this.logger.debug(
        `Using cached M-PESA OAuth token for ${environment.value} environment.`,
      );

      return cachedToken;
    }

    const configuration = await this.configurationService.getConfiguration(
      provider.id.toString(),
      environment,
    );

    if (configuration === null) {
      throw new Error('M-PESA configuration was not found.');
    }

    const consumerKey = configuration.consumerKey;
    const consumerSecret = configuration.consumerSecret;

    if (!consumerKey || !consumerSecret) {
      throw new Error('M-PESA OAuth credentials are incomplete.');
    }

    const endpoint = environment.isSandbox()
      ? MPESA_OAUTH_ENDPOINTS.SANDBOX
      : MPESA_OAUTH_ENDPOINTS.PRODUCTION;

    const authorization = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
    ).toString('base64');

    this.logger.log(
      `Requesting M-PESA OAuth token. Environment: ${environment.value}.`,
    );

    let response;

    try {
      response = await this.httpClient.get<MpesaOAuthApiResponse>(endpoint, {
        headers: {
          Authorization: `Basic ${authorization}`,
          Accept: 'application/json',
        },
      });
    } catch (error: unknown) {
      const details = this.extractErrorDetails(error);

      this.logger.error(
        `M-PESA OAuth HTTP request failed. ${JSON.stringify(details)}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new Error(
        `Safaricom M-PESA OAuth request failed: ${this.describeError(details)}`,
        { cause: error },
      );
    }

    const accessToken = response.data.access_token;
    const expiresIn = Number(response.data.expires_in);

    if (
      typeof accessToken !== 'string' ||
      !accessToken.trim() ||
      !Number.isFinite(expiresIn) ||
      expiresIn <= 0
    ) {
      this.logger.error(
        `M-PESA OAuth returned an invalid response. HTTP status: ${response.status}. Response: ${JSON.stringify(
          this.sanitizeOAuthResponse(response.data),
        )}`,
      );

      throw new Error(
        'M-PESA OAuth returned an invalid access token or expiry value.',
      );
    }

    const token: MpesaOAuthAccessToken = {
      accessToken,
      expiresIn,
      expiresAt: Date.now() + expiresIn * 1000,
    };

    this.tokenCache.set(cacheKey, token);

    this.logger.log(
      `M-PESA OAuth authentication successful. Environment: ${environment.value}. HTTP status: ${response.status}. Token expiry: ${expiresIn} seconds.`,
    );

    return token;
  }

  // ===========================================================================
  // Extract Safe Error Details
  // ===========================================================================

  private extractErrorDetails(error: unknown): SafeOAuthErrorDetails {
    if (this.isAxiosError(error)) {
      return {
        name: error.name,
        message: error.message,
        ...(error.code ? { code: error.code } : {}),
        ...(error.response
          ? {
              status: error.response.status,
              statusText: error.response.statusText,
              responseData: this.sanitizeOAuthResponse(error.response.data),
            }
          : {}),
      };
    }

    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
      };
    }

    return {
      name: 'UnknownError',
      message: String(error),
    };
  }

  // ===========================================================================
  // Axios Error Guard
  // ===========================================================================

  private isAxiosError(error: unknown): error is AxiosError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'isAxiosError' in error &&
      error.isAxiosError === true
    );
  }

  // ===========================================================================
  // Sanitize OAuth Response
  // ===========================================================================

  private sanitizeOAuthResponse(data: unknown): unknown {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const response = data as Record<string, unknown>;

    // Never expose access_token or other unapproved response properties.
    return {
      ...(typeof response.error === 'string' ? { error: response.error } : {}),
      ...(typeof response.error_description === 'string'
        ? { error_description: response.error_description }
        : {}),
      ...(typeof response.errorMessage === 'string'
        ? { errorMessage: response.errorMessage }
        : {}),
      ...(typeof response.requestId === 'string'
        ? { requestId: response.requestId }
        : {}),
      ...(typeof response.expires_in === 'string' ||
      typeof response.expires_in === 'number'
        ? { expires_in: response.expires_in }
        : {}),
      ...(typeof response.access_token === 'string'
        ? { access_token: '[REDACTED]' }
        : {}),
    };
  }

  // ===========================================================================
  // Describe Error
  // ===========================================================================

  private describeError(details: SafeOAuthErrorDetails): string {
    const parts = [
      details.message,
      ...(details.code ? [`Code: ${details.code}`] : []),
      ...(details.status ? [`HTTP status: ${details.status}`] : []),
      ...(details.statusText ? [`Status text: ${details.statusText}`] : []),
    ];

    return parts.join(' | ');
  }

  // ===========================================================================
  // Clear Token Cache
  // ===========================================================================

  public clearTokenCache(): void {
    this.tokenCache.clear();

    this.logger.log('M-PESA OAuth token cache cleared.');
  }
}

export default MpesaOAuthService;
