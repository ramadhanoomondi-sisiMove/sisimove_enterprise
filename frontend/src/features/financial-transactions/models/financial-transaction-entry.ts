// -----------------------------------------------------------------------------
// sisiMove — Financial Transaction Entry Model
// -----------------------------------------------------------------------------
//
// Presentation model for FinancialTransactionEntry.
//
// Backend aggregate:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// FinancialTransactionEntryEntity is owned by the FinancialTransaction
// aggregate and is therefore represented as a child model of the transaction.
//
// No independent frontend API capability is introduced here.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Entry Type
// -----------------------------------------------------------------------------

export enum FinancialTransactionEntryType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

// -----------------------------------------------------------------------------
// Balance Type
// -----------------------------------------------------------------------------

export enum FinancialBalanceType {
  AVAILABLE = "AVAILABLE",
  PENDING = "PENDING",
  HELD = "HELD",
}

// -----------------------------------------------------------------------------
// Financial Transaction Entry
// -----------------------------------------------------------------------------

export interface FinancialTransactionEntry {
  id: string;
  publicId: string;

  transactionId: string;

  accountId: string;

  type: FinancialTransactionEntryType;
  balanceType: FinancialBalanceType;

  amount: number;

  createdAt: string;
}

