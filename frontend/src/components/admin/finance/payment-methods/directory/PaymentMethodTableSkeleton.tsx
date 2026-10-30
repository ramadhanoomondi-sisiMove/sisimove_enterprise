/**
 * sisiMove Admin — Payment Method Table Skeleton
 */
import { Skeleton } from '@/components/ui';

export interface PaymentMethodTableSkeletonProps {
  rows?: number;
  className?: string;
}

export function PaymentMethodTableSkeleton({ rows = 6, className }: PaymentMethodTableSkeletonProps) {
  const count = Number.isFinite(rows) ? Math.min(20, Math.max(1, Math.floor(rows))) : 6;

  return (
    <div className={['overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]', className].filter(Boolean).join(' ')} role="status" aria-label="Loading payment methods" aria-busy="true">
      <span className="sr-only">Loading payment methods…</span>
      <div className="space-y-0">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="flex items-center gap-4 border-b border-[var(--border-subtle)] px-4 py-4 last:border-0">
            <div className="min-w-0 flex-1 space-y-2"><Skeleton className="h-4 w-36 max-w-full" /><Skeleton className="h-3 w-24 max-w-full" /></div>
            <div className="hidden w-28 space-y-2 md:block"><Skeleton className="h-6 w-16 rounded-full" /></div>
            <div className="hidden w-32 space-y-2 sm:block"><Skeleton className="h-6 w-24 rounded-full" /></div>
            <div className="hidden w-20 md:block"><Skeleton className="h-6 w-14 rounded-full" /></div>
            <div className="hidden w-24 lg:block"><Skeleton className="h-4 w-20" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentMethodTableSkeleton;
