// src/components/admin/finance/account-holds/overview/AccountHoldOverview.tsx

import {
  Activity,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

import type { AdminAccountHoldMetrics } from '@/features/admin/finance/holds/models';
import { cn } from '@/foundation/utils/cn';

import { AccountHoldErrorState } from '../shared/AccountHoldErrorState';
import { AccountHoldLoadingState } from '../shared/AccountHoldLoadingState';
import { AccountHoldMetricCard } from './AccountHoldMetricCard';
import { AccountHoldStatusSummary } from './AccountHoldStatusSummary';
import { AccountHoldExposureSummary } from './AccountHoldExposureSummary';

export interface AccountHoldOverviewProps {
  metrics: AdminAccountHoldMetrics[];
  isLoading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  className?: string;
}

function formatCount(value: number): string {
  return Math.max(value, 0).toLocaleString('en-KE');
}

export function AccountHoldOverview({
  metrics,
  isLoading = false,
  error = false,
  onRetry,
  className,
}: AccountHoldOverviewProps) {
  if (isLoading) {
    return <AccountHoldLoadingState showHeader rows={5} />;
  }

  if (error) {
    return (
      <AccountHoldErrorState
        title="Unable to load hold overview"
        description="The account hold summary could not be retrieved. Try again."
        onRetry={onRetry}
      />
    );
  }

  if (metrics.length === 0) {
    return (
      <div
        className={cn(
          'rounded-[var(--radius-xl)] border border-[var(--border)]',
          'bg-[var(--surface)] p-8 text-center',
          className,
        )}
      >
        <ShieldCheck
          aria-hidden="true"
          className="mx-auto size-10 text-[var(--foreground-subtle)]"
        />
        <h2 className="mt-3 text-base font-semibold text-[var(--foreground)]">
          No account hold metrics yet
        </h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-[var(--foreground-muted)]">
          Overview metrics will appear here when account hold data becomes
          available.
        </p>
      </div>
    );
  }

  const totals = metrics.reduce(
    (result, item) => ({
      totalHolds: result.totalHolds + item.totalHolds,
      activeHolds: result.activeHolds + item.activeHolds,
      releasedHolds: result.releasedHolds + item.releasedHolds,
      capturedHolds: result.capturedHolds + item.capturedHolds,
      cancelledHolds: result.cancelledHolds + item.cancelledHolds,
      expiredActiveHolds:
        result.expiredActiveHolds + item.expiredActiveHolds,
    }),
    {
      totalHolds: 0,
      activeHolds: 0,
      releasedHolds: 0,
      capturedHolds: 0,
      cancelledHolds: 0,
      expiredActiveHolds: 0,
    },
  );

  const singleCurrency = metrics.length === 1 ? metrics[0] : undefined;

  return (
    <div className={cn('space-y-6', className)}>
      <section aria-label="Account hold key metrics">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            At a glance
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Current account hold activity across recorded currencies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AccountHoldMetricCard
            label="Total holds"
            value={formatCount(totals.totalHolds)}
            description="All recorded holds"
            icon={Activity}
            tone="default"
          />

          <AccountHoldMetricCard
            label="Active holds"
            value={formatCount(totals.activeHolds)}
            description="Currently active"
            icon={ShieldCheck}
            tone="warning"
          />

          <AccountHoldMetricCard
            label="Released holds"
            value={formatCount(totals.releasedHolds)}
            description="Successfully released"
            icon={CheckCircle2}
            tone="success"
          />

          <AccountHoldMetricCard
            label="Expired active holds"
            value={formatCount(totals.expiredActiveHolds)}
            description="Require review"
            icon={ShieldAlert}
            tone={totals.expiredActiveHolds > 0 ? 'danger' : 'default'}
          />
        </div>
      </section>

      {singleCurrency && (
        <section aria-label="Account hold financial metrics">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Financial summary
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Amounts displayed in {singleCurrency.currency}.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AccountHoldMetricCard
              label="Currently held"
              value={new Intl.NumberFormat('en-KE', {
                style: 'currency',
                currency: singleCurrency.currency,
              }).format(singleCurrency.totalActiveHeldAmount)}
              description="Current active exposure"
              icon={Wallet}
              tone="warning"
            />

            <AccountHoldMetricCard
              label="Captured amount"
              value={new Intl.NumberFormat('en-KE', {
                style: 'currency',
                currency: singleCurrency.currency,
              }).format(singleCurrency.totalCapturedAmount)}
              description="Total captured"
              icon={CheckCircle2}
              tone="brand"
            />
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        {metrics.map((item) => (
          <div key={item.currency} className="min-w-0">
            <AccountHoldStatusSummary metrics={item} />
          </div>
        ))}

        <AccountHoldExposureSummary metrics={metrics} />
      </div>
    </div>
  );
}