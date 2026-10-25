import type {
  AdminFinancialTransactionStatus,
} from './admin-financial-transaction.enums';

export interface AdminFinancialTransactionStatusCount {
  status: AdminFinancialTransactionStatus;
  count: number;
}

export interface AdminFinancialTransactionCurrencyVolume {
  currency: string;

  /**
   * Sum of transaction amounts in integer minor units.
   */
  amount: number;

  transactionCount: number;
}

export interface AdminFinancialTransactionMetrics {
  totalTransactions: number;

  pendingTransactions: number;

  completedTransactions: number;

  failedTransactions: number;

  reversedTransactions: number;

  cancelledTransactions: number;

  /**
   * Group volume by currency to avoid adding unlike currencies.
   */
  volumeByCurrency: AdminFinancialTransactionCurrencyVolume[];

  statusBreakdown: AdminFinancialTransactionStatusCount[];

  /**
   * Identifies the scope of the calculation.
   */
  scope: 'ALL_MATCHING' | 'CURRENT_PAGE';

  calculatedAt: string;
}

export type AdminFinancialTransactionMetricsState =
  | {
      status: 'idle';
    }
  | {
      status: 'loading';
    }
  | {
      status: 'success';
      data: AdminFinancialTransactionMetrics;
    }
  | {
      status: 'error';
      message: string;
    };