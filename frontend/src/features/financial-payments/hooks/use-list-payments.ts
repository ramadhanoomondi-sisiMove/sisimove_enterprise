// =============================================================================
// sisiMove — Use List Financial Payments
// =============================================================================
//
// React Query hook for retrieving Financial Payments belonging to the
// authenticated member.
//
// Responsibilities:
// - execute the list-payments API adapter;
// - manage loading, success and error states;
// - provide a stable query key for caching and invalidation.
//
// The backend remains responsible for account ownership and payment data.
//
// =============================================================================

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { listPayments } from '../api';

// =============================================================================
// Query Configuration
// =============================================================================

export const LIST_PAYMENTS_QUERY_KEY = [
  'financial-payments',
  'me',
] as const;

// =============================================================================
// Use List Financial Payments
// =============================================================================

/**
 * Retrieves all Financial Payments belonging to the authenticated member.
 *
 * Includes pending, processing, successful, failed, cancelled and expired
 * payments returned by the backend.
 */
export function useListPayments() {
  return useQuery({
    queryKey: LIST_PAYMENTS_QUERY_KEY,
    queryFn: listPayments,
  });
}