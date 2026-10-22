'use client';

import { useMemo } from 'react';

import {
  TrustErrorState,
  TrustLoadingState,
} from '@/components/admin/trust';

import {
  TrustProfileFilters,
  type TrustProfileFiltersValue,
} from '../profiles/TrustProfileFilters';

import { TrustMetricCard } from './TrustMetricCard';
import {
  TrustProfileSnapshot,
  type TrustProfileSnapshotItem,
} from './TrustProfileSnapshot';
import { TrustActivityFeed } from './TrustActivityFeed';
import { TrustOverviewEmptyState } from './TrustOverviewEmptyState';

import type { TrustEventApiResponse } from '@/features/admin/trust/types/trust.types';

export interface TrustOverviewMetrics {
  totalProfiles: number;
  activeProfiles: number;
  verifiedProfiles: number;
  totalTrustEvents: number;
}

export interface TrustOverviewDashboardProps {
  metrics?: TrustOverviewMetrics | null;
  profiles?: TrustProfileSnapshotItem[];
  events?: TrustEventApiResponse[];

  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;

  onSelectProfile?: (publicId: string) => void;
  onSelectEvent?: (event: TrustEventApiResponse) => void;

  profileFilters?: TrustProfileFiltersValue;
  onProfileFiltersChange?: (filters: TrustProfileFiltersValue) => void;
  onResetProfileFilters?: () => void;

  className?: string;
}

function formatCount(value: number): string {
  return Number.isFinite(value)
    ? new Intl.NumberFormat().format(value)
    : '—';
}

export function TrustOverviewDashboard({
  metrics = null,
  profiles = [],
  events = [],
  isLoading = false,
  error = null,
  onRetry,
  onSelectProfile,
  onSelectEvent,
  profileFilters,
  onProfileFiltersChange,
  onResetProfileFilters,
  className,
}: TrustOverviewDashboardProps) {
  const hasData =
    metrics !== null || profiles.length > 0 || events.length > 0;

  const canFilterProfiles =
    profileFilters !== undefined &&
    onProfileFiltersChange !== undefined &&
    onResetProfileFilters !== undefined;

  const metricCards = useMemo(() => {
    if (!metrics) return [];

    return [
      {
        key: 'profiles',
        label: 'Trust profiles',
        value: formatCount(metrics.totalProfiles),
        description: 'Total profiles reported by the data source',
      },
      {
        key: 'active',
        label: 'Active profiles',
        value: formatCount(metrics.activeProfiles),
        description: 'Active profiles in the loaded page',
      },
      {
        key: 'verified',
        label: 'Verified profiles',
        value: formatCount(metrics.verifiedProfiles),
        description: 'Verified profiles in the loaded page',
      },
      {
        key: 'events',
        label: 'Trust events',
        value: formatCount(metrics.totalTrustEvents),
        description: 'Event total is not yet connected to an aggregate query',
      },
    ];
  }, [metrics]);

  if (isLoading && !hasData) {
    return (
      <section
        className={className}
        aria-label="Trust overview dashboard loading"
        aria-busy="true"
      >
        <TrustLoadingState rows={5} />
      </section>
    );
  }

  if (error && !hasData) {
    return (
      <section
        className={className}
        aria-label="Trust overview dashboard error"
      >
        <TrustErrorState
          title="Unable to load the trust overview"
          description={error}
          retryAction={
            onRetry
              ? { label: 'Try again', onClick: onRetry }
              : undefined
          }
        />
      </section>
    );
  }

  if (!hasData) {
    return (
      <TrustOverviewEmptyState
        className={className}
        title="No trust overview data available"
        description="Connect the existing trust-profile and trust-event queries to display metrics, profiles, and recent activity here."
      />
    );
  }

  return (
    <section
      className={['space-y-8', className].filter(Boolean).join(' ')}
      aria-label="Trust overview dashboard"
    >
      {error && (
        <TrustErrorState
          title="Some overview data could not be refreshed"
          description={error}
          retryAction={
            onRetry
              ? { label: 'Try again', onClick: onRetry }
              : undefined
          }
        />
      )}

      {isLoading && (
        <p
          className="text-sm text-[var(--foreground-muted)]"
          role="status"
          aria-live="polite"
        >
          Refreshing trust overview…
        </p>
      )}

      {metricCards.length > 0 && (
        <section aria-label="Trust metrics">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Trust at a glance
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Summary metrics supplied by the trust data source.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((metric) => (
              <TrustMetricCard
                key={metric.key}
                label={metric.label}
                value={metric.value}
                description={metric.description}
              />
            ))}
          </div>
        </section>
      )}

      {canFilterProfiles && (
        <TrustProfileFilters
          value={profileFilters}
          onChange={onProfileFiltersChange}
          onReset={onResetProfileFilters}
          disabled={isLoading}
        />
      )}

      {profiles.length > 0 ? (
        <TrustProfileSnapshot
          profiles={profiles}
          onSelectProfile={onSelectProfile}
        />
      ) : (
        <section
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center"
          aria-live="polite"
          aria-label="Trust profile results"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-subtle)] text-[var(--foreground-muted)]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-6 w-6"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </div>

          <h3 className="mt-4 text-base font-semibold text-[var(--foreground)]">
            No matching trust profiles
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--foreground-secondary)]">
            No profiles match your current search and filters. Try changing
            your search or clearing the filters to see profiles again.
          </p>

          {canFilterProfiles && (
            <button
              type="button"
              onClick={onResetProfileFilters}
              disabled={isLoading}
              className="mt-4 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear filters
            </button>
          )}
        </section>
      )}

      {events.length > 0 && (
        <TrustActivityFeed
          events={events}
          onSelectEvent={onSelectEvent}
        />
      )}
    </section>
  );
}

export default TrustOverviewDashboard;
