import type {
  AdminFinancialPaymentAttemptStatus,
  AdminFinancialPaymentStatus,
} from './admin-financial-payment.enums';

/**
 * Metrics grouped by currency.
 *
 * Amounts from different currencies must never be added together
 * without an explicit currency-conversion policy.
 */
export interface AdminFinancialPaymentCurrencyMetric {
  currency: string;

  totalAmount: number;

  succeededAmount: number;

  failedAmount: number;

  paymentCount: number;
}

/**
 * Count of payments by status.
 */
export type AdminFinancialPaymentStatusCounts = Partial<
  Record<AdminFinancialPaymentStatus, number>
>;

/**
 * Count of attempts by status.
 */
export type AdminFinancialPaymentAttemptStatusCounts = Partial<
  Record<AdminFinancialPaymentAttemptStatus, number>
>;

/**
 * A single point for a chart or activity trend.
 * The date should use the agreed reporting interval, such as a day.
 */
export interface AdminFinancialPaymentTrendPoint {
  date: string;

  paymentCount: number;

  succeededCount: number;

  failedCount: number;
}

/**
 * Frontend dashboard aggregation model.
 *
 * The current controller does not expose a metrics endpoint.
 * Populate this from a dedicated backend endpoint or from an explicitly
 * bounded dataset; do not present partial client-side data as global totals.
 */
export interface AdminFinancialPaymentMetrics {
  totalPayments: number;

  pendingPayments: number;

  processingPayments: number;

  succeededPayments: number;

  failedPayments: number;

  cancelledPayments: number;

  expiredPayments: number;

  totalAttempts: number;

  paymentCountsByStatus: AdminFinancialPaymentStatusCounts;

  attemptCountsByStatus: AdminFinancialPaymentAttemptStatusCounts;

  amountsByCurrency: AdminFinancialPaymentCurrencyMetric[];

  trend: AdminFinancialPaymentTrendPoint[];

  generatedAt: string;
}

export const EMPTY_ADMIN_FINANCIAL_PAYMENT_METRICS: AdminFinancialPaymentMetrics =
  {
    totalPayments: 0,
    pendingPayments: 0,
    processingPayments: 0,
    succeededPayments: 0,
    failedPayments: 0,
    cancelledPayments: 0,
    expiredPayments: 0,
    totalAttempts: 0,
    paymentCountsByStatus: {},
    attemptCountsByStatus: {},
    amountsByCurrency: [],
    trend: [],
    generatedAt: '',
  };