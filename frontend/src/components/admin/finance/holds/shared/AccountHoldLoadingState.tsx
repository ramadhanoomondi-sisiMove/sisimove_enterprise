
import { cn } from '@/foundation/utils/cn';

export interface AccountHoldLoadingStateProps {
  rows?: number;
  showHeader?: boolean;
  className?: string;
}

export function AccountHoldLoadingState({
  rows = 4,
  showHeader = true,
  className,
}: AccountHoldLoadingStateProps) {
  const rowCount = Math.max(1, Math.min(12, Math.floor(rows)));

  return (
    <div
      role="status"
      aria-label="Loading account holds"
      aria-busy="true"
      className={cn('w-full space-y-4', className)}
    >
      {showHeader && (
        <div className="space-y-2">
          <div className="h-5 w-48 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
        </div>
      )}

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        {Array.from({ length: rowCount }, (_, index) => (
          <div
            key={index}
            className={cn(
              'grid grid-cols-2 gap-4 p-4 sm:grid-cols-4',
              index > 0 && 'border-t border-[var(--border-subtle)]',
            )}
          >
            <div className="h-4 w-28 max-w-full animate-pulse rounded bg-[var(--background-muted)]" />
            <div className="h-4 w-24 max-w-full animate-pulse rounded bg-[var(--background-muted)]" />
            <div className="h-6 w-20 max-w-full animate-pulse rounded-full bg-[var(--background-muted)]" />
            <div className="h-4 w-24 max-w-full animate-pulse rounded bg-[var(--background-muted)]" />
          </div>
        ))}
      </div>

      <span className="sr-only">
        Please wait while account holds load.
      </span>
    </div>
  );
}
