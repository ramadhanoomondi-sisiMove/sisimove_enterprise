
import {
  AdminFinancialBalanceType,
  AdminFinancialTransactionEntryType,
  AdminFinancialTransactionStatus,
  AdminFinancialTransactionType,
} from './admin-financial-transaction.enums';

// =============================================================================
// Financial Transaction Entry
// =============================================================================

export interface AdminFinancialTransactionEntry {
  publicId: string;
  accountPublicId: string;
  type: AdminFinancialTransactionEntryType;
  balanceType: AdminFinancialBalanceType;

  /**
   * Integer amount in currency minor units.
   */
  amount: number;

  currency: string;
  createdAt: string;
}

// =============================================================================
// Financial Transaction
// =============================================================================

export interface AdminFinancialTransaction {
  publicId: string;

  type: AdminFinancialTransactionType;
  status: AdminFinancialTransactionStatus;

  /**
   * Integer amount in currency minor units.
   *
   * Do not convert this value in the model.
   * Use the shared currency formatter for display.
   */
  amount: number;

  currency: string;

  sourceAccountPublicId?: string;
  destinationAccountPublicId?: string;

  /**
   * Serialized business reference, e.g. TYPE:PUBLIC_ID.
   */
  reference?: string;

  accountingJournalPublicId?: string;

  entries: AdminFinancialTransactionEntry[];

  completedAt?: string;
  failedAt?: string;
  reversedAt?: string;
  cancelledAt?: string;

  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Public Identifier
// =============================================================================

export type AdminFinancialTransactionPublicId = string;
