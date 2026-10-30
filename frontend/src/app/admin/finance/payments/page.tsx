
// src/app/admin/finance/payments/page.tsx

"use client";

// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payments Page
// -----------------------------------------------------------------------------
//
// Platform finance control center composing:
// - Payments control center header and toolbar
// - Payment metrics and recent activity
// - Searchable, filterable, paginated payment directory
//
// Monetary volume remains grouped by currency.
// Detail navigation uses the canonical finance payment route and public ID.
// -----------------------------------------------------------------------------

import { useCallback, useMemo } from "react";

import { ADMIN_ROUTES } from "@/foundation/routing/admin-routes";

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type {
  AdminFinancialPaymentFilters,
} from "@/features/admin/finance/payments/models";

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

import {
  useAdminFinancialPayments,
  useAdminFinancialPaymentMetrics,
  useAdminFinancialPaymentFilters,
} from "@/features/admin/finance/payments/hooks";

// -----------------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------------

import { PaymentPageContainer } from "@/components/admin/finance/payments/layout/PaymentPageContainer";
import { PaymentPageToolbar } from "@/components/admin/finance/payments/layout/PaymentPageToolbar";
import { PaymentControlCenterHeader } from "@/components/admin/finance/payments/layout/PaymentControlCenterHeader";

// -----------------------------------------------------------------------------
// Overview And Directory
// -----------------------------------------------------------------------------

import { PaymentOverview } from "@/components/admin/finance/payments/overview/PaymentOverview";
import { PaymentDirectory } from "@/components/admin/finance/payments/directory";

// =============================================================================
// Page
// =============================================================================

export default function FinancialPaymentsPage() {

  // ---------------------------------------------------------------------------
  // Filters And Pagination State
  // ---------------------------------------------------------------------------

  const {
    filters,
    pagination,
    setFilters,
    setPage,
  } = useAdminFinancialPaymentFilters();

  // ---------------------------------------------------------------------------
  // Payment Directory Query
  // ---------------------------------------------------------------------------

  const {
    payments,
    allPayments,
    totalFiltered,
    query,
    isLoading,
    isError,
    error,
    refetch,
    currentPage,
    totalPages,
    pageSize,
  } = useAdminFinancialPayments(filters, pagination);

  // ---------------------------------------------------------------------------
  // Payment Metrics Query
  // ---------------------------------------------------------------------------

  const {
    metrics,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
  } = useAdminFinancialPaymentMetrics();

  // ---------------------------------------------------------------------------
  // Recent Payment References
  // ---------------------------------------------------------------------------

  const recentPayments = useMemo(
    () =>
      [...allPayments]
        .sort(
          (a, b) =>
            new Date(b.initiatedAt).getTime() -
            new Date(a.initiatedAt).getTime(),
        )
        .slice(0, 5)
        .map((payment) => ({
          publicId: payment.publicId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          initiatedAt: payment.initiatedAt,
          createdAt: payment.createdAt,
        })),
    [allPayments],
  );

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  // ---------------------------------------------------------------------------
  // Filter Changes
  // ---------------------------------------------------------------------------

  const handleFiltersChange = useCallback(
    (nextFilters: AdminFinancialPaymentFilters) => {
      // The filter hook resets pagination to page 1 automatically.
      setFilters(nextFilters);
    },
    [setFilters],
  );

  // ---------------------------------------------------------------------------
  // Page Changes
  // ---------------------------------------------------------------------------

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(nextPage);
    },
    [setPage],
  );

  // ---------------------------------------------------------------------------
  // Directory Page Model
  // ---------------------------------------------------------------------------

  const directoryPage = useMemo(
    () => ({
      items: payments,
      page: currentPage,
      pageSize,
      totalItems: totalFiltered,
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    }),
    [payments, currentPage, pageSize, totalFiltered, totalPages],
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <PaymentPageContainer size="2xl">
      <div className="space-y-6">
        {/* ----------------------------------------------------------------- */}
        {/* Control Center Header                                             */}
        {/* ----------------------------------------------------------------- */}

        <PaymentControlCenterHeader
          title="Financial payments"
          description="Monitor payment activity, investigate failed attempts, and review payment operations across the platform."
          actions={
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading || query.isFetching}
              className={[
                "inline-flex min-h-10 items-center justify-center",
                "rounded-lg border border-[var(--border)]",
                "px-3 py-2 text-sm font-medium",
                "text-[var(--foreground)]",
                "transition-colors hover:bg-[var(--background-muted)]",
                "disabled:cursor-not-allowed disabled:opacity-50",
              ].join(" ")}
            >
              {query.isFetching ? "Refreshing…" : "Refresh payments"}
            </button>
          }
        />

        {/* ----------------------------------------------------------------- */}
        {/* Directory Toolbar                                                */}
        {/* ----------------------------------------------------------------- */}

        <PaymentPageToolbar
          leading={
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Payment directory
              </h2>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                Search payments, narrow results with filters, and open a
                payment to inspect its details and processing attempts.
              </p>

              <p
                className="mt-2 text-sm text-[var(--foreground-muted)]"
                aria-live="polite"
              >
                {isLoading
                  ? "Loading financial payments…"
                  : isError
                    ? "Financial payments could not be loaded"
                    : `${allPayments.length.toLocaleString("en-KE")} payments loaded · ${totalFiltered.toLocaleString("en-KE")} matching filters`}
              </p>
            </div>
          }
        />

        {/* ----------------------------------------------------------------- */}
        {/* Payment Overview                                                  */}
        {/* ----------------------------------------------------------------- */}

        {isMetricsLoading ? (
          <section
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm text-[var(--foreground-muted)]">
              Loading payment overview…
            </p>
          </section>
        ) : isMetricsError ? (
          <section
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            role="status"
          >
            <p className="text-sm text-[var(--foreground-muted)]">
              Payment overview metrics are temporarily unavailable. The
              directory can still be used.
            </p>
          </section>
        ) : metrics.generatedAt ? (
          <PaymentOverview
            metrics={metrics}
            recentPayments={recentPayments}
            activityHref={ADMIN_ROUTES.FINANCE_PAYMENTS}
          />
        ) : (
          <section
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            role="status"
          >
            <p className="text-sm text-[var(--foreground-muted)]">
              Payment overview metrics are not yet available for a verified
              reporting scope. You can continue using the payment directory.
            </p>
          </section>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Payment Directory                                                 */}
        {/* ----------------------------------------------------------------- */}

        <PaymentDirectory
          page={directoryPage}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onPageChange={handlePageChange}
          loading={isLoading || query.isFetching}
          error={
            isError
              ? error instanceof Error
                ? error.message
                : "Unable to load financial payments."
              : null
          }
          onRetry={handleRefresh}
        />
      </div>
    </PaymentPageContainer>
  );
}
