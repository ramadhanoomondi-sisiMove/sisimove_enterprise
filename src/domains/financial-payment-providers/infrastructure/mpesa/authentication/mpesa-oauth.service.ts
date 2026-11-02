import { Inject, Injectable } from '@nestjs/common';

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
// Service
// =============================================================================

@Injectable()
export class MpesaOAuthService {
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

    try {
      const response = await this.httpClient.get<MpesaOAuthApiResponse>(
        endpoint,
        {
          headers: {
            Authorization: `Basic ${authorization}`,
            Accept: 'application/json',
          },
        },
      );

      const accessToken = response.data.access_token;
      const expiresIn = Number(response.data.expires_in);

      if (
        typeof accessToken !== 'string' ||
        !accessToken.trim() ||
        !Number.isFinite(expiresIn) ||
        expiresIn <= 0
      ) {
        throw new Error('Invalid OAuth response.');
      }

      const token: MpesaOAuthAccessToken = {
        accessToken,
        expiresIn,
        expiresAt: Date.now() + expiresIn * 1000,
      };

      this.tokenCache.set(cacheKey, token);

      return token;
    } catch {
      throw new Error('Safaricom M-PESA OAuth authentication failed.');
    }
  }

  // ===========================================================================
  // Clear Token Cache
  // ===========================================================================

  public clearTokenCache(): void {
    this.tokenCache.clear();
  }
}

export default MpesaOAuthService;
