
 // -----------------------------------------------------------------------------
 // sisiMove — Get Financial Transaction API
 // -----------------------------------------------------------------------------
 //
 // Authenticated HTTP operation for retrieving a single Financial Transaction.
 //
 // Backend route:
 //
 //   GET /financial-transactions/:transactionPublicId
 //
 // Authentication:
 //
 //   Bearer access token
 //
 // The backend currently protects this route with admin:read.
 // This API function therefore requires an authenticated caller with that
 // permission. It is not the member self-service transaction-history endpoint.
 //
 // Amounts remain integer minor units throughout the API and mapper layers.
 //
 // -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Financial Transaction — Models
// -----------------------------------------------------------------------------

import type { FinancialTransaction } from '../models';

// -----------------------------------------------------------------------------
// Financial Transaction — Mappers
// -----------------------------------------------------------------------------

import {
  mapFinancialTransaction,
  type FinancialTransactionResponse,
} from '../mappers';

// =============================================================================
// Get Financial Transaction
// =============================================================================

/**
 * Retrieve a Financial Transaction by its public identifier.
 *
 * Backend:
 *
 *     GET /financial-transactions/:transactionPublicId
 *
 * @param transactionPublicId Public identifier of the transaction.
 *
 * @returns The mapped Financial Transaction, or null if the backend returns
 *          null.
 */
export async function getFinancialTransaction(
  transactionPublicId: string,
): Promise<FinancialTransaction | null> {
  if (
    typeof transactionPublicId !== 'string' ||
    transactionPublicId.trim().length === 0
  ) {
    throw new Error(
      'Financial Transaction public ID is required.',
    );
  }

  const response =
    await authenticatedApiClient.get<FinancialTransactionResponse | null>(
      `/financial-transactions/${encodeURIComponent(transactionPublicId)}`,
    );

  if (response === null) {
    return null;
  }

  if (
    typeof response !== 'object' ||
    !Array.isArray(response.entries)
  ) {
    throw new Error(
      'Invalid Financial Transaction response.',
    );
  }

  return mapFinancialTransaction(response);
}
