// -----------------------------------------------------------------------------
// sisiMove — Financial Transaction Model
// -----------------------------------------------------------------------------
//
// Presentation model for the FinancialTransaction aggregate.
//
// Backend aggregate:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// This model mirrors the backend financial transaction representation supplied
// by the backend. No fields or capabilities are invented by the frontend.
//
// -----------------------------------------------------------------------------

import {
  FinancialBalanceType,
  FinancialTransactionEntryType,
  type FinancialTransactionEntry,
} from "./financial-transaction-entry";

import {
  FinancialTransactionStatus,
} from "./financial-transaction-status";

import {
  FinancialTransactionType,
} from "./financial-transaction-type";

// -----------------------------------------------------------------------------
// Re-exports used by consumers of the transaction model.
// -----------------------------------------------------------------------------
//
// Enums are runtime values and therefore use normal `export`.
// Interfaces/types are compile-time-only and therefore use `export type`.
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
  id: string;

  publicId: string;

  type: FinancialTransactionType;

  status: FinancialTransactionStatus;

  sourceAccountId: string | null;

  destinationAccountId: string | null;

  amount: number;

  currency: string;

  referenceType: string | null;

  referencePublicId: string | null;

  entries: FinancialTransactionEntry[];

  accountingJournalPublicId: string | null;

  completedAt: string | null;

  failedAt: string | null;

  reversedAt: string | null;

  cancelledAt: string | null;

  createdAt: string;

  updatedAt: string;
}