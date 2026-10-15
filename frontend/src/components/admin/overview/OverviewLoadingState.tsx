
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Admin Overview Loading State
 * -----------------------------------------------------------------------------
 *
 * Loading presentation for the Admin Overview dashboard.
 *
 * Responsibilities:
 *
 * - communicate that overview metrics are loading;
 * - preserve dashboard layout while requests are in progress;
 * - reduce layout shifts by rendering metric and panel placeholders;
 * - reuse the shared sisiMove Skeleton and Spinner primitives.
 *
 * Architectural boundaries:
 *
 * - This component does not fetch data.
 * - This component does not manage query state.
 * - The parent component decides when to render this loading state.
 *
 * -----------------------------------------------------------------------------
 */

import { Skeleton, Spinner } from '@/components/ui';


// =============================================================================
// Types
// =============================================================================

export interface OverviewLoadingStateProps {
  /**
   * Optional heading displayed above the loading dashboard.
   */
  title?: string;

  /**
   * Number of metric cards to render as placeholders.
   */
  metricCount?: number;

  /**
   * Whether to show the operations-panel placeholder.
   */
  showOperations?: boolean;

  /**
   * Optional additional CSS classes.
   */
  className?: string;
}


// =============================================================================
// Metric Card Skeleton
// =============================================================================

function OverviewMetricSkeleton() {
  return (
    <div
      className={[
        'rounded-[var(--radius-xl)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-5',
        'shadow-[var(--shadow-sm)]',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <Skeleton className="h-4 w-28" />

        <Skeleton
          radius="lg"
          className="h-10 w-10"
        />
      </div>

      <Skeleton className="mt-5 h-8 w-24" />

      <Skeleton className="mt-3 h-3 w-36" />
    </div>
  );
}


// =============================================================================
// Operations Panel Skeleton
// =============================================================================

function OverviewOperationsSkeleton() {
  return (
    <section
      aria-label="Loading platform operations"
      className={[
        'rounded-[var(--radius-xl)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-5',
        'shadow-[var(--shadow-sm)]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="mt-5 divide-y divide-[var(--border-subtle)]">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 py-4"
          >
            <Skeleton
              radius="lg"
              className="h-10 w-10 shrink-0"
            />

            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-36 max-w-full" />
              <Skeleton className="h-3 w-48 max-w-full" />
            </div>

            <Skeleton
              radius="full"
              className="h-6 w-8 shrink-0"
            />
          </div>
        ))}
      </div>
    </section>
  );
}


// =============================================================================
// Admin Overview Loading State
// =============================================================================

export default function OverviewLoadingState({
  title = 'Loading platform overview',
  metricCount = 8,
  showOperations = true,
  className,
}: OverviewLoadingStateProps) {
  const safeMetricCount = Math.max(
    0,
    Math.floor(metricCount),
  );

  return (
    <section
      aria-label="Admin overview loading state"
      aria-busy="true"
      className={[
        'w-full',
        'space-y-8',
        className ?? '',
      ].join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Loading Header                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {title}
          </h1>

          <p className="text-sm text-[var(--foreground-muted)]">
            Preparing your latest platform metrics and operational summary.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground-secondary)]">
          <Spinner
            size="sm"
            label="Loading overview metrics"
          />

          <span>Loading data</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Metric Grid                                                         */}
      {/* ------------------------------------------------------------------- */}

      <div
        aria-label="Loading overview metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {Array.from(
          { length: safeMetricCount },
          (_, index) => (
            <OverviewMetricSkeleton key={index} />
          ),
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Operations Panel                                                    */}
      {/* ------------------------------------------------------------------- */}

      {showOperations && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <OverviewOperationsSkeleton />

          <section
            aria-label="Loading quick actions"
            className={[
              'rounded-[var(--radius-xl)]',
              'border',
              'border-[var(--border)]',
              'bg-[var(--surface)]',
              'p-5',
              'shadow-[var(--shadow-sm)]',
            ].join(' ')}
          >
            <Skeleton className="h-5 w-36" />

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-4"
                >
                  <Skeleton
                    radius="lg"
                    className="h-9 w-9"
                  />

                  <Skeleton className="mt-4 h-4 w-28 max-w-full" />

                  <Skeleton className="mt-2 h-3 w-full" />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <span className="sr-only" role="status">
        The admin overview is loading.
      </span>
    </section>
  );
}
