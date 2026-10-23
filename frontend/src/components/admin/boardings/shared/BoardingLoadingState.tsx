// src/features/admin/boardings/shared/BoardingLoadingState.tsx

import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

export interface BoardingLoadingStateProps {
  variant?: 'spinner' | 'skeleton';
  rows?: number;
  showLabel?: boolean;
  className?: string;
}

export function BoardingLoadingState({
  variant = 'skeleton',
  rows = 4,
  showLabel = true,
  className,
}: BoardingLoadingStateProps) {
  const safeRows = Math.max(1, Math.min(10, Math.floor(rows)));

  if (variant === 'spinner') {
    return (
      <div
        role="status"
        aria-label="Loading boarding records"
        className={[
          'flex',
          'min-h-40',
          'w-full',
          'flex-col',
          'items-center',
          'justify-center',
          'gap-3',
          className ?? '',
        ].join(' ')}
      >
        <Spinner size="lg" label="Loading boarding records" />

        {showLabel && (
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading boarding records…
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="Loading boarding records"
      aria-busy="true"
      className={[
        'w-full',
        'space-y-4',
        className ?? '',
      ].join(' ')}
    >
      {showLabel && (
        <span className="sr-only">Loading boarding records…</span>
      )}

      {Array.from({ length: safeRows }, (_, index) => (
        <div
          key={index}
          className={[
            'rounded-[var(--radius-xl)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'p-4',
            'sm:p-5',
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-4 w-36 max-w-full" />
              <Skeleton className="h-3 w-52 max-w-full" />

              <div className="flex flex-wrap gap-2 pt-1">
                <Skeleton className="h-6 w-20" radius="full" />
                <Skeleton className="h-6 w-24" radius="full" />
              </div>
            </div>

            <Skeleton className="h-8 w-8 shrink-0" radius="md" />
          </div>
        </div>
      ))}
    </div>
  );
}
