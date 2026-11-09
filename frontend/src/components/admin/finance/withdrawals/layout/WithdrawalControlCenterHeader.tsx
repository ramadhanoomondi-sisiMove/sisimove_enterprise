
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalControlCenterHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  supplementaryContent?: ReactNode;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalControlCenterHeader({
  eyebrow,
  title,
  description,
  actions,
  supplementaryContent,
  className,
}: WithdrawalControlCenterHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-5',
        'border-b border-[var(--border-subtle)]',
        'pb-6',
        'sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
            {eyebrow}
          </p>
        )}

        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
            {description}
          </p>
        )}

        {supplementaryContent && (
          <div className="mt-4">
            {supplementaryContent}
          </div>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}

export default WithdrawalControlCenterHeader;
