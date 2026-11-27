
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Journey Completion Metrics Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Calculate completion counts by status.
 * - Calculate confirmation totals and completion rate.
 * - Provide summary metrics for the admin dashboard.
 *
 * Architecture:
 * - Metrics are derived from the supplied completion collection.
 * - No additional backend metrics endpoint is assumed.
 * - TanStack Query is not needed for local calculations.
 * -----------------------------------------------------------------------------
 */

import { useMemo } from 'react';

import type {
  AdminJourneyCompletion,
  AdminJourneyCompletionMetrics,
  AdminJourneyCompletionStatusCounts,
} from '../models';

import {
  AdminJourneyCompletionStatus,
} from '../models/admin-journey-completion.enums';

// -----------------------------------------------------------------------------
// Empty Metrics
// -----------------------------------------------------------------------------

function createEmptyStatusCounts(): AdminJourneyCompletionStatusCounts {
  return {
    [AdminJourneyCompletionStatus.PENDING]: 0,
    [AdminJourneyCompletionStatus.CONFIRMATION_REQUIRED]: 0,
    [AdminJourneyCompletionStatus.CONFIRMED]: 0,
    [AdminJourneyCompletionStatus.DISPUTED]: 0,
    [AdminJourneyCompletionStatus.CANCELLED]: 0,
  };
}

// -----------------------------------------------------------------------------
// Metrics Calculation
// -----------------------------------------------------------------------------

export function calculateAdminJourneyCompletionMetrics(
  completions: AdminJourneyCompletion[],
): AdminJourneyCompletionMetrics {
  const statusCounts = createEmptyStatusCounts();

  let totalRequiredConfirmations = 0;
  let totalConfirmedConfirmations = 0;

  for (const completion of completions) {
    statusCounts[completion.status] += 1;

    totalRequiredConfirmations += completion.requiredConfirmations;
    totalConfirmedConfirmations += completion.confirmedCount;
  }

  const remainingConfirmations = Math.max(
    0,
    totalRequiredConfirmations - totalConfirmedConfirmations,
  );

  const confirmationCompletionRate =
    totalRequiredConfirmations > 0
      ? Math.round(
          (totalConfirmedConfirmations /
            totalRequiredConfirmations) *
            100,
        )
      : 0;

  return {
    totalCompletions: completions.length,

    statusCounts,

    pendingCount:
      statusCounts[AdminJourneyCompletionStatus.PENDING],

    confirmationRequiredCount:
      statusCounts[
        AdminJourneyCompletionStatus.CONFIRMATION_REQUIRED
      ],

    confirmedCount:
      statusCounts[AdminJourneyCompletionStatus.CONFIRMED],

    disputedCount:
      statusCounts[AdminJourneyCompletionStatus.DISPUTED],

    cancelledCount:
      statusCounts[AdminJourneyCompletionStatus.CANCELLED],

    confirmationMetrics: {
      totalRequiredConfirmations,
      totalConfirmedConfirmations,
      remainingConfirmations,
      confirmationCompletionRate,
    },

    calculatedAt: new Date().toISOString(),
  };
}

// -----------------------------------------------------------------------------
// Metrics Hook
// -----------------------------------------------------------------------------

export function useAdminJourneyCompletionMetrics(
  completions: AdminJourneyCompletion[] = [],
) {
  const metrics = useMemo(
    () => calculateAdminJourneyCompletionMetrics(completions),
    [completions],
  );

  return {
    metrics,

    totalCompletions: metrics.totalCompletions,
    statusCounts: metrics.statusCounts,

    pendingCount: metrics.pendingCount,
    confirmationRequiredCount: metrics.confirmationRequiredCount,
    confirmedCount: metrics.confirmedCount,
    disputedCount: metrics.disputedCount,
    cancelledCount: metrics.cancelledCount,

    confirmationMetrics: metrics.confirmationMetrics,

    calculatedAt: metrics.calculatedAt,
  };
}
