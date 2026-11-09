
import {
  Skeleton,
  Spinner,
} from '@/components/ui';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalLoadingStateProps {
  rows?: number;
  showSpinner?: boolean;
  label?: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalLoadingState({
  rows = 4,
  showSpinner = true,
  label = 'Loading withdrawals...',
  className,
}: WithdrawalLoadingStateProps) {
  const safeRows = Math.min(
    12,
    Math.max(1, Math.floor(rows)),
  );

  return (
    <div
      role="status"
      aria-label={label}
      className={cn('w-full space-y-4', className)}
    >
      {showSpinner && (
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <span className="text-sm text-[var(--foreground-muted)]">
            {label}
          </span>
        </div>
      )}

      <div className="space-y-3" aria-hidden="true">
        {Array.from({ length: safeRows }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-3"
          >
            <Skeleton className="h-9 w-9 shrink-0" radius="full" />

            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>

            <Skeleton className="h-5 w-20 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default WithdrawalLoadingState;
