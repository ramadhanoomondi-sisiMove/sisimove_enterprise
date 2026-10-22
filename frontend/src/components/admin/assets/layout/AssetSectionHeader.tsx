
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Section Header
 * -----------------------------------------------------------------------------
 *
 * Provides consistent headings for sections within the asset control center.
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface AssetSectionHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly count?: number;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function AssetSectionHeader({
  title,
  description,
  count,
  actions,
  className,
}: AssetSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-[var(--foreground)] sm:text-lg">
            {title}
          </h2>

          {count !== undefined && (
            <span className="inline-flex min-h-6 items-center rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--background-subtle)] px-2 text-xs font-medium tabular-nums text-[var(--foreground-secondary)]">
              {count.toLocaleString()}
            </span>
          )}
        </div>

        {description && (
          <p className="max-w-2xl text-sm leading-5 text-[var(--foreground-muted)]">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

export default AssetSectionHeader;
