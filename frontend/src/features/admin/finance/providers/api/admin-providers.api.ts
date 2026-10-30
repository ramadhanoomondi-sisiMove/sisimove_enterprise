
import {
  authenticatedApiClient,
} from '@/features/authentication/http/authenticated-api-client';

import type { RequestOptions } from '@/foundation/http';

import type { AdminProvider } from '../models/admin-provider.model';
import type { AdminProviderFilters } from '../models/admin-provider-filters.model';
import type {
  AdminChangeProviderStatusInput,
  AdminCreateProviderInput,
  AdminProviderCapabilityOperationParams,
  AdminProviderOperationParams,
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
 * - Call the financial payment provider endpoints.
 * - Use the shared authenticated API client.
 * - Type API responses using the admin provider models.
 *
 * Non-responsibilities:
 * - Authentication session management.
 * - Direct HTTP implementation.
 * - Provider business rules.
 * - Capability-state calculations.
 * - Local persistence.
 */
export class AdminProvidersApi {
  // ===========================================================================
  // Provider Queries
  // ===========================================================================

  /**
   * Retrieve providers, optionally filtered by the supported backend filters.
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
