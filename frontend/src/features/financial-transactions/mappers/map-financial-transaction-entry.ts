// -----------------------------------------------------------------------------
// sisiMove — Map Financial Transaction Entry
// -----------------------------------------------------------------------------
//
// Maps the backend Financial Transaction Entry response into the frontend
// FinancialTransactionEntry model.
//
// Responsibilities:
// - normalize the backend response into the frontend model;
// - preserve financial amounts as integer minor units;
// - preserve backend enum values;
// - map nested transaction-entry data without business logic.
//
// This mapper does NOT:
// - calculate balances;
// - calculate commissions;
// - interpret debit/credit semantics;
// - perform currency conversion;
// - modify backend values.
//
// -----------------------------------------------------------------------------

import type {
  FinancialTransactionEntry,
} from '../models';

// =============================================================================
// Backend Response Shape
// =============================================================================

/**
 * Backend Financial Transaction Entry response shape.
 *
 * This represents the HTTP response consumed by the frontend.
 */
export interface FinancialTransactionEntryResponse {
  readonly id: string;
  readonly publicId: string;
  readonly transactionId: string;
  readonly accountId: string;
  readonly type: FinancialTransactionEntry['type'];
  readonly balanceType: FinancialTransactionEntry['balanceType'];
  readonly amount: number;
  readonly createdAt: string;
}

// =============================================================================
// Mapper
// =============================================================================

/**
 * Maps a backend Financial Transaction Entry response to the frontend model.
 */
export function mapFinancialTransactionEntry(
  response: FinancialTransactionEntryResponse,
): FinancialTransactionEntry {
  return {
    id: response.id,
    publicId: response.publicId,
    transactionId: response.transactionId,
    accountId: response.accountId,
    type: response.type,
    balanceType: response.balanceType,
    amount: response.amount,
    createdAt: response.createdAt,
  };
}

