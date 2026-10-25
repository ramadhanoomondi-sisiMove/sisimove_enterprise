// src/app/admin/finance/holds/page.tsx

'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Account Holds Page
// -----------------------------------------------------------------------------
//
// Platform finance control center composing:
// - Account Holds header and toolbar
// - Platform-wide hold overview and financial exposure
// - Searchable, filterable, paginated account-hold directory
//
// Overview metrics are grouped by currency.
// Expired active holds are counted separately and excluded from active exposure.
// Detail navigation uses the canonical finance-holds route and public ID.
// -----------------------------------------------------------------------------

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import {
  AdminAccountHoldStatus,
  DEFAULT_ADMIN_ACCOUNT_HOLD_FILTERS,
} from '@/features/admin/finance/holds/models';

import type {
  AdminAccountHold,
  AdminAccountHoldFilters,
  AdminAccountHoldMetrics,
} from '@/features/admin/finance/holds/models';

import { useAdminAccountHolds } from '@/features/admin/finance/holds/hooks';

import {
  AccountHoldPageContainer,
  AccountHoldControlCenterHeader,
  AccountHoldPageToolbar,
} from '@/components/admin/finance/holds/layout';

import { AccountHoldOverview } from '@/components/admin/finance/holds/overview';
import { AccountHoldDirectory } from '@/components/admin/finance/holds/directory';

// -----------------------------------------------------------------------------
// Metrics
// -----------------------------------------------------------------------------

function buildHoldMetrics(
  holds: AdminAccountHold[],
): AdminAccountHoldMetrics[] {
  const byCurrency = new Map<string, AdminAccountHoldMetrics>();

  for (const hold of holds) {
    const currency = hold.currency.toUpperCase();

    let metrics = byCurrency.get(currency);

    if (!metrics) {
      metrics = {
        totalHolds: 0,
        activeHolds: 0,
        releasedHolds: 0,
        capturedHolds: 0,
        cancelledHolds: 0,
        expiredActiveHolds: 0,
        totalActiveHeldAmount: 0,
        totalReleasedAmount: 0,
        totalCapturedAmount: 0,
        totalCancelledAmount: 0,
        currency,
      };

      byCurrency.set(currency, metrics);
    }

    metrics.totalHolds += 1;

    switch (hold.status) {
      case AdminAccountHoldStatus.ACTIVE:
        metrics.activeHolds += 1;

        if (hold.isExpired) {
          metrics.expiredActiveHolds += 1;
        } else {
          metrics.totalActiveHeldAmount += hold.amount;
        }
        break;

      case AdminAccountHoldStatus.RELEASED:
        metrics.releasedHolds += 1;
        metrics.totalReleasedAmount += hold.amount;
        break;

      case AdminAccountHoldStatus.CAPTURED:
        metrics.capturedHolds += 1;
        metrics.totalCapturedAmount += hold.amount;
        break;

      case AdminAccountHoldStatus.CANCELLED:
        metrics.cancelledHolds += 1;
        metrics.totalCancelledAmount += hold.amount;
        break;
    }
  }

  return [...byCurrency.values()].sort((a, b) =>
    a.currency.localeCompare(b.currency),
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function AccountHoldsPage() {
  const router = useRouter();

  const [filters, setFilters] = useState<AdminAccountHoldFilters>(
    () => ({ ...DEFAULT_ADMIN_ACCOUNT_HOLD_FILTERS }),
  );

  const {
    holds,
    allHolds,
    totalFiltered,
    query,
    isLoading,
    isError,
    refetch,
  } = useAdminAccountHolds(filters);

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const metrics = useMemo(
    () => buildHoldMetrics(allHolds),
    [allHolds],
  );

  const currencyOptions = useMemo(
    () =>
      [...new Set(
        allHolds.map((hold) => hold.currency.toUpperCase()),
      )].sort(),
    [allHolds],
  );

  // ---------------------------------------------------------------------------
  // Navigation and actions
  // ---------------------------------------------------------------------------

  const handleOpenHold = useCallback(
    (hold: AdminAccountHold) => {
      router.push(ADMIN_ROUTES.FINANCE_HOLD(hold.publicId));
    },
    [router],
  );

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleFiltersChange = useCallback(
    (changes: Partial<AdminAccountHoldFilters>) => {
      setFilters((current) => ({
        ...current,
        ...changes,
      }));
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_ADMIN_ACCOUNT_HOLD_FILTERS });
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <AccountHoldPageContainer>
      <div className="space-y-6">
        <AccountHoldControlCenterHeader
          title="Account Holds"
          description="Monitor held funds, review hold status, and inspect financial exposure across the platform."
        />

        <AccountHoldPageToolbar
          leading={
            <p
              className="text-sm text-[var(--foreground-secondary)]"
              aria-live="polite"
            >
              {isLoading
                ? 'Loading account holds…'
                : isError
                  ? 'Account holds could not be loaded'
                  : `${allHolds.length.toLocaleString('en-KE')} hold${
                      allHolds.length === 1 ? '' : 's'
                    } loaded`}
            </p>
          }
          trailing={
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading || query.isFetching}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-muted)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {query.isFetching ? 'Refreshing…' : 'Refresh holds'}
            </button>
          }
        />

        <AccountHoldOverview
          metrics={metrics}
          isLoading={isLoading}
          error={isError}
          onRetry={handleRefresh}
        />

        <AccountHoldDirectory
          holds={holds}
          filters={filters}
          totalItems={totalFiltered}
          onFiltersChange={handleFiltersChange}
          onResetFilters={handleResetFilters}
          onViewHold={handleOpenHold}
          currencies={currencyOptions}
          isLoading={isLoading}
          error={isError}
          onRetry={handleRefresh}
        />
      </div>
    </AccountHoldPageContainer>
  );
}
