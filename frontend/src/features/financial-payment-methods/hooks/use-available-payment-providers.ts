// =============================================================================
// sisiMove — Use Available Financial Payment Providers
// =============================================================================
//
// React Query hook for retrieving available financial payment providers.
//
// Responsibilities:
// - retrieve enabled and operational providers;
// - expose query state to presentation components;
// - delegate HTTP communication to the API layer.
//
// This hook does NOT:
// - perform HTTP requests directly;
// - expose provider configuration or credentials;
// - implement provider business rules.
//
// =============================================================================

import { useQuery } from '@tanstack/react-query';

import { getAvailablePaymentProviders } from '../api';

import type { FinancialPaymentProvider } from '../models';

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAvailablePaymentProviders() {
  return useQuery<FinancialPaymentProvider[], Error>({
    queryKey: [
      'financial-payment-methods',
      'available-payment-providers',
    ],

    queryFn: getAvailablePaymentProviders,
  });
}