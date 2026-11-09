
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalSectionHeaderProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  action?: ReactNode;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalSectionHeader({
  title,
  description,
  badge,
  action,
  className,
}: WithdrawalSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        'sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            {title}
          </h2>

          {badge}
        </div>

        {description && (
          <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="flex shrink-0 items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
}

export default WithdrawalSectionHeader;
