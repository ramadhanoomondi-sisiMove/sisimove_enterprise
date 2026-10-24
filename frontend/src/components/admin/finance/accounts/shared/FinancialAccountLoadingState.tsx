// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Loading State
// -----------------------------------------------------------------------------
//
// Lightweight skeleton layout built from the shared Skeleton primitive.
// -----------------------------------------------------------------------------

import { Skeleton } from '@/components/ui';

export interface FinancialAccountLoadingStateProps {
  rows?: number;
  showHeader?: boolean;
  className?: string;
}

export function FinancialAccountLoadingState({
  rows = 3,
  showHeader = true,
  className,
}: FinancialAccountLoadingStateProps) {
  const safeRows = Math.max(1, Math.min(8, Math.floor(rows)));

  return (
    <section
      aria-label="Loading financial account"
      aria-busy="true"
      className={className}
    >
      {showHeader && (
        <div className="mb-6 space-y-2">
          <Skeleton className="h-7 w-56 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: safeRows }, (_, index) => (
          <div
            key={index}
            className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-4 h-7 w-40 max-w-full" />
            <Skeleton className="mt-3 h-3 w-24" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default FinancialAccountLoadingState;
