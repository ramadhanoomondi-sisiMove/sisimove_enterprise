//src/features/financial-transactions/models/financial-transaction-entry.ts
export enum FinancialTransactionEntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum FinancialBalanceType {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  HELD = 'HELD',
}

export interface FinancialTransactionEntry {
  publicId: string;
  accountPublicId: string;

  type: FinancialTransactionEntryType;
  balanceType: FinancialBalanceType;

  /** Integer minor units. */
  amount: number;

  currency: string;
  createdAt: string;
}
