/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 OAuth Service
 * -----------------------------------------------------------------------------
 *
 * Handles Safaricom Daraja OAuth 2.0 client-credentials authentication.
 *
 * Responsibilities:
 * - Retrieve the configured M-PESA provider.
 * - Resolve its configured environment.
 * - Load decrypted Consumer Key and Consumer Secret.
 * - Generate Daraja access tokens.
 * - Cache tokens until shortly before expiration.
 * - Prevent duplicate simultaneous authentication requests.
 * - Support token-cache invalidation after configuration changes.
 *
 * Security:
 * - Credentials are retrieved from encrypted provider configuration.
 * - Credentials and access tokens are never logged.
 * - Access tokens are never exposed through API responses.
 * - Authentication errors never expose credentials or raw provider data.
 *
 * Architecture:
 * - Financial Payment Provider owns provider configuration.
 * - M-PESA authentication owns Daraja OAuth communication.
 * - Financial application workflows expose safe authentication results.
 *
 * -----------------------------------------------------------------------------
 */

import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { Buffer } from 'node:buffer';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../domains/financial-payment-providers/application/financial-payment-providers.tokens';

import type { FinancialPaymentProviderRepository } from '../../domains/financial-payment-providers/domain/repositories/financial-payment-provider.repository';

import { FinancialPaymentProviderPublicId } from '../../domains/financial-payment-providers/domain/value-objects/financial-payment-provider-public-id.vo';

import { FinancialPaymentProviderCode } from '../../domains/financial-payment-providers/domain/value-objects/financial-payment-provider-code.vo';

import { FinancialPaymentProviderConfigurationService } from '../../domains/financial-payment-providers/application/services/financial-payment-provider-configuration.service';

import { MpesaHttpService } from '../common/mpesa-http.service';

import { MPESA_OAUTH } from '../common/mpesa.constants';

import type { MpesaEnvironment } from '../common/mpesa.config';

import type { MpesaOAuthTokenResponse } from '../common/mpesa.types';

import { MpesaException, MpesaErrorCode } from '../common/mpesa-exception';

import type { MpesaToken } from './mpesa-token.interface';

// =============================================================================
// Provider Types
// =============================================================================

type FinancialPaymentProvider = NonNullable<
  Awaited<ReturnType<FinancialPaymentProviderRepository['findByPublicId']>>
>;

type FinancialPaymentProviderEnvironment = NonNullable<
  FinancialPaymentProvider['environment']
