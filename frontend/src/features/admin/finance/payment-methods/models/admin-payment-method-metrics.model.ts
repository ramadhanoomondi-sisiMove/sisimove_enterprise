
/**
 * Admin Payment Method — Metrics Model
 *
 * Aggregate statistics for the admin overview.
 */
export interface AdminPaymentMethodMetrics {
  total: number;

  active: number;

  inactive: number;

  defaultMethods: number;

  nonDefaultMethods: number;

  /** Number of distinct owning accounts represented in the dataset. */
  accountsWithPaymentMethods: number;

  /** Number of distinct provider names represented in the dataset. */
  providerCount: number;

  /** Number of payment methods created during the current reporting period. */
  createdThisPeriod: number;

  /** Number of payment methods updated during the current reporting period. */
  updatedThisPeriod: number;

  generatedAt: string;
}

/** Payment-method counts grouped by provider. */
export interface AdminPaymentMethodProviderMetric {
  provider: string;
  total: number;
  active: number;
  inactive: number;
}

/** Payment-method counts grouped by type. */
export interface AdminPaymentMethodTypeMetric {
  type: string;
  total: number;
  active: number;
  inactive: number;
}

/** Time-series point for payment-method registration activity. */
export interface AdminPaymentMethodActivityMetric {
  date: string;
  created: number;
}

/** Complete overview data. */
export interface AdminPaymentMethodMetricsOverview {
  summary: AdminPaymentMethodMetrics;
  byProvider: AdminPaymentMethodProviderMetric[];
  byType: AdminPaymentMethodTypeMetric[];
  activity: AdminPaymentMethodActivityMetric[];
}

/** Empty metrics state for loading and empty-data scenarios. */
export const EMPTY_ADMIN_PAYMENT_METHOD_METRICS: AdminPaymentMethodMetrics = {
  total: 0,
  active: 0,
  inactive: 0,
  defaultMethods: 0,
  nonDefaultMethods: 0,
  accountsWithPaymentMethods: 0,
  providerCount: 0,
  createdThisPeriod: 0,
  updatedThisPeriod: 0,
  generatedAt: '',
};
