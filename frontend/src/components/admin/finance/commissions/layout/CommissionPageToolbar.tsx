// src/components/admin/commissions/layout/CommissionPageToolbar.tsx

import type { ReactNode } from 'react';

export interface CommissionPageToolbarProps {
  readonly leadingContent?: ReactNode;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function CommissionPageToolbar({
  leadingContent,
  actions,
  className,
}: CommissionPageToolbarProps) {
  return (
    <div
      className={[
        'flex',
        'flex-col',
        'gap-3',
        'sm:flex-row',
        'sm:items-center',
        'sm:justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {leadingContent && (
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          {leadingContent}
        </div>
      )}

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}