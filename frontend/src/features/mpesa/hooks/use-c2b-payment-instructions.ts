
// =============================================================================
// sisiMove — Use C2B Payment Instructions Hook
// =============================================================================
//
// React Query hook for retrieving M-PESA C2B payment instructions.
//
// Responsibilities:
//
// - expose the C2B payment-instructions query to React components;
// - manage loading, error and success states;
// - delegate HTTP communication to getC2BPaymentInstructions().
//
// Non-responsibilities:
//
// - resolving Financial Account ownership;
// - determining the M-PESA business shortcode;
// - generating account references;
// - processing C2B payments;
// - modifying wallet balances.
//
// The backend resolves the authenticated member's Financial Account
// and returns the configured C2B payment instructions.
//
// =============================================================================

import { useQuery } from '@tanstack/react-query';

import { getC2BPaymentInstructions } from '../api/get-c2b-payment-instructions.api';

import type { C2BPaymentInstructions } from '../models/c2b-payment-instructions';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

export const C2B_PAYMENT_INSTRUCTIONS_QUERY_KEY = [
  'mpesa',
  'c2b',
  'payment-instructions',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useC2BPaymentInstructions() {
  return useQuery<C2BPaymentInstructions, Error>({
    queryKey: C2B_PAYMENT_INSTRUCTIONS_QUERY_KEY,

    queryFn: getC2BPaymentInstructions,

    staleTime: 5 * 60 * 1000,
  });
}
