// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Metrics
// -----------------------------------------------------------------------------
// These are presentation-level aggregate shapes, not backend response DTOs.
// Metrics must be calculated only from a clearly defined, complete input set.
// Monetary balances are grouped by currency; different currencies must never
// be added together into a single monetary total.
// -----------------------------------------------------------------------------

import type { AdminFinancialAccountStatus } from './admin-financial-account.enums';

export interface AdminFinancialAccountStatusCount {
  status: AdminFinancialAccountStatus;
  count: number;
}

export interface AdminFinancialAccountCurrencyBalanceMetrics {
  currency: string;
  accountCount: number;
  availableAmount: number;
  pendingAmount: number;
  heldAmount: number;
  totalAmount: number;
}

/**
 * Derived metrics for the exact collection represented by the source data.
 * Do not label these as platform-wide totals unless the source is known to be
 * a complete platform-wide account collection.
 */
export interface AdminFinancialAccountMetrics {
  accountCount: number;
  statusCounts: AdminFinancialAccountStatusCount[];
  balancesByCurrency: AdminFinancialAccountCurrencyBalanceMetrics[];
}
