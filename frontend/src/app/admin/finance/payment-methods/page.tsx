
"use client";

// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Methods Control Center
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the Payment Methods control-center header.
// - Show an overview derived from the payment-method collection.
// - Delegate search, filtering, and pagination to PaymentMethodDirectory.
// - Navigate to the selected payment method detail page.
// - Provide refresh and independent loading/error feedback.
// -----------------------------------------------------------------------------

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import type {
  AdminPaymentMethod,
  AdminPaymentMethodMetricsOverview,
  AdminPaymentMethodSummary,
} from "@/features/admin/finance/payment-methods/models";

import { ADMIN_ROUTES } from "@/foundation/routing/admin-routes";

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

import {
  useAdminPaymentMethods,
  useAdminPaymentMethodMetrics,
} from "@/features/admin/finance/payment-methods/hooks";

// -----------------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------------

import { PaymentMethodPageContainer } from "@/components/admin/finance/payment-methods/layout/PaymentMethodPageContainer";
import { PaymentMethodPageToolbar } from "@/components/admin/finance/payment-methods/layout/PaymentMethodPageToolbar";
import { PaymentMethodControlCenterHeader } from "@/components/admin/finance/payment-methods/layout/PaymentMethodControlCenterHeader";

// -----------------------------------------------------------------------------
// Overview And Directory
// -----------------------------------------------------------------------------

import { PaymentMethodOverview } from "@/components/admin/finance/payment-methods/overview/PaymentMethodOverview";
import { PaymentMethodDirectory } from "@/components/admin/finance/payment-methods/directory";

// =============================================================================
// Overview Builder
// =============================================================================

function createPaymentMethodOverview(
  paymentMethods: readonly AdminPaymentMethod[],
  now: Date = new Date(),
): AdminPaymentMethodMetricsOverview {
  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;

  const providers = new Map<
    string,
    { total: number; active: number; inactive: number }
  >();

  const types = new Map<
    string,
    { total: number; active: number; inactive: number }
  >();

  const accounts = new Set<string>();

  let active = 0;
  let inactive = 0;
  let defaultMethods = 0;
  let createdThisPeriod = 0;
  let updatedThisPeriod = 0;

  for (const method of paymentMethods) {
    accounts.add(method.accountPublicId);

    if (method.isActive) {
      active += 1;
    } else {
      inactive += 1;
    }

    if (method.isDefault) {
      defaultMethods += 1;
    }

    if (method.createdAt.startsWith(currentMonth)) {
      createdThisPeriod += 1;
    }

    if (method.updatedAt.startsWith(currentMonth)) {
      updatedThisPeriod += 1;
    }

    const providerMetric = providers.get(method.provider) ?? {
      total: 0,
      active: 0,
      inactive: 0,
    };

    providerMetric.total += 1;

    if (method.isActive) {
      providerMetric.active += 1;
    } else {
      providerMetric.inactive += 1;
    }

    providers.set(method.provider, providerMetric);

    const typeMetric = types.get(method.type) ?? {
      total: 0,
      active: 0,
      inactive: 0,
    };

    typeMetric.total += 1;

    if (method.isActive) {
      typeMetric.active += 1;
    } else {
      typeMetric.inactive += 1;
    }

    types.set(method.type, typeMetric);
  }

  const activityDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    return date;
  });

  const activity = activityDays.map((date) => {
    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const created = paymentMethods.filter((method) => {
      const timestamp = new Date(method.createdAt);

      if (Number.isNaN(timestamp.getTime())) {
        return false;
      }

      const methodDate = [
        timestamp.getFullYear(),
        String(timestamp.getMonth() + 1).padStart(2, "0"),
        String(timestamp.getDate()).padStart(2, "0"),
      ].join("-");

      return methodDate === dateKey;
    }).length;

    return {
      date: dateKey,
      created,
    };
  });

  return {
    summary: {
      total: paymentMethods.length,
      active,
      inactive,
      defaultMethods,
      nonDefaultMethods: paymentMethods.length - defaultMethods,
      accountsWithPaymentMethods: accounts.size,
      providerCount: providers.size,
      createdThisPeriod,
      updatedThisPeriod,
      generatedAt: now.toISOString(),
    },

    byProvider: [...providers.entries()]
      .map(([provider, counts]) => ({
        provider,
        ...counts,
      }))
      .sort((a, b) => b.total - a.total),

    byType: [...types.entries()]
      .map(([type, counts]) => ({
        type,
        ...counts,
      }))
      .sort((a, b) => b.total - a.total),

    activity,
  };
}

