export enum AdminFinancialTransactionType {
  PAYMENT = 'PAYMENT',
  TRANSFER = 'TRANSFER',
  HOLD = 'HOLD',
  RELEASE = 'RELEASE',
  CAPTURE = 'CAPTURE',
  SETTLEMENT = 'SETTLEMENT',
  DISBURSEMENT = 'DISBURSEMENT',
  REFUND = 'REFUND',
  REVERSAL = 'REVERSAL',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum AdminFinancialTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
  CANCELLED = 'CANCELLED',
}

export enum AdminFinancialTransactionEntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum AdminFinancialBalanceType {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  HELD = 'HELD',
}

/**
 * UI operation identifiers.
 * These correspond to the existing controller routes.
 */
export enum AdminFinancialTransactionOperation {
  COMPLETE = 'COMPLETE',
  FAIL = 'FAIL',
  REVERSE = 'REVERSE',
  CANCEL = 'CANCEL',
}