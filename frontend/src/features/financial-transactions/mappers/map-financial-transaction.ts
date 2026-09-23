// -----------------------------------------------------------------------------
// sisiMove — Map Financial Transaction
// -----------------------------------------------------------------------------
//
// Maps the backend Financial Transaction response into the frontend
// FinancialTransaction model.
//
// Responsibilities:
// - normalize the backend response into the frontend model;
// - map nested Financial Transaction Entries;
// - preserve backend enum values;
// - preserve financial amounts as integer minor units;
// - preserve nullable backend values.
//
// This mapper does NOT:
// - calculate financial values;
// - derive transaction status;
// - interpret accounting entries;
// - mutate transaction state;
// - perform authorization.
//
// -----------------------------------------------------------------------------

import type {
  FinancialTransaction,
} from '../models';

import {
  mapFinancialTransactionEntry,
  type FinancialTransactionEntryResponse,
} from './map-financial-transaction-entry';

// =============================================================================
// Backend Response Shape
// =============================================================================

/**
 * Backend Financial Transaction response shape.
 *
 * This represents the HTTP response consumed by the frontend.
 */
export interface FinancialTransactionResponse {
  readonly id: string;
  readonly publicId: string;
  readonly type: FinancialTransaction['type'];
  readonly status: FinancialTransaction['status'];
  readonly sourceAccountId: string | null;
  readonly destinationAccountId: string | null;
  readonly amount: number;
  readonly currency: string;
  readonly referenceType: string | null;
  readonly referencePublicId: string | null;
  readonly entries: readonly FinancialTransactionEntryResponse[];
  readonly accountingJournalPublicId: string | null;
  readonly completedAt: string | null;
  readonly failedAt: string | null;
  readonly reversedAt: string | null;
  readonly cancelledAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// =============================================================================
// Mapper
// =============================================================================

/**
 * Maps a backend Financial Transaction response to the frontend model.
 */
export function mapFinancialTransaction(
  response: FinancialTransactionResponse,
): FinancialTransaction {
  return {
    id: response.id,
    publicId: response.publicId,
    type: response.type,
    status: response.status,
    sourceAccountId: response.sourceAccountId,
    destinationAccountId: response.destinationAccountId,
    amount: response.amount,
    currency: response.currency,
    referenceType: response.referenceType,
    referencePublicId: response.referencePublicId,
    entries: response.entries.map(mapFinancialTransactionEntry),
    accountingJournalPublicId: response.accountingJournalPublicId,
    completedAt: response.completedAt,
    failedAt: response.failedAt,
    reversedAt: response.reversedAt,
    cancelledAt: response.cancelledAt,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

