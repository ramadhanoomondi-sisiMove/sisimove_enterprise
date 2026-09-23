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
// The backend FinancialTransactionsController currently exposes transaction
// detail only. It does not expose:
//
//   GET /financial-transactions/accounts/:accountPublicId
//   GET /financial-transactions/me
//   GET /financial-transactions
//
// Therefore this API intentionally implements only the endpoint that actually
// exists in the backend contract.
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

// =============================================================================
// Constants
// =============================================================================

/**
 * Base route for the Financial Transaction HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('financial-transactions')
 */
const FINANCIAL_TRANSACTIONS_PATH = '/financial-transactions';

// =============================================================================
// Get Financial Transaction
// =============================================================================

/**
 * Retrieve a single Financial Transaction by its public identifier.
 *
 * Backend:
 *
 *     GET /financial-transactions/:transactionPublicId
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * Authorization:
 *
 *     financial-transaction:read
 *
 * The backend remains responsible for determining whether the authenticated
 * identity is authorized to read the requested transaction.
 *
 * The frontend does not expose or manipulate the internal database ID.
 */
export async function getFinancialTransaction(
  transactionPublicId: string,
): Promise<FinancialTransaction | null> {
  return authenticatedApiClient.get<FinancialTransaction | null>(
    `${FINANCIAL_TRANSACTIONS_PATH}/${encodeURIComponent(transactionPublicId)}`,
  );
}

