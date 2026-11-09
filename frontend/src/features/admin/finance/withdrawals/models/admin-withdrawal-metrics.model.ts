
/**
 * SisiMove Admin — Withdrawal Metrics
 */

import type { AdminWithdrawal } from './admin-withdrawal.model';

import type { AdminWithdrawalStatus } from './admin-withdrawal.enums';

// =============================================================================
// Status Metrics
// =============================================================================

export type AdminWithdrawalStatusCounts = Record<
  AdminWithdrawalStatus,
  number
>;

// =============================================================================
// Financial Metrics
// =============================================================================

export interface AdminWithdrawalAmountMetrics {
  total: number;

  completed: number;

  pending: number;

  processing: number;

  failed: number;

  cancelled: number;

  currency: string;
}

// =============================================================================
// Time-Based Volume Metrics
// =============================================================================

/**
 * Daily withdrawal request volume.
 *
 * date uses the YYYY-MM-DD UTC format.
 */
export interface AdminWithdrawalDailyVolume {
  date: string;
  count: number;
}

/**
 * Monthly withdrawal request volume.
 *
 * month uses the YYYY-MM format.
 */
export interface AdminWithdrawalMonthlyVolume {
  month: string;
  count: number;
}

// =============================================================================
// Overview Metrics
// =============================================================================

export interface AdminWithdrawalMetrics {
  totalWithdrawals: number;

  statusCounts: AdminWithdrawalStatusCounts;

  amountsByCurrency: Record<
    string,
    AdminWithdrawalAmountMetrics
  >;

  dailyVolume: AdminWithdrawalDailyVolume[];

  monthlyVolume: AdminWithdrawalMonthlyVolume[];
}

// =============================================================================
// Initial Metrics
// =============================================================================

export const EMPTY_ADMIN_WITHDRAWAL_METRICS: AdminWithdrawalMetrics = {
  totalWithdrawals: 0,

  statusCounts: {
    PENDING: 0,
    PROCESSING: 0,
    COMPLETED: 0,
    FAILED: 0,
    CANCELLED: 0,
  },

  amountsByCurrency: {},

  dailyVolume: [],

  monthlyVolume: [],
};

// =============================================================================
// Metrics Calculator
// =============================================================================

export function calculateAdminWithdrawalMetrics(
  withdrawals: readonly AdminWithdrawal[],
): AdminWithdrawalMetrics {
  const metrics: AdminWithdrawalMetrics = {
    totalWithdrawals: withdrawals.length,

    statusCounts: {
      PENDING: 0,
      PROCESSING: 0,
      COMPLETED: 0,
      FAILED: 0,
      CANCELLED: 0,
    },

    amountsByCurrency: {},

    dailyVolume: [],

    monthlyVolume: [],
  };

  // ---------------------------------------------------------------------------
  // Temporary volume aggregations
  // ---------------------------------------------------------------------------

  const dailyVolumeMap = new Map<string, number>();

  const monthlyVolumeMap = new Map<string, number>();

  // ---------------------------------------------------------------------------
  // Process withdrawals
  // ---------------------------------------------------------------------------

  for (const withdrawal of withdrawals) {
    // Status counts
    metrics.statusCounts[withdrawal.status] += 1;

    // Financial metrics grouped by currency
    const currency = withdrawal.currency;

    if (!metrics.amountsByCurrency[currency]) {
      metrics.amountsByCurrency[currency] = {
        total: 0,
        completed: 0,
        pending: 0,
        processing: 0,
        failed: 0,
        cancelled: 0,
        currency,
      };
    }

    const amounts = metrics.amountsByCurrency[currency];

    amounts.total += withdrawal.amount;

    switch (withdrawal.status) {
      case 'COMPLETED':
        amounts.completed += withdrawal.amount;
        break;

      case 'PENDING':
        amounts.pending += withdrawal.amount;
        break;

      case 'PROCESSING':
        amounts.processing += withdrawal.amount;
        break;

      case 'FAILED':
        amounts.failed += withdrawal.amount;
        break;

      case 'CANCELLED':
        amounts.cancelled += withdrawal.amount;
        break;
    }

    // -------------------------------------------------------------------------
    // Daily and monthly volume
    // -------------------------------------------------------------------------

    const requestedAt = new Date(withdrawal.requestedAt);

    // Invalid dates are excluded from time-based metrics.
    if (Number.isNaN(requestedAt.getTime())) {
      continue;
    }

    // Use UTC to ensure consistent date grouping.
    const date = requestedAt.toISOString().slice(0, 10);

    const month = date.slice(0, 7);

    dailyVolumeMap.set(
      date,
      (dailyVolumeMap.get(date) ?? 0) + 1,
    );

    monthlyVolumeMap.set(
      month,
      (monthlyVolumeMap.get(month) ?? 0) + 1,
    );
  }

  // ---------------------------------------------------------------------------
  // Convert volume maps into chronologically sorted arrays
  // ---------------------------------------------------------------------------

  metrics.dailyVolume = Array.from(
    dailyVolumeMap,
    ([date, count]) => ({
      date,
      count,
    }),
  ).sort((a, b) => a.date.localeCompare(b.date));

  metrics.monthlyVolume = Array.from(
    monthlyVolumeMap,
    ([month, count]) => ({
      month,
      count,
    }),
  ).sort((a, b) => a.month.localeCompare(b.month));

  return metrics;
}
