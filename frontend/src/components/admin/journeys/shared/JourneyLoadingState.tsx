
import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

export interface JourneyLoadingStateProps {
  title?: string;
  description?: string;
  variant?: 'spinner' | 'skeleton';
  rows?: number;
  icon?: ReactNode;
  className?: string;
}

export function JourneyLoadingState({
  title = 'Loading journeys',
  description = 'Retrieving the latest journey information…',
  variant = 'skeleton',
  rows = 4,
  className,
}: JourneyLoadingStateProps) {
  const safeRows = Math.max(1, Math.min(8, Math.floor(rows)));

  if (variant === 'spinner') {
    return (
      <div
        role="status"
        aria-live="polite"
        className={[
          'flex',
          'min-h-56',
          'w-full',
          'flex-col',
          'items-center',
          'justify-center',
          'gap-3',
          'px-6',
          'py-12',
          'text-center',
          className ?? '',
        ].join(' ')}
      >
        <Spinner size="lg" label={title} />

        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {title}
          </p>

          {description && (
            <p className="max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label={title}
      aria-busy="true"
      className={[
        'w-full',
        'space-y-5',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <Spinner size="md" label={title} />

        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {title}
          </p>

          {description && (
            <p className="text-sm text-[var(--foreground-muted)]">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: safeRows }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface)] p-4"
          >
            <Skeleton
              radius="lg"
              className="h-11 w-11 shrink-0"
              aria-label="Loading journey icon"
            />

            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton
                radius="sm"
                className="h-4 w-2/5 max-w-48"
                aria-label="Loading journey title"
              />

              <Skeleton
                radius="sm"
                className="h-3 w-3/4 max-w-72"
                aria-label="Loading journey details"
              />
            </div>

            <Skeleton
              radius="full"
              className="hidden h-6 w-20 shrink-0 sm:block"
              aria-label="Loading journey status"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default JourneyLoadingState;
