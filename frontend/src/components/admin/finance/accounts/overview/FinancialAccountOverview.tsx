'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Platform Financial Account Overview
// -----------------------------------------------------------------------------
//
// Platform-wide overview of the supplied financial account collection.
// - Summarizes account counts and statuses.
// - Summarizes account types.
// - Aggregates balances independently for each currency.
// - Does not fetch data or claim totals beyond the supplied collection.
// -----------------------------------------------------------------------------

import { useMemo } from 'react';

import {
  Activity,
  CheckCircle2,
  Clock3,
  Layers3,
  WalletCards,
  XCircle,
} from 'lucide-react';

import type { AdminFinancialAccount } from '@/features/admin/finance/accounts/models';

import { formatFinancialDateTime } from '@/features/admin/finance/accounts/utils';

import { FinancialAccountSectionHeader } from '../layout';

import { FinancialAccountMetricCard } from './FinancialAccountMetricCard';
import { FinancialAccountBalanceSummary } from './FinancialAccountBalanceSummary';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface CurrencyBalance {
  currency: string;
  accountCount: number;
  availableAmount: number;
  pendingAmount: number;
  heldAmount: number;
  totalAmount: number;
}

export interface FinancialAccountOverviewProps {
  accounts: AdminFinancialAccount[];
  isLoading?: boolean;
  isError?: boolean;
  collectionIsComplete?: boolean;
  formatAmount: (minorUnits: number, currency: string) => string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeValue(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-KE', {
    maximumFractionDigits: 0,
  }).format(value);
}

