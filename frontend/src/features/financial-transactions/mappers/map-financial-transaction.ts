
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

export interface FinancialTransactionResponse {
  readonly publicId: string;

  readonly type: FinancialTransaction['type'];
  readonly status: FinancialTransaction['status'];

  readonly sourceAccountPublicId?: string | null;
  readonly destinationAccountPublicId?: string | null;

  /** Integer minor units. */
  readonly amount: number;

  readonly currency: string;

  readonly reference?: string | null;

  readonly entries: readonly FinancialTransactionEntryResponse[];

  readonly accountingJournalPublicId?: string | null;

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

export function mapFinancialTransaction(
  response: FinancialTransactionResponse,
): FinancialTransaction {
  return {
    publicId: response.publicId,

    type: response.type,
    status: response.status,

    sourceAccountPublicId: response.sourceAccountPublicId ?? null,
    destinationAccountPublicId:
      response.destinationAccountPublicId ?? null,

    amount: response.amount,
    currency: response.currency,

    reference: response.reference ?? null,

    entries: response.entries.map(mapFinancialTransactionEntry),

    accountingJournalPublicId:
      response.accountingJournalPublicId ?? null,

    completedAt: response.completedAt,
    failedAt: response.failedAt,
    reversedAt: response.reversedAt,
    cancelledAt: response.cancelledAt,

    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}
