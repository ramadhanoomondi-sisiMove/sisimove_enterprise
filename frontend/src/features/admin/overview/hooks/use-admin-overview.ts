
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Admin Overview Hooks
 * -----------------------------------------------------------------------------
 *
 * Server-state hooks for the Admin Overview feature.
 *
 * Responsibilities:
 *
 * - expose typed hooks for dashboard metrics;
 * - refresh metrics automatically in the background;
 * - keep the dashboard synchronized with backend changes;
 * - compose individual metrics into AdminOverviewModel;
 * - expose loading, error, and fetching states to the UI.
 *
 * Live-update strategy:
 *
 * - poll every 15 seconds;
 * - refresh when the browser tab becomes active again;
 * - reuse cached server state through TanStack Query.
 *
 * Architectural boundaries:
 *
 * - API adapters own HTTP requests.
 * - Authentication owns authenticated transport.
 * - The backend owns metric calculations.
 * - Hooks own server-state fetching and refresh behavior.
 * - Components own dashboard presentation.
 *
 * -----------------------------------------------------------------------------
 */

import { useQuery } from '@tanstack/react-query';

import {
  getActiveJourneys,
  getPendingJourneyCompletions,
  getPendingJourneySettlements,
  getPendingVerifications,
  getTotalBoardingParticipants,
  getTotalBookings,
  getTotalFinancialPayments,
  getTotalMembers,
} from '../api/admin-overview.api';

import type { AdminOverviewModel } from '../models/admin-overview.model';


// =============================================================================
// Refresh Configuration
// =============================================================================

/**
 * Automatically refresh dashboard metrics every 15 seconds.
 *
 * This updates the dashboard without a manual browser reload.
 */
const ADMIN_OVERVIEW_REFRESH_INTERVAL = 15_000;


// =============================================================================
// Query Keys
// =============================================================================

/**
 * Stable query keys allow TanStack Query to cache and refresh each metric
 * independently.
 */
export const adminOverviewQueryKeys = {
  all: ['admin-overview'] as const,

  totalMembers: ['admin-overview', 'total-members'] as const,

  pendingVerifications: [
    'admin-overview',
    'pending-verifications',
  ] as const,

  activeJourneys: ['admin-overview', 'active-journeys'] as const,

  totalBookings: ['admin-overview', 'total-bookings'] as const,

  totalBoardingParticipants: [
    'admin-overview',
    'total-boarding-participants',
  ] as const,

  pendingJourneyCompletions: [
    'admin-overview',
    'pending-journey-completions',
  ] as const,

  pendingJourneySettlements: [
    'admin-overview',
    'pending-journey-settlements',
  ] as const,

  totalFinancialPayments: [
    'admin-overview',
    'total-financial-payments',
  ] as const,
};


// =============================================================================
// Shared Refresh Options
// =============================================================================

const adminOverviewQueryOptions = {
  refetchInterval: ADMIN_OVERVIEW_REFRESH_INTERVAL,

  /**
   * Refresh when the user returns to the browser tab.
   */
  refetchOnWindowFocus: true,

  /**
   * Do not continue background polling while the tab is inactive.
   */
  refetchIntervalInBackground: false,
};


// =============================================================================
// Total Members
// =============================================================================

export function useTotalMembers() {
  return useQuery({
    queryKey: adminOverviewQueryKeys.totalMembers,
    queryFn: getTotalMembers,
    ...adminOverviewQueryOptions,
  });
}


// =============================================================================
// Pending Verifications
// =============================================================================

export function usePendingVerifications() {
  return useQuery({
    queryKey: adminOverviewQueryKeys.pendingVerifications,
    queryFn: getPendingVerifications,
    ...adminOverviewQueryOptions,
  });
}


// =============================================================================
// Active Journeys
// =============================================================================

export function useActiveJourneys() {
  return useQuery({
    queryKey: adminOverviewQueryKeys.activeJourneys,
    queryFn: getActiveJourneys,
    ...adminOverviewQueryOptions,
  });
}


// =============================================================================
// Total Bookings
// =============================================================================

export function useTotalBookings() {
  return useQuery({
    queryKey: adminOverviewQueryKeys.totalBookings,
    queryFn: getTotalBookings,
    ...adminOverviewQueryOptions,
  });
}


// =============================================================================
// Total Journey Boarding Participants
// =============================================================================

export function useTotalBoardingParticipants() {
  return useQuery({
    queryKey: adminOverviewQueryKeys.totalBoardingParticipants,
    queryFn: getTotalBoardingParticipants,
    ...adminOverviewQueryOptions,
  });
}


// =============================================================================
// Pending Journey Completions
// =============================================================================

export function usePendingJourneyCompletions() {
  return useQuery({
    queryKey: adminOverviewQueryKeys.pendingJourneyCompletions,
    queryFn: getPendingJourneyCompletions,
    ...adminOverviewQueryOptions,
  });
}


// =============================================================================
// Pending Journey Settlements
// =============================================================================

export function usePendingJourneySettlements() {
  return useQuery({
    queryKey: adminOverviewQueryKeys.pendingJourneySettlements,
    queryFn: getPendingJourneySettlements,
    ...adminOverviewQueryOptions,
  });
}


// =============================================================================
// Total Financial Payments
// =============================================================================

export function useTotalFinancialPayments() {
  return useQuery({
    queryKey: adminOverviewQueryKeys.totalFinancialPayments,
    queryFn: getTotalFinancialPayments,
    ...adminOverviewQueryOptions,
  });
}


// =============================================================================
// Complete Admin Overview
// =============================================================================

/**
 * Fetches and composes all Admin Overview metrics.
 *
 * Each metric is independently cached and refreshed. This combined hook
 * exposes the complete AdminOverviewModel when all eight metrics have loaded.
 *
 * A failed metric does not get silently replaced with zero.
 */
export function useAdminOverview() {
  const totalMembers = useTotalMembers();

  const pendingVerifications = usePendingVerifications();

  const activeJourneys = useActiveJourneys();

  const totalBookings = useTotalBookings();

  const totalBoardingParticipants = useTotalBoardingParticipants();

  const pendingJourneyCompletions = usePendingJourneyCompletions();

  const pendingJourneySettlements = usePendingJourneySettlements();

  const totalFinancialPayments = useTotalFinancialPayments();

  const queries = [
    totalMembers,
    pendingVerifications,
    activeJourneys,
    totalBookings,
    totalBoardingParticipants,
    pendingJourneyCompletions,
    pendingJourneySettlements,
    totalFinancialPayments,
  ];

  const isLoading = queries.some((query) => query.isLoading);

  const isFetching = queries.some((query) => query.isFetching);

  const isError = queries.some((query) => query.isError);

  const error =
    totalMembers.error ??
    pendingVerifications.error ??
    activeJourneys.error ??
    totalBookings.error ??
    totalBoardingParticipants.error ??
    pendingJourneyCompletions.error ??
    pendingJourneySettlements.error ??
    totalFinancialPayments.error;

  const allMetricsLoaded = queries.every(
    (query) => query.data !== undefined,
  );

  const data: AdminOverviewModel | undefined = allMetricsLoaded
    ? {
        totalMembers: totalMembers.data!,
        pendingVerifications: pendingVerifications.data!,
        activeJourneys: activeJourneys.data!,
        totalBookings: totalBookings.data!,
        totalBoardingParticipants: totalBoardingParticipants.data!,
        pendingJourneyCompletions: pendingJourneyCompletions.data!,
        pendingJourneySettlements: pendingJourneySettlements.data!,
        totalFinancialPayments: totalFinancialPayments.data!,
      }
    : undefined;

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  };
}
