// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Loading State
// -----------------------------------------------------------------------------
//
// Uses the existing Skeleton primitive for a consistent loading presentation.
// -----------------------------------------------------------------------------

import { Skeleton } from '@/components/ui';

export interface PaymentMethodLoadingStateProps {
  rows?: number;
  className?: string;
}

export function PaymentMethodLoadingState({
  rows = 5,
  className,
}: PaymentMethodLoadingStateProps) {
  const rowCount = Number.isFinite(rows)
    ? Math.min(20, Math.max(1, Math.floor(rows)))
    : 5;

  return (
    <div
      role="status"
      aria-label="Loading payment methods"
      aria-busy="true"
      className={[
        'w-full space-y-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="sr-only">Loading payment methods…</span>

      {Array.from({ length: rowCount }, (_, index) => (
        <div
          key={index}
          className={[
            'flex items-center gap-4',
            'rounded-[var(--radius-lg)]',
            'border border-[var(--border-subtle)]',
            'bg-[var(--surface)] p-4',
          ].join(' ')}
        >
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5 max-w-48" />
            <Skeleton className="h-3 w-3/5 max-w-64" />
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default PaymentMethodLoadingState;