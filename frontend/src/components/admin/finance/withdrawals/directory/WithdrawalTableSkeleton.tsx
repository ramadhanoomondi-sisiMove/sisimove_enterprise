import { Skeleton } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

export interface WithdrawalTableSkeletonProps {
  rows?: number;
  className?: string;
}

export function WithdrawalTableSkeleton({
  rows = 5,
  className,
}: WithdrawalTableSkeletonProps) {
  const rowCount = Math.min(Math.max(rows, 1), 12);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]',
        className,
      )}
      aria-label="Loading withdrawals"
      role="status"
    >
      <span className="sr-only">Loading withdrawals…</span>

      <div className="hidden grid-cols-6 gap-4 border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 md:grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-20" />
        ))}
      </div>

      <div className="divide-y divide-[var(--border)]">
        {Array.from({ length: rowCount }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-6 md:items-center"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24 md:ml-auto" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default WithdrawalTableSkeleton;