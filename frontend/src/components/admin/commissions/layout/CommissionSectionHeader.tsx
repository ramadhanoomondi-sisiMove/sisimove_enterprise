// src/components/admin/commissions/layout/CommissionSectionHeader.tsx

import type { ReactNode } from 'react';

export interface CommissionSectionHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function CommissionSectionHeader({
  title,
  description,
  actions,
  className,
}: CommissionSectionHeaderProps) {
  return (
    <div
      className={[
        'flex',
        'flex-col',
        'gap-3',
        'sm:flex-row',
        'sm:items-start',
        'sm:justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
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