//src/features/financial-transactions/models/financial-transaction.ts
import {
  FinancialBalanceType,
  FinancialTransactionEntryType,
  type FinancialTransactionEntry,
} from './financial-transaction-entry';

import { FinancialTransactionStatus } from './financial-transaction-status';

import { FinancialTransactionType } from './financial-transaction-type';

// -----------------------------------------------------------------------------
// Re-exports
// -----------------------------------------------------------------------------

export type {
  FinancialTransactionEntry,
};

export {
  FinancialBalanceType,
  FinancialTransactionEntryType,
  FinancialTransactionStatus,
  FinancialTransactionType,
};

// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

export interface FinancialTransaction {
  publicId: string;

  type: FinancialTransactionType;
  status: FinancialTransactionStatus;

  sourceAccountPublicId: string | null;
  destinationAccountPublicId: string | null;

  /** Integer minor units. */
  amount: number;

  currency: string;

  /** Serialized backend reference: TYPE:PUBLIC_ID. */
  reference: string | null;

  entries: FinancialTransactionEntry[];

  accountingJournalPublicId: string | null;

  completedAt: string | null;
  failedAt: string | null;
  reversedAt: string | null;
  cancelledAt: string | null;

  createdAt: string;
  updatedAt: string;
}
