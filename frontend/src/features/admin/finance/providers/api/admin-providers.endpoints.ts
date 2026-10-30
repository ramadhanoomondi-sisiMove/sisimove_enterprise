
import type { AdminProviderFilters } from '../models/admin-provider-filters.model';

// -----------------------------------------------------------------------------
// Financial Payment Provider Endpoints
// -----------------------------------------------------------------------------

const BASE_PATH = '/financial-payment-providers';

export const ADMIN_PROVIDERS_ENDPOINTS = {
  // ---------------------------------------------------------------------------
  // Provider Queries
  // ---------------------------------------------------------------------------

  list: (filters?: AdminProviderFilters): string => {
    if (filters === undefined) {
      return BASE_PATH;
    }

    const query = new URLSearchParams();

    if (filters.type !== undefined) {
      query.set('type', filters.type);
    }

    if (filters.status !== undefined) {
      query.set('status', filters.status);
    }

    if (filters.environment !== undefined) {
      query.set('environment', filters.environment);
    }

    if (filters.operational !== undefined) {
      query.set('operational', String(filters.operational));
    }

    const queryString = query.toString();

    return queryString.length > 0
      ? `${BASE_PATH}?${queryString}`
      : BASE_PATH;
  },

  byPublicId: (providerPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(providerPublicId)}`,

  byCode: (code: string): string =>
    `${BASE_PATH}/by-code/${encodeURIComponent(code)}`,

  // ---------------------------------------------------------------------------
  // Provider Commands
  // ---------------------------------------------------------------------------

  create: (): string => BASE_PATH,

  update: (providerPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(providerPublicId)}`,

  enable: (providerPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(providerPublicId)}/enable`,

  disable: (providerPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(providerPublicId)}/disable`,

  changeStatus: (providerPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(providerPublicId)}/status`,

  // ---------------------------------------------------------------------------
  // Capability Commands
  // ---------------------------------------------------------------------------

  enableCapability: (
    providerPublicId: string,
    capabilityType: string,
  ): string =>
    `${BASE_PATH}/${encodeURIComponent(providerPublicId)}/capabilities/${encodeURIComponent(capabilityType)}/enable`,

  disableCapability: (
    providerPublicId: string,
    capabilityType: string,
  ): string =>
    `${BASE_PATH}/${encodeURIComponent(providerPublicId)}/capabilities/${encodeURIComponent(capabilityType)}/disable`,
} as const;
