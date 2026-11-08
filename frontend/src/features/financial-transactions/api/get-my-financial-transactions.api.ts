
 // -----------------------------------------------------------------------------
 // sisiMove — Get My Financial Transactions API
 // -----------------------------------------------------------------------------
 //
 // Authenticated HTTP operation for retrieving the current user's Financial
 // Transactions.
 //
 // Backend route:
 //
 //   GET /financial-transactions/me
 //
 // The backend resolves the Financial Account from the authenticated identity.
 // The frontend does not supply an account identifier.
 //
 // The backend response is normalized through the frontend response mapper.
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

import type {
  FinancialTransaction,
} from '../models';

// -----------------------------------------------------------------------------
// Financial Transaction — Mappers
// -----------------------------------------------------------------------------

import {
  mapFinancialTransaction,
  type FinancialTransactionResponse,
} from '../mappers';

// =============================================================================
// Constants
// =============================================================================

/**
 * Authenticated user's Financial Transaction history route.
 *
 * NestJS:
 *
 *     @Controller('financial-transactions')
 *     @Get('me')
 */
const MY_FINANCIAL_TRANSACTIONS_PATH =
  '/financial-transactions/me';

// =============================================================================
// Get My Financial Transactions
// =============================================================================

/**
 * Retrieve Financial Transactions belonging to the authenticated user's
 * Financial Account.
 *
 * Backend:
 *
 *     GET /financial-transactions/me
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * Account ownership is resolved and enforced by the backend.
 *
 * Amounts remain integer minor units throughout the API and mapper layers.
 */
export async function getMyFinancialTransactions(): Promise<
  FinancialTransaction[]
> {
  const response =
    await authenticatedApiClient.get<
      FinancialTransactionResponse[]
    >(MY_FINANCIAL_TRANSACTIONS_PATH);

  if (!Array.isArray(response)) {
    throw new Error(
      'Invalid Financial Transactions response: expected an array.',
    );
  }

  return response.map((transaction) =>
    mapFinancialTransaction(transaction),
  );
}