>;

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class MpesaOAuthService {
  /**
   * Cached access tokens indexed by provider ID and environment.
   */
  private readonly tokenCache = new Map<string, MpesaToken>();

  /**
   * Pending authentication requests.
   *
   * Prevents duplicate simultaneous OAuth requests for the same provider
   * and environment.
   */
  private readonly pendingRequests = new Map<string, Promise<MpesaToken>>();

  /**
   * Cache generations.
   *
   * Prevents an authentication request started before cache invalidation
   * from storing an outdated token afterward.
   */
  private readonly cacheGenerations = new Map<string, number>();

  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly providerRepository: FinancialPaymentProviderRepository,

    private readonly configurationService: FinancialPaymentProviderConfigurationService,

    private readonly httpService: MpesaHttpService,
  ) {}

  // ===========================================================================
  // Authenticate
  // ===========================================================================

  /**
   * Authenticates a configured M-PESA provider.
   *
   * Returns an existing cached token when it remains valid.
   *
   * Internal service-to-service method.
   * Never expose its returned token through an API controller.
   */
  public async authenticate(providerPublicId: string): Promise<MpesaToken> {
    // -------------------------------------------------------------------------
    // 1. Validate provider public ID
    // -------------------------------------------------------------------------

    if (!providerPublicId || !providerPublicId.trim()) {
      throw new MpesaException({
        code: MpesaErrorCode.VALIDATION_FAILED,
        message: 'M-PESA provider public ID is required.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // -------------------------------------------------------------------------
    // 2. Retrieve provider
    // -------------------------------------------------------------------------

    const publicId = new FinancialPaymentProviderPublicId(
      providerPublicId.trim(),
    );

    const provider = await this.providerRepository.findByPublicId(publicId);

    if (provider === null) {
      throw new HttpException(
        'M-PESA payment provider was not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Verify provider identity
    // -------------------------------------------------------------------------

    const mpesaCode = FinancialPaymentProviderCode.create('MPESA');

    if (!provider.code.equals(mpesaCode)) {
      throw new MpesaException({
        code: MpesaErrorCode.VALIDATION_FAILED,
        message: 'The selected payment provider is not M-PESA.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // -------------------------------------------------------------------------
    // 4. Resolve provider environment
    // -------------------------------------------------------------------------

    const providerEnvironment = provider.environment;

    if (providerEnvironment === null) {
      throw new MpesaException({
        code: MpesaErrorCode.CONFIGURATION_ERROR,
        message: 'M-PESA environment has not been configured.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const environment: MpesaEnvironment = providerEnvironment.isSandbox()
      ? 'sandbox'
      : 'production';

    // -------------------------------------------------------------------------
    // 5. Resolve cache key
    // -------------------------------------------------------------------------

    const cacheKey = `${provider.id.toString()}:${environment}`;

    // -------------------------------------------------------------------------
    // 6. Return cached token when valid
    // -------------------------------------------------------------------------

    const cachedToken = this.tokenCache.get(cacheKey);

    const refreshThreshold =
      Date.now() + MPESA_OAUTH.TOKEN_EXPIRY_BUFFER_SECONDS * 1000;

    if (cachedToken !== undefined && cachedToken.expiresAt > refreshThreshold) {
      return cachedToken;
    }

    // -------------------------------------------------------------------------
    // 7. Reuse pending authentication request
    // -------------------------------------------------------------------------

    const pendingRequest = this.pendingRequests.get(cacheKey);

    if (pendingRequest !== undefined) {
      return pendingRequest;
    }

    // -------------------------------------------------------------------------
    // 8. Capture cache generation
    // -------------------------------------------------------------------------

    const generation = this.getCacheGeneration(cacheKey);

    // -------------------------------------------------------------------------
    // 9. Start authentication request
    // -------------------------------------------------------------------------

    const authenticationRequest = this.requestAccessToken(
      provider.id.toString(),
      providerEnvironment,
      environment,
      cacheKey,
      generation,
    );

    this.pendingRequests.set(cacheKey, authenticationRequest);

    try {
      return await authenticationRequest;
    } finally {
      // Only remove this request if it is still the active request.
      //
      // A cache invalidation may have allowed a newer request to start.
      if (this.pendingRequests.get(cacheKey) === authenticationRequest) {
        this.pendingRequests.delete(cacheKey);
      }
    }
  }

  // ===========================================================================
  // Get Access Token
  // ===========================================================================

  /**
   * Returns the Bearer access token for an authenticated M-PESA provider.
   *
   * Intended for internal M-PESA service-to-service communication.
   */
  public async getAccessToken(providerPublicId: string): Promise<string> {
    const token = await this.authenticate(providerPublicId);

    return token.accessToken;
  }

  // ===========================================================================
  // Request Access Token
  // ===========================================================================

  /**
   * Retrieves decrypted provider credentials and requests a Daraja token.
   */
  private async requestAccessToken(
    providerId: string,
    providerEnvironment: FinancialPaymentProviderEnvironment,
    environment: MpesaEnvironment,
    cacheKey: string,
    generation: number,
  ): Promise<MpesaToken> {
    // -------------------------------------------------------------------------
    // 1. Retrieve decrypted provider configuration
    // -------------------------------------------------------------------------

    const configuration = await this.configurationService.getConfiguration(
      providerId,
      providerEnvironment,
    );

    if (configuration === null) {
      throw new MpesaException({
        code: MpesaErrorCode.CONFIGURATION_ERROR,
        message: 'M-PESA credentials have not been configured.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const consumerKey = configuration.consumerKey;
    const consumerSecret = configuration.consumerSecret;

    if (!consumerKey?.trim() || !consumerSecret?.trim()) {
      throw new MpesaException({
        code: MpesaErrorCode.CONFIGURATION_ERROR,
        message: 'M-PESA Consumer Key or Consumer Secret is missing.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // -------------------------------------------------------------------------
    // 2. Build Basic Authentication credentials
    // -------------------------------------------------------------------------

    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
      'utf8',
    ).toString('base64');

    // -------------------------------------------------------------------------
    // 3. Build OAuth endpoint
    // -------------------------------------------------------------------------

    const endpoint = `${MPESA_OAUTH.TOKEN_PATH}?grant_type=${MPESA_OAUTH.GRANT_TYPE}`;

    // -------------------------------------------------------------------------
    // 4. Request Daraja OAuth token
    // -------------------------------------------------------------------------

    let response: MpesaOAuthTokenResponse;

    try {
      response = await this.httpService.get<MpesaOAuthTokenResponse>(
        environment,
        endpoint,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );
    } catch (error: unknown) {
      // Preserve standardized M-PESA transport exceptions.
      if (error instanceof MpesaException) {
        throw error;
      }

      throw new MpesaException({
        code: MpesaErrorCode.REQUEST_FAILED,
        message: 'Unable to authenticate with M-PESA.',
        statusCode: HttpStatus.BAD_GATEWAY,
        cause: error,
      });
    }

    // -------------------------------------------------------------------------
    // 5. Validate OAuth response
    // -------------------------------------------------------------------------

    if (
      typeof response.access_token !== 'string' ||
      !response.access_token.trim()
    ) {
      throw new MpesaException({
        code: MpesaErrorCode.UNKNOWN_ERROR,
        message: 'M-PESA returned an invalid authentication response.',
        statusCode: HttpStatus.BAD_GATEWAY,
      });
    }

    const expiresIn = Number(response.expires_in);

    if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
      throw new MpesaException({
        code: MpesaErrorCode.UNKNOWN_ERROR,
        message: 'M-PESA returned an invalid token expiration.',
        statusCode: HttpStatus.BAD_GATEWAY,
      });
    }

    // -------------------------------------------------------------------------
    // 6. Build internal token
    // -------------------------------------------------------------------------

    const token: MpesaToken = {
      accessToken: response.access_token.trim(),
      expiresIn,
      expiresAt: Date.now() + expiresIn * 1000,
    };

    // -------------------------------------------------------------------------
    // 7. Cache token only if configuration has not been invalidated
    // -------------------------------------------------------------------------

    if (this.getCacheGeneration(cacheKey) === generation) {
      this.tokenCache.set(cacheKey, token);
    }

    return token;
  }

  // ===========================================================================
  // Cache Generation
  // ===========================================================================

  /**
   * Returns the current cache generation for a key.
   */
  private getCacheGeneration(cacheKey: string): number {
    return this.cacheGenerations.get(cacheKey) ?? 0;
  }

  /**
   * Increments the cache generation.
   *
   * Any authentication request started under an earlier generation
   * will no longer be permitted to populate the cache.
   */
  private invalidateCacheGeneration(cacheKey: string): void {
    const nextGeneration = this.getCacheGeneration(cacheKey) + 1;

    this.cacheGenerations.set(cacheKey, nextGeneration);
  }

  // ===========================================================================
  // Clear Token Cache for Provider
  // ===========================================================================

  /**
   * Clears cached tokens and invalidates pending authentication requests
   * for a specific provider.
   *
   * Call after provider credentials or environment configuration changes.
   *
   * The provider ID must be the internal provider ID used in the cache key.
   */
  public clearTokenCache(providerId: string): void {
    const prefix = `${providerId}:`;

    const cacheKeys = new Set<string>([
      ...this.tokenCache.keys(),
      ...this.pendingRequests.keys(),
      ...this.cacheGenerations.keys(),
    ]);

    for (const cacheKey of cacheKeys) {
      if (!cacheKey.startsWith(prefix)) {
        continue;
      }

      this.invalidateCacheGeneration(cacheKey);
      this.tokenCache.delete(cacheKey);
      this.pendingRequests.delete(cacheKey);
    }
  }

  // ===========================================================================
  // Clear All Tokens
  // ===========================================================================

  /**
   * Clears all cached tokens and invalidates all pending authentication
   * requests.
   */
  public clearAllTokenCache(): void {
    const cacheKeys = new Set<string>([
      ...this.tokenCache.keys(),
      ...this.pendingRequests.keys(),
      ...this.cacheGenerations.keys(),
    ]);

    for (const cacheKey of cacheKeys) {
      this.invalidateCacheGeneration(cacheKey);
    }

    this.tokenCache.clear();
    this.pendingRequests.clear();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default MpesaOAuthService;