function getLatestUpdatedAt(
  accounts: AdminFinancialAccount[],
): string | null {
  let latest: Date | null = null;

  for (const account of accounts) {
    const date = new Date(account.updatedAt);

    if (
      !Number.isNaN(date.getTime()) &&
      (latest === null || date.getTime() > latest.getTime())
    ) {
      latest = date;
    }
  }

  return latest?.toISOString() ?? null;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function FinancialAccountOverview({
  accounts,
  isLoading = false,
  isError = false,
  collectionIsComplete = true,
  formatAmount,
  className,
}: FinancialAccountOverviewProps) {
  const summary = useMemo(() => {
    const statusCounts = new Map<string, number>();
    const typeCounts = new Map<string, number>();
    const balances = new Map<string, CurrencyBalance>();

    for (const account of accounts) {
      const status = normalizeValue(account.status) || 'unknown';
      const type = normalizeValue(account.type) || 'unknown';

      statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
      typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);

      // The balance response is authoritative for its currency.
      const balance = account.balance;
      const currency = String(balance.currency || account.currency)
        .trim()
        .toUpperCase();

      if (!currency) {
        continue;
      }

      let aggregate = balances.get(currency);

      if (!aggregate) {
        aggregate = {
          currency,
          accountCount: 0,
          availableAmount: 0,
          pendingAmount: 0,
          heldAmount: 0,
          totalAmount: 0,
        };

        balances.set(currency, aggregate);
      }

      aggregate.accountCount += 1;
      aggregate.availableAmount += balance.availableAmount;
      aggregate.pendingAmount += balance.pendingAmount;
      aggregate.heldAmount += balance.heldAmount;
      aggregate.totalAmount += balance.totalAmount;
    }

    const activeCount =
      statusCounts.get('active') ?? 0;

    const suspendedCount =
      statusCounts.get('suspended') ?? 0;

    const closedCount =
      statusCounts.get('closed') ?? 0;

    const latestUpdatedAt = getLatestUpdatedAt(accounts);

    return {
      statusCounts,
      typeCounts,
      balances: Array.from(balances.values()).sort((a, b) =>
        a.currency.localeCompare(b.currency),
      ),
      activeCount,
      suspendedCount,
      closedCount,
      latestUpdatedAt,
    };
  }, [accounts]);

  const accountCount = accounts.length;

  const hasData = accountCount > 0;

  const statusDescription = isError
    ? 'Account status could not be fully verified.'
    : collectionIsComplete
      ? 'Across the supplied account collection.'
      : 'Based on the accounts currently returned.';

  if (isLoading && !hasData) {
    return (
      <section
        aria-label="Platform financial overview"
        aria-busy="true"
        className={className}
      >
        <div className="rounded-xl border border-[var(--border)] p-6">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Loading platform financial overview…
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Platform financial overview"
      className={className}
    >
      <div className="space-y-6">
        <FinancialAccountSectionHeader
          title="Platform Financial Overview"
          description="Account health and consolidated balances across the supplied platform account collection."
        />

        {isError && (
          <div
            role="alert"
            className="rounded-lg border border-[var(--danger)]/30 bg-[var(--background-muted)] p-3 text-sm text-[var(--foreground-secondary)]"
          >
            Account data could not be refreshed successfully. Displayed figures
            may reflect previously loaded data.
          </div>
        )}

        {!collectionIsComplete && !isError && (
          <div
            role="status"
            className="rounded-lg border border-[var(--border)] bg-[var(--background-muted)] p-3 text-sm text-[var(--foreground-secondary)]"
          >
            These figures summarize the accounts currently supplied by the API.
            They may not represent the entire platform if the collection is
            paginated or incomplete.
          </div>
        )}

        {/* Platform metrics */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FinancialAccountMetricCard
            label="Total accounts"
            value={formatCount(accountCount)}
            description="Accounts in the supplied collection."
            icon={<WalletCards size={18} aria-hidden="true" />}
          />

          <FinancialAccountMetricCard
            label="Active accounts"
            value={formatCount(summary.activeCount)}
            description={statusDescription}
            icon={<CheckCircle2 size={18} aria-hidden="true" />}
          />

          <FinancialAccountMetricCard
            label="Suspended accounts"
            value={formatCount(summary.suspendedCount)}
            description="Accounts currently marked suspended."
            icon={<XCircle size={18} aria-hidden="true" />}
          />

          <FinancialAccountMetricCard
            label="Closed accounts"
            value={formatCount(summary.closedCount)}
            description="Accounts currently marked closed."
            icon={<Activity size={18} aria-hidden="true" />}
          />
        </div>

        {/* Account types */}

        <div className="rounded-xl border border-[var(--border)] p-5">
          <FinancialAccountSectionHeader
            title="Account types"
            description="Distribution of the supplied accounts by type."
          />

          {summary.typeCounts.size === 0 ? (
            <p className="mt-4 text-sm text-[var(--foreground-muted)]">
              No account types are available.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from(summary.typeCounts.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([type, count]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between gap-3 rounded-lg bg-[var(--background-muted)] p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Layers3
                        size={18}
                        className="shrink-0 text-[var(--foreground-secondary)]"
                        aria-hidden="true"
                      />

                      <span className="break-words text-sm font-medium capitalize text-[var(--foreground)]">
                        {type.replace(/[-_]/g, ' ')}
                      </span>
                    </div>

                    <span className="text-lg font-semibold tabular-nums text-[var(--foreground)]">
                      {formatCount(count)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Balances grouped by currency */}

        <div className="space-y-4">
          <FinancialAccountSectionHeader
            title="Platform balances"
            description="Available, pending, held, and total balances are aggregated separately for each currency."
          />

          {!hasData ? (
            <div className="rounded-xl border border-[var(--border)] p-6 text-sm text-[var(--foreground-muted)]">
              No financial accounts are available to summarize.
            </div>
          ) : summary.balances.length === 0 ? (
            <div className="rounded-xl border border-[var(--border)] p-6 text-sm text-[var(--foreground-muted)]">
              No currency balance data is available.
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {summary.balances.map((balance) => (
                <FinancialAccountBalanceSummary
                  key={balance.currency}
                  currency={balance.currency}
                  accountCount={balance.accountCount}
                  availableAmount={formatAmount(
                    balance.availableAmount,
                    balance.currency,
                  )}
                  pendingAmount={formatAmount(
                    balance.pendingAmount,
                    balance.currency,
                  )}
                  heldAmount={formatAmount(
                    balance.heldAmount,
                    balance.currency,
                  )}
                  totalAmount={formatAmount(
                    balance.totalAmount,
                    balance.currency,
                  )}
                  description={`Combined balance for ${balance.accountCount} account${balance.accountCount === 1 ? '' : 's'} in ${balance.currency}.`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Data freshness */}

        <div className="flex flex-col gap-2 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock3
              size={17}
              className="text-[var(--foreground-secondary)]"
              aria-hidden="true"
            />

            <span className="text-sm font-medium text-[var(--foreground)]">
              Latest account update
            </span>
          </div>

          <span className="text-sm text-[var(--foreground-secondary)]">
            {summary.latestUpdatedAt
              ? formatFinancialDateTime(summary.latestUpdatedAt)
              : 'No update timestamp available'}
          </span>
        </div>

        {!collectionIsComplete && (
          <p className="text-xs text-[var(--foreground-muted)]">
            {summary.statusCounts.size > 0
              ? 'Status counts include all statuses returned in the supplied collection; the cards above highlight active, suspended, and closed accounts.'
              : 'Account status information is unavailable.'}
          </p>
        )}
      </div>
    </section>
  );
}

export default FinancialAccountOverview;
