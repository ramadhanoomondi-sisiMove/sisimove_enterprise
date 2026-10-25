
import { cn } from '@/foundation/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';

export interface TransactionLoadingStateProps {
  rows?: number;
  showHeader?: boolean;
  className?: string;
}

export function TransactionLoadingState({
  rows = 5,
  showHeader = true,
  className,
}: TransactionLoadingStateProps) {
  const rowCount = Math.max(1, Math.min(20, Math.floor(rows)));

  return (
    <div
      role="status"
      aria-label="Loading financial transactions"
      aria-busy="true"
      className={cn('w-full space-y-4', className)}
    >
      <span className="sr-only">
        Loading financial transactions…
      </span>

      {showHeader && (
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
          <Skeleton className="h-4 w-40 max-w-full" />
          <Skeleton className="h-4 w-24 max-w-full" />
        </div>
      )}

      <div className="divide-y divide-[var(--border-subtle)]">
        {Array.from({ length: rowCount }, (_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 py-4"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-36 max-w-full" />
              <Skeleton className="h-3 w-52 max-w-full" />
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <Skeleton className="h-4 w-24 max-w-full" />
              <Skeleton
                className="h-5 w-20 max-w-full"
                radius="full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionLoadingState;
