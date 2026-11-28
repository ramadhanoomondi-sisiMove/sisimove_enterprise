import { Skeleton } from '@/components/ui';

export interface CommissionTableSkeletonProps {
  readonly rows?: number;
  readonly columns?: number;
  readonly className?: string;
}

export function CommissionTableSkeleton({
  rows = 5,
  columns = 6,
  className,
}: CommissionTableSkeletonProps) {
  return (
    <div
      className={[
        'w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-label="Loading commission records"
    >
      <div
        className="grid gap-4 border-b border-[var(--border)] bg-[var(--background-subtle)] px-4 py-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} className="h-4 w-3/4" />
        ))}
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid gap-4 px-4 py-5"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${columnIndex}`}
                className="h-4 w-full max-w-32"
              />
            ))}
          </div>
        ))}
      </div>

      <span className="sr-only">Loading commissions...</span>
    </div>
  );
}