// =============================================================================
// sisiMove — List Financial Payments API
// =============================================================================
//
// Retrieves Financial Payments belonging to the authenticated member.
//
// The backend is responsible for:
// - resolving the authenticated member's Financial Account;
// - enforcing account ownership;
// - returning the member's payment records.
//
// The response includes all payment lifecycle statuses, including:
//
//     PENDING
//     PROCESSING
//     SUCCEEDED
//     FAILED
//     CANCELLED
//     EXPIRED
//
// The frontend does not supply an account identifier.
//
// =============================================================================

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

import type { FinancialPayment } from '../models';

import {
  mapFinancialPayment,
  type FinancialPaymentApiResponse,
} from '../mappers';

// =============================================================================
// API Configuration
// =============================================================================

const FINANCIAL_PAYMENTS_ME_PATH = '/financial-payments/me';

// =============================================================================
// List Financial Payments
// =============================================================================

/**
 * Retrieves all Financial Payments belonging to the authenticated member.
 *
 * Account ownership is resolved and enforced by the backend.
 *
 * No account identifier is accepted from the frontend.
 *
 * Each API response is mapped into the frontend FinancialPayment model.
 *
 * @returns Financial Payments belonging to the authenticated member.
 */
export async function listPayments(): Promise<FinancialPayment[]> {
  const response =
    await authenticatedApiClient.get<FinancialPaymentApiResponse[]>(
      FINANCIAL_PAYMENTS_ME_PATH,
    );

  return (response ?? []).map(mapFinancialPayment);
}