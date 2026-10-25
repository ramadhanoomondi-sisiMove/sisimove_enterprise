
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface TransactionSectionHeaderProps {
  title: string;
  description?: string;
  count?: number;
  actions?: ReactNode;
  className?: string;
  titleId?: string;
}

export function TransactionSectionHeader({
  title,
  description,
  count,
  actions,
  className,
  titleId,
}: TransactionSectionHeaderProps) {
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
          <h2
            id={titleId}
            className="text-base font-semibold text-[var(--foreground)]"
          >
            {title}
          </h2>

          {count !== undefined && Number.isFinite(count) ? (
            <span className="inline-flex min-h-6 items-center rounded-full bg-[var(--background-muted)] px-2.5 text-xs font-medium tabular-nums text-[var(--foreground-secondary)]">
              {new Intl.NumberFormat('en-KE').format(count)}
            </span>
          ) : null}
        </div>

        {description ? (
          <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export default TransactionSectionHeader;
