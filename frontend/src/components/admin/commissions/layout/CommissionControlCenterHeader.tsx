// src/components/admin/commissions/layout/CommissionControlCenterHeader.tsx

import type { ReactNode } from 'react';

export interface CommissionControlCenterHeaderProps {
  readonly title?: string;
  readonly description?: string;
  readonly eyebrow?: string;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function CommissionControlCenterHeader({
  title = 'Commission Control Center',
  description = 'Monitor booking and earning commissions, manage commission rules, and review commission activity.',
  eyebrow = 'Finance',
  actions,
  className,
}: CommissionControlCenterHeaderProps) {
  return (
    <header
      className={[
        'flex',
        'flex-col',
        'gap-4',
        'border-b',
        'border-[var(--border)]',
        'pb-6',
        'sm:flex-row',
        'sm:items-start',
        'sm:justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
            {eyebrow}
          </p>
        )}

        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
            {description}
          </p>
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