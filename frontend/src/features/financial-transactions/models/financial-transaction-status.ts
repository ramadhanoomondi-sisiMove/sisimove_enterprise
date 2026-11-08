//src/features/financial-transactions/models/financial-transaction-status.ts
export enum FinancialTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
  CANCELLED = 'CANCELLED',
}
