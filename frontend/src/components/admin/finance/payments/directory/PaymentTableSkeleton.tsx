// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Table Skeleton
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Preserve the payment table layout while records load.
// - Reuse the shared Skeleton primitive.
// - Avoid duplicating loading animations and design-system styles.
// - Provide an accessible loading status.
// -----------------------------------------------------------------------------

import { Skeleton } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentTableSkeletonProps {
  rows?: number;
  className?: string;
}

// -----------------------------------------------------------------------------
// PaymentTableSkeleton
// -----------------------------------------------------------------------------

export function PaymentTableSkeleton({
  rows = 6,
  className,
}: PaymentTableSkeletonProps) {
  const rowCount = Number.isFinite(rows)
    ? Math.min(20, Math.max(1, Math.floor(rows)))
    : 6;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading payments"
      aria-busy="true"
      className={[
        'w-full overflow-hidden rounded-xl',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="sr-only">Loading payment records…</span>

      {/* ------------------------------------------------------------------ */}
      {/* Table header placeholder                                           */}
      {/* ------------------------------------------------------------------ */}

      <div className="border-b border-[var(--border)] bg-[var(--background-subtle)] px-4 py-3">
        <div className="grid grid-cols-5 gap-4">
          {['w-20', 'w-16', 'w-16', 'w-14', 'w-20'].map(
            (width, index) => (
              <Skeleton
                key={index}
                role="presentation"
                aria-label={undefined}
                className={`h-3 ${width}`}
                radius="sm"
              />
            ),
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Payment row placeholders                                           */}
      {/* ------------------------------------------------------------------ */}

      <div className="divide-y divide-[var(--border)]">
        {Array.from({ length: rowCount }, (_, index) => (
          <div
            key={index}
            className="grid grid-cols-5 items-center gap-4 px-4 py-5"
          >
            {/* Payment identifier */}
            <div className="min-w-0 space-y-2">
              <Skeleton
                role="presentation"
                aria-label={undefined}
                className="h-3 w-28 max-w-full"
                radius="sm"
              />
              <Skeleton
                role="presentation"
                aria-label={undefined}
                className="h-2.5 w-20 max-w-full"
                radius="sm"
              />
            </div>

            {/* Account */}
            <Skeleton
              role="presentation"
              aria-label={undefined}
              className="h-3 w-24 max-w-full"
              radius="sm"
            />

            {/* Amount */}
            <Skeleton
              role="presentation"
              aria-label={undefined}
              className="h-3 w-20 max-w-full"
              radius="sm"
            />

            {/* Status badge */}
            <Skeleton
              role="presentation"
              aria-label={undefined}
              className="h-6 w-20 max-w-full"
              radius="full"
            />

            {/* Created date */}
            <Skeleton
              role="presentation"
              aria-label={undefined}
              className="h-3 w-24 max-w-full"
              radius="sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentTableSkeleton;