
import {
  authenticatedApiClient,
} from '@/features/authentication/http/authenticated-api-client';

import type { RequestOptions } from '@/foundation/http';

import type { AdminProvider } from '../models/admin-provider.model';
import type { AdminProviderFilters } from '../models/admin-provider-filters.model';

import type {
  AdminChangeProviderStatusInput,
  AdminConfigureMpesaInput,
  AdminConfigureMpesaResponse,
  AdminCreateProviderInput,
  AdminProviderCapabilityOperationParams,
  AdminProviderOperationParams,
  AdminTestMpesaConnectionResponse,
  AdminUpdateProviderInput,
} from '../models/admin-provider-operations.model';

import { ADMIN_PROVIDERS_ENDPOINTS } from './admin-providers.endpoints';

// -----------------------------------------------------------------------------
// Admin Providers API
// -----------------------------------------------------------------------------

/**
 * HTTP adapter for Financial Payment Provider administration.
 *
 * Responsibilities:
 * - Call financial payment provider endpoints.
 * - Use the shared authenticated API client.
 * - Type API requests and responses using admin provider models.
 *
 * M-PESA responsibilities:
 * - Configure STK Push customer top-ups.
 * - Configure C2B PayBill / Buy Goods customer top-ups.
 * - Configure B2C withdrawals of customer available funds.
 * - Test Daraja OAuth connectivity.
 *
 * Non-responsibilities:
 * - Authentication session management.
 * - Direct HTTP implementation.
 * - Provider business rules.
 * - Financial authorization and ledger operations.
 * - Customer balance calculations.
 * - Local persistence.
 */
export class AdminProvidersApi {
  // ===========================================================================
  // Provider Queries
  // ===========================================================================

  /**
   * Retrieve providers, optionally filtered by supported backend filters.
   */
  public async list(
    filters?: AdminProviderFilters,
    options: RequestOptions = {},
  ): Promise<AdminProvider[]> {
    return authenticatedApiClient.get<AdminProvider[]>(
      ADMIN_PROVIDERS_ENDPOINTS.list(filters),
      options,
    );
  }

  /**
   * Retrieve one provider by its public ID.
   */
  public async getByPublicId(
    providerPublicId: string,
    options: RequestOptions = {},
  ): Promise<AdminProvider> {
    return authenticatedApiClient.get<AdminProvider>(
      ADMIN_PROVIDERS_ENDPOINTS.byPublicId(providerPublicId),
      options,
    );
  }

  /**
   * Retrieve one provider by its code.
   */
  public async getByCode(
    code: string,
    options: RequestOptions = {},
  ): Promise<AdminProvider> {
    return authenticatedApiClient.get<AdminProvider>(
      ADMIN_PROVIDERS_ENDPOINTS.byCode(code),
      options,
    );
  }

  // ===========================================================================
  // Provider Commands
  // ===========================================================================

  /**
   * Create a financial payment provider.
   */
  public async create(
    input: AdminCreateProviderInput,
    options: RequestOptions = {},
  ): Promise<AdminProvider> {
    return authenticatedApiClient.post<AdminProvider>(
      ADMIN_PROVIDERS_ENDPOINTS.create(),
      input,
      options,
    );
  }

  /**
   * Update a provider's name.
   */
  public async update(
    params: AdminProviderOperationParams,
    input: AdminUpdateProviderInput,
    options: RequestOptions = {},
  ): Promise<AdminProvider> {
    return authenticatedApiClient.patch<AdminProvider>(
      ADMIN_PROVIDERS_ENDPOINTS.update(params.providerPublicId),
      input,
      options,
    );
  }

  /**
   * Enable a provider.
   */
  public async enable(
    params: AdminProviderOperationParams,
    options: RequestOptions = {},
  ): Promise<AdminProvider> {
    return authenticatedApiClient.post<AdminProvider>(
      ADMIN_PROVIDERS_ENDPOINTS.enable(params.providerPublicId),
      undefined,
      options,
    );
  }

  /**
   * Disable a provider.
   */
  public async disable(
    params: AdminProviderOperationParams,
    options: RequestOptions = {},
  ): Promise<AdminProvider> {
    return authenticatedApiClient.post<AdminProvider>(
      ADMIN_PROVIDERS_ENDPOINTS.disable(params.providerPublicId),
      undefined,
      options,
    );
  }

  /**
   * Change a provider's integration status.
   */
  public async changeStatus(
    params: AdminProviderOperationParams,
    input: AdminChangeProviderStatusInput,
    options: RequestOptions = {},
  ): Promise<AdminProvider> {
    return authenticatedApiClient.post<AdminProvider>(
      ADMIN_PROVIDERS_ENDPOINTS.changeStatus(params.providerPublicId),
      input,
      options,
    );
  }

  // ===========================================================================
  // M-PESA Configuration
  // ===========================================================================

  /**
   * Securely configure M-PESA Daraja credentials.
   *
   * Supported configuration:
   *
   * TOP-UP:
   * - STK Push: shortcode and passkey.
   * - C2B: optional shortcode and business type.
   *
   * WITHDRAWAL:
   * - B2C: optional Party A shortcode, initiator name
   *   and encrypted security credential.
   *
   * The backend validates optional C2B and B2C fields as complete groups.
   * Credentials must never be logged or exposed in API responses.
   *
   * FinancialModule remains responsible for financial consequences.
   */
  public async configureMpesa(
    params: AdminProviderOperationParams,
    input: AdminConfigureMpesaInput,
    options: RequestOptions = {},
  ): Promise<AdminConfigureMpesaResponse> {
    return authenticatedApiClient.post<AdminConfigureMpesaResponse>(
      ADMIN_PROVIDERS_ENDPOINTS.configureMpesa(params.providerPublicId),
      input,
      options,
    );
  }

  /**
   * Test M-PESA Daraja OAuth authentication.
   *
   * Returns authentication status and token expiry only.
   * The access token and credentials are never returned.
   */
  public async testMpesaConnection(
    params: AdminProviderOperationParams,
    options: RequestOptions = {},
  ): Promise<AdminTestMpesaConnectionResponse> {
    return authenticatedApiClient.post<AdminTestMpesaConnectionResponse>(
      ADMIN_PROVIDERS_ENDPOINTS.testMpesaConnection(
        params.providerPublicId,
      ),
      undefined,
      options,
    );
  }

  // ===========================================================================
  // Capability Commands
  // ===========================================================================

  /**
   * Enable a capability for a provider.
   */
  public async enableCapability(
    params: AdminProviderCapabilityOperationParams,
    options: RequestOptions = {},
  ): Promise<AdminProvider> {
    return authenticatedApiClient.post<AdminProvider>(
      ADMIN_PROVIDERS_ENDPOINTS.enableCapability(
        params.providerPublicId,
        params.capabilityType,
      ),
      undefined,
      options,
    );
  }

  /**
   * Disable a capability for a provider.
   */
  public async disableCapability(
    params: AdminProviderCapabilityOperationParams,
    options: RequestOptions = {},
  ): Promise<AdminProvider> {
    return authenticatedApiClient.post<AdminProvider>(
      ADMIN_PROVIDERS_ENDPOINTS.disableCapability(
        params.providerPublicId,
        params.capabilityType,
      ),
      undefined,
      options,
    );
  }
}

// -----------------------------------------------------------------------------
// Shared Instance
// -----------------------------------------------------------------------------

export const adminProvidersApi = new AdminProvidersApi();
