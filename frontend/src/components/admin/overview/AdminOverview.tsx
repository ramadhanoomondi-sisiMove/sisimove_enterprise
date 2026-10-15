
"use client";

/**
 * -----------------------------------------------------------------------------
 * sisiMove — Admin Overview
 * -----------------------------------------------------------------------------
 *
 * Main administration dashboard and composition root for overview components.
 *
 * Responsibilities:
 *
 * - load platform metrics through useAdminOverview;
 * - display responsive metric cards and operational attention;
 * - expose manual refresh and automatic-refresh status;
 * - preserve existing administration navigation;
 * - display appropriate loading and error states.
 *
 * Architectural boundaries:
 *
 * - API requests remain in the Admin Overview API adapters.
 * - Server-state refresh remains in the Admin Overview hooks.
 * - Routes remain owned by the application routing layer.
 * - This component composes presentation components.
 *
 * -----------------------------------------------------------------------------
 */

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  Activity,
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Route,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

import { ADMIN_ROUTES } from "@/foundation/routing/admin-routes";

import {
  AdminQuickActions,
  OverviewErrorState,
  OverviewHeader,
  OverviewLinkCard,
  OverviewLoadingState,
  OverviewMetricGrid,
  OverviewOperationsPanel,
} from "@/components/admin/overview";

import {
  adminOverviewQueryKeys,
  useAdminOverview,
} from "@/features/admin/overview/hooks/use-admin-overview";

import type { OverviewMetricId } from "./OverviewMetricGrid";
import type { OverviewOperationId } from "./OverviewOperationsPanel";


// =============================================================================
// Navigation Configuration
// =============================================================================

const OVERVIEW_LINKS = [
  {
    title: "Member management",
    description: "Inspect member accounts and identities.",
    icon: Users,
    href: ADMIN_ROUTES.MEMBERS,
  },
  {
    title: "Verification management",
    description: "Review member verification records.",
    icon: BadgeCheck,
    href: ADMIN_ROUTES.VERIFICATIONS,
  },
  {
    title: "Journey management",
    description: "Monitor journey operations.",
    icon: Route,
    href: ADMIN_ROUTES.JOURNEYS,
  },
  {
    title: "Booking management",
    description: "Inspect booking records and statuses.",
    icon: CalendarDays,
    href: ADMIN_ROUTES.BOOKINGS,
  },
  {
    title: "Payment management",
    description: "Review financial payment records.",
    icon: Wallet,
    href: ADMIN_ROUTES.PAYMENTS,
  },
  {
    title: "Transaction management",
    description: "Access financial transaction records.",
    icon: CreditCard,
    href: ADMIN_ROUTES.TRANSACTIONS,
  },
] as const;


// =============================================================================
// Quick Actions
// =============================================================================

const QUICK_ACTION_DEFINITIONS = [
  {
    id: "verifications",
    label: "Review verifications",
    description: "Process pending verification records.",
    icon: <BadgeCheck size={20} aria-hidden="true" />,
    href: ADMIN_ROUTES.VERIFICATIONS,
  },
  {
    id: "members",
    label: "Manage members",
    description: "Inspect member accounts and identities.",
    icon: <Users size={20} aria-hidden="true" />,
    href: ADMIN_ROUTES.MEMBERS,
  },
  {
    id: "journeys",
    label: "Review journeys",
    description: "Open journey operations.",
    icon: <Route size={20} aria-hidden="true" />,
    href: ADMIN_ROUTES.JOURNEYS,
  },
  {
    id: "bookings",
    label: "Review bookings",
    description: "Inspect booking records and statuses.",
    icon: <CalendarDays size={20} aria-hidden="true" />,
    href: ADMIN_ROUTES.BOOKINGS,
  },
  {
    id: "payments",
    label: "Financial oversight",
    description: "Open payment management.",
    icon: <CreditCard size={20} aria-hidden="true" />,
    href: ADMIN_ROUTES.PAYMENTS,
  },
  {
    id: "access-control",
    label: "Access control",
    description: "Manage administrative roles and permissions.",
    icon: <ShieldCheck size={20} aria-hidden="true" />,
    href: ADMIN_ROUTES.ROLES,
  },
] as const;


// =============================================================================
// Metric Navigation
// =============================================================================

const METRIC_ROUTES: Record<OverviewMetricId, string> = {
  totalMembers: ADMIN_ROUTES.MEMBERS,
  pendingVerifications: ADMIN_ROUTES.VERIFICATIONS,
  activeJourneys: ADMIN_ROUTES.JOURNEYS,
  totalBookings: ADMIN_ROUTES.BOOKINGS,
  totalBoardingParticipants: ADMIN_ROUTES.JOURNEYS,
  pendingJourneyCompletions: ADMIN_ROUTES.JOURNEYS,
  pendingJourneySettlements: ADMIN_ROUTES.PAYMENTS,
  totalFinancialPayments: ADMIN_ROUTES.PAYMENTS,
};


