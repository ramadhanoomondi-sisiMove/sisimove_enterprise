
/**
 * sisiMove — Trust Loading State
 *
 * Reusable loading presentation for Trust administration components.
 *
 * Responsibilities:
 * - Present accessible loading feedback.
 * - Support compact spinner and content-skeleton variants.
 * - Minimize layout shifts with configurable skeleton dimensions.
 * - Reuse the existing sisiMove Skeleton and Spinner components.
 *
 * Non-responsibilities:
 * - Fetching data.
 * - Managing React Query state.
 * - Handling errors or empty results.
 */

import type { HTMLAttributes } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TrustLoadingVariant =
  | 'spinner'
  | 'skeleton';

export interface TrustLoadingStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Loading presentation style.
   */
  variant?: TrustLoadingVariant;

  /**
   * Accessible loading description.
   */
  label?: string;

  /**
   * Number of skeleton rows to render.
   */
  rows?: number;

  /**
   * Show a heading placeholder in skeleton mode.
   */
  showHeading?: boolean;

  /**
   * Show a short description placeholder in skeleton mode.
   */
  showDescription?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustLoadingState({
  variant = 'spinner',
  label = 'Loading Trust data',
  rows = 3,
  showHeading = true,
  showDescription = true,
  className,
  ...props
}: TrustLoadingStateProps) {
  const safeRows = Number.isFinite(rows)
    ? Math.min(12, Math.max(1, Math.floor(rows)))
    : 3;

  if (variant === 'skeleton') {
    return (
      <div
        {...props}
        role="status"
        aria-label={label}
        aria-busy="true"
        className={className}
      >
        <span className="sr-only">{label}</span>

        <div
          aria-hidden="true"
          className="space-y-4"
        >
          {(showHeading || showDescription) && (
            <div className="space-y-2">
              {showHeading && (
                <Skeleton className="h-6 w-48 max-w-full" />
              )}

              {showDescription && (
                <Skeleton className="h-4 w-72 max-w-full" />
              )}
            </div>
          )}

          <div className="space-y-3">
            {Array.from(
              { length: safeRows },
              (_, index) => (
                <div
                  key={index}
                  className={[
                    'flex items-center gap-3',
                    'rounded-[var(--radius-lg)]',
                    'border border-[var(--border-subtle)]',
                    'p-3',
                  ].join(' ')}
                >
                  <Skeleton
                    radius="full"
                    className="h-10 w-10 shrink-0"
                  />

                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/5 max-w-full" />
                    <Skeleton className="h-3 w-3/5 max-w-full" />
                  </div>

                  <Skeleton
                    radius="full"
                    className="h-6 w-16 shrink-0"
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...props}
      role="status"
      aria-label={label}
      aria-busy="true"
      className={[
        'flex min-h-24 flex-col items-center justify-center gap-3',
        'p-6 text-center',
        className ?? '',
      ].join(' ')}
    >
      <Spinner size="lg" aria-hidden="true" />

      <span className="text-sm text-[var(--foreground-secondary)]">
        {label}
      </span>
    </div>
  );
}
