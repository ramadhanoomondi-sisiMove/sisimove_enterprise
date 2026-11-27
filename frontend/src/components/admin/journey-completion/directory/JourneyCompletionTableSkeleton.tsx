
import { Skeleton } from '@/components/ui';

export interface JourneyCompletionTableSkeletonProps {
  rows?: number;
}

export function JourneyCompletionTableSkeleton({
  rows = 5,
}: JourneyCompletionTableSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading journey completions"
      className="overflow-hidden rounded-xl border border-[var(--border)]"
    >
      <div className="grid grid-cols-7 gap-4 border-b border-[var(--border)] bg-[var(--background-subtle)] px-4 py-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-full" />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-7 items-center gap-4 border-b border-[var(--border)] px-4 py-4 last:border-0"
        >
          {Array.from({ length: 7 }).map((_, columnIndex) => (
            <Skeleton key={columnIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}

      <span className="sr-only">Loading completion records...</span>
    </div>
  );
}
