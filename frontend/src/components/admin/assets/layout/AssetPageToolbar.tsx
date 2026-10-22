
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Page Toolbar
 * -----------------------------------------------------------------------------
 *
 * Provides a reusable toolbar for search, filters, and contextual actions.
 * -----------------------------------------------------------------------------
 */

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface AssetPageToolbarProps
  extends HTMLAttributes<HTMLDivElement> {
  readonly search?: ReactNode;
  readonly filters?: ReactNode;
  readonly actions?: ReactNode;
}

export function AssetPageToolbar({
  search,
  filters,
  actions,
  className,
  ...props
}: AssetPageToolbarProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4',
        className,
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {search && (
          <div className="min-w-0 flex-1">
            {search}
          </div>
        )}

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {filters && (
        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-3">
          {filters}
        </div>
      )}
    </div>
  );
}

export default AssetPageToolbar;
