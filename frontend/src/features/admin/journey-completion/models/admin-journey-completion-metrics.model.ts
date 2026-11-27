// -----------------------------------------------------------------------------
// Admin Journey Completion — Metrics
// -----------------------------------------------------------------------------

import type { AdminJourneyCompletionStatus } from './admin-journey-completion.enums';

// -----------------------------------------------------------------------------
// Status Distribution
// -----------------------------------------------------------------------------

export type AdminJourneyCompletionStatusCounts = Record<
  AdminJourneyCompletionStatus,
  number
>;

// -----------------------------------------------------------------------------
// Confirmation Metrics
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionConfirmationMetrics {
  totalRequiredConfirmations: number;

  totalConfirmedConfirmations: number;

  remainingConfirmations: number;

  confirmationCompletionRate: number;
}

// -----------------------------------------------------------------------------
// Completion Metrics
// -----------------------------------------------------------------------------

/**
 * Client-derived metrics calculated from the completion records currently
 * available to the frontend.
 *
 * These values are not returned by a dedicated backend metrics endpoint.
 */
export interface AdminJourneyCompletionMetrics {
  totalCompletions: number;

  statusCounts: AdminJourneyCompletionStatusCounts;

  pendingCount: number;

  confirmationRequiredCount: number;

  confirmedCount: number;

  disputedCount: number;

  cancelledCount: number;

  confirmationMetrics: AdminJourneyCompletionConfirmationMetrics;

  calculatedAt: string;
}

// -----------------------------------------------------------------------------
// Empty Status Counts
// -----------------------------------------------------------------------------

export const ADMIN_JOURNEY_COMPLETION_EMPTY_STATUS_COUNTS: AdminJourneyCompletionStatusCounts =
  {
    PENDING: 0,
    CONFIRMATION_REQUIRED: 0,
    CONFIRMED: 0,
    DISPUTED: 0,
    CANCELLED: 0,
  };

// -----------------------------------------------------------------------------
// Empty Metrics
// -----------------------------------------------------------------------------

export const ADMIN_JOURNEY_COMPLETION_EMPTY_METRICS: AdminJourneyCompletionMetrics =
  {
    totalCompletions: 0,

    statusCounts: ADMIN_JOURNEY_COMPLETION_EMPTY_STATUS_COUNTS,

    pendingCount: 0,

    confirmationRequiredCount: 0,

    confirmedCount: 0,

    disputedCount: 0,

    cancelledCount: 0,

    confirmationMetrics: {
      totalRequiredConfirmations: 0,
      totalConfirmedConfirmations: 0,
      remainingConfirmations: 0,
      confirmationCompletionRate: 0,
    },

    calculatedAt: '',
  };

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AdminJourneyCompletionMetrics;