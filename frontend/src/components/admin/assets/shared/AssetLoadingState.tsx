
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Loading State
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Display consistent loading feedback for asset pages and collections.
 * - Provide skeleton placeholders to minimize layout shifts.
 * - Support compact spinner-based loading for smaller sections.
 * - Reuse the existing sisiMove design-system primitives.
 *
 * -----------------------------------------------------------------------------
 */

import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

import { cn } from '@/foundation/utils/cn';

// =============================================================================
// Types
// =============================================================================

export type AssetLoadingVariant =
  | 'page'
  | 'grid'
  | 'detail'
  | 'inline';

export interface AssetLoadingStateProps {
  readonly variant?: AssetLoadingVariant;
  readonly count?: number;
  readonly label?: string;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function AssetLoadingState({
  variant = 'grid',
  count = 6,
  label = 'Loading assets',
  className,
}: AssetLoadingStateProps) {
  if (variant === 'inline') {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'flex items-center justify-center gap-3 py-4',
          className,
        )}
      >
        <Spinner size="sm" label={label} />
        <span className="text-sm text-[var(--foreground-muted)]">
          {label}
        </span>
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <section
        role="status"
        aria-label={label}
        aria-busy="true"
        className={cn('space-y-6', className)}
      >
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-4 h-8 w-20" />
              <Skeleton className="mt-3 h-3 w-32" />
            </div>
          ))}
        </div>

        <AssetGridSkeleton count={count} />
      </section>
    );
  }

  if (variant === 'detail') {
    return (
      <section
        role="status"
        aria-label={label}
        aria-busy="true"
        className={cn('space-y-6', className)}
      >
        <Skeleton className="h-8 w-64 max-w-full" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)]">
          <div className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--border)] p-5">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <div className="space-y-5 rounded-[var(--radius-xl)] border border-[var(--border)] p-5">
            <Skeleton className="h-5 w-36" />

            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <AssetGridSkeleton count={count} className={className} />;
}

// =============================================================================
// Grid Skeleton
// =============================================================================

interface AssetGridSkeletonProps {
  readonly count: number;
  readonly className?: string;
}

function AssetGridSkeleton({
  count,
  className,
}: AssetGridSkeletonProps) {
  const safeCount = Math.max(1, Math.min(Math.floor(count), 24));

  return (
    <div
      role="status"
      aria-label="Loading asset collection"
      aria-busy="true"
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {Array.from({ length: safeCount }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]"
        >
          <Skeleton
            radius="none"
            className="aspect-[4/3] w-full"
          />

          <div className="space-y-3 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 shrink-0" radius="lg" />

              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-5 w-20" radius="full" />
              <Skeleton className="h-5 w-16" radius="full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AssetLoadingState;
