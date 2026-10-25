
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface AccountHoldSectionHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function AccountHoldSectionHeader({
  title,
  description,
  eyebrow,
  meta,
  actions,
  className,
}: AccountHoldSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
            {eyebrow}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            {title}
          </h2>
          {meta}
        </div>

        {description && (
          <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--foreground-secondary)]">
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