// =============================================================================
// Page
// =============================================================================

export default function AdminPaymentMethodsPage() {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Payment Methods Collection
  // ---------------------------------------------------------------------------

  const {
    allPaymentMethods,
    query,
    isLoading,
    isError,
    refetch,
  } = useAdminPaymentMethods();

  // ---------------------------------------------------------------------------
  // Metrics Query State
  // ---------------------------------------------------------------------------

  const {
    isLoading: isMetricsLoading,
    isError: isMetricsError,
    error: metricsError,
    refetch: refetchMetrics,
  } = useAdminPaymentMethodMetrics();

  // ---------------------------------------------------------------------------
  // Payment Method Detail Navigation
  // ---------------------------------------------------------------------------

  const handleSelectPaymentMethod = useCallback(
    (paymentMethod: AdminPaymentMethodSummary) => {
      router.push(
        ADMIN_ROUTES.FINANCE_PAYMENT_METHOD(
          paymentMethod.publicId,
        ),
      );
    },
    [router],
  );

  // ---------------------------------------------------------------------------
  // Overview Data
  // ---------------------------------------------------------------------------

  const overview = useMemo(
    () => createPaymentMethodOverview(allPaymentMethods),
    [allPaymentMethods],
  );

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------

  const handleRefresh = useCallback(() => {
    void Promise.all([refetch(), refetchMetrics()]);
  }, [refetch, refetchMetrics]);

  // ---------------------------------------------------------------------------
  // Error Messages
  // ---------------------------------------------------------------------------

  const overviewError = isMetricsError
    ? metricsError instanceof Error
      ? metricsError.message
      : "Unable to load payment methods overview."
    : undefined;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <PaymentMethodPageContainer>
      <div className="space-y-6">
        {/* Control Center Header */}

        <PaymentMethodControlCenterHeader
          title="Payment methods"
          description="Review registered payment methods, monitor their status, and inspect payment-method coverage across the platform."
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
              {query.isFetching
                ? "Refreshing…"
                : "Refresh payment methods"}
            </button>
          }
        />

        {/* Directory Toolbar */}

        <PaymentMethodPageToolbar
          leadingContent={
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Payment methods directory
              </h2>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                Search payment methods, apply filters, and review registered
                records.
              </p>

              <p
                className="mt-2 text-sm text-[var(--foreground-muted)]"
                aria-live="polite"
              >
                {isLoading
                  ? "Loading payment methods…"
                  : isError
                    ? "Payment methods could not be loaded"
                    : `${allPaymentMethods.length.toLocaleString("en-KE")} payment methods loaded`}
              </p>
            </div>
          }
        />

        {/* Payment Methods Overview */}

        {isMetricsLoading ? (
          <section
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm text-[var(--foreground-muted)]">
              Loading payment methods overview…
            </p>
          </section>
        ) : isMetricsError ? (
          <section
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            role="status"
          >
            <p className="text-sm text-[var(--foreground-muted)]">
              Payment methods overview metrics are temporarily unavailable.
              The directory can still be used.
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="mt-3 text-sm font-medium text-[var(--foreground)] underline underline-offset-4"
            >
              Retry loading overview
            </button>
          </section>
        ) : isError ? (
          <section
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            role="status"
          >
            <p className="text-sm text-[var(--foreground-muted)]">
              The overview cannot be calculated until the payment-method
              collection is available.
            </p>
          </section>
        ) : (
          <PaymentMethodOverview
            overview={overview}
            isLoading={false}
            error={overviewError}
            onRetry={handleRefresh}
          />
        )}

        {/* Payment Methods Directory */}

        <PaymentMethodDirectory
          onSelectPaymentMethod={handleSelectPaymentMethod}
        />
      </div>
    </PaymentMethodPageContainer>
  );
}