// =============================================================================
// Admin Overview
// =============================================================================

export default function AdminOverview() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useAdminOverview();

  /**
   * Invalidate the overview query family.
   *
   * TanStack Query will refetch the active metric queries without a full
   * browser reload.
   */
  const handleRefresh = () => {
    void queryClient.invalidateQueries({
      queryKey: adminOverviewQueryKeys.all,
    });
  };

  const handleMetricClick = (metricId: OverviewMetricId) => {
    router.push(METRIC_ROUTES[metricId]);
  };

  const handleOperationClick = (operationId: OverviewOperationId) => {
    const routes: Record<OverviewOperationId, string> = {
      pendingVerifications: ADMIN_ROUTES.VERIFICATIONS,
      pendingJourneyCompletions: ADMIN_ROUTES.JOURNEYS,
      pendingJourneySettlements: ADMIN_ROUTES.PAYMENTS,
    };

    router.push(routes[operationId]);
  };

  const quickActions = QUICK_ACTION_DEFINITIONS.map((action) => ({
    id: action.id,
    label: action.label,
    description: action.description,
    icon: action.icon,
    onClick: () => router.push(action.href),
  }));

  // ---------------------------------------------------------------------------
  // Initial Loading
  // ---------------------------------------------------------------------------

  if (isLoading && !data) {
    return (
      <div className="page-container py-8">
        <OverviewLoadingState
          title="Loading platform overview"
          metricCount={8}
          showOperations
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Initial Error
  // ---------------------------------------------------------------------------

  if (isError && !data) {
    return (
      <div className="page-container py-8">
        <OverviewErrorState
          title="Unable to load platform overview"
          description="The dashboard could not retrieve all required metrics. Please retry the request."
          onRetry={handleRefresh}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------------

  return (
    <div className="page-container space-y-8 py-8">
      {/* ------------------------------------------------------------------- */}
      {/* Page Header                                                         */}
      {/* ------------------------------------------------------------------- */}

      <OverviewHeader
        title="Dashboard overview"
        description="Monitor sisiMove operations, review outstanding work, and manage platform activity from one workspace."
        liveUpdatesEnabled
        isRefreshing={isFetching}
        onRefresh={handleRefresh}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Background Refresh Error                                            */}
      {/* ------------------------------------------------------------------- */}

      {isError && data && (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--warning)]/30 bg-[var(--warning-soft)] p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <Activity
              size={20}
              className="mt-0.5 shrink-0 text-[var(--warning)]"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Some dashboard metrics could not be refreshed.
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                Previously loaded information remains visible where available.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="self-start text-sm font-semibold text-[var(--foreground)] underline underline-offset-4 disabled:opacity-50 sm:self-center"
          >
            Try again
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Live Metrics                                                        */}
      {/* ------------------------------------------------------------------- */}

      {data && (
        <section
          aria-labelledby="platform-metrics-heading"
          className="space-y-4"
        >
          <div>
            <h2
              id="platform-metrics-heading"
              className="text-lg font-semibold tracking-tight text-[var(--foreground)]"
            >
              Platform metrics
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              An overview of members, journeys, bookings, and financial
              operations.
            </p>
          </div>

          <OverviewMetricGrid
            metrics={data}
            onMetricClick={handleMetricClick}
          />
        </section>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Operational Attention                                               */}
      {/* ------------------------------------------------------------------- */}

      {data && (
        <OverviewOperationsPanel
          metrics={data}
          onOpenOperation={handleOperationClick}
        />
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Quick Actions                                                       */}
      {/* ------------------------------------------------------------------- */}

      <AdminQuickActions
        title="Quick actions"
        description="Jump directly to common administration workflows."
        actions={quickActions}
        columns={3}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Management Navigation                                               */}
      {/* ------------------------------------------------------------------- */}

      <section
        aria-labelledby="management-links-heading"
        className="space-y-4"
      >
        <div>
          <h2
            id="management-links-heading"
            className="text-lg font-semibold tracking-tight text-[var(--foreground)]"
          >
            Management workspace
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Open a dedicated area to manage platform records.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {OVERVIEW_LINKS.map((link) => (
            <OverviewLinkCard
              key={link.title}
              title={link.title}
              description={link.description}
              href={link.href}
              icon={link.icon}
            />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------- */}

      <footer className="border-t border-[var(--border)] pt-5">
        <p className="text-xs leading-5 text-[var(--foreground-muted)]">
          sisiMove administration · Protected records and administrative
          actions must be authorized by the backend.
        </p>
      </footer>
    </div>
  );
}
