// src/features/admin/boardings/layout/BoardingPageToolbar.tsx

import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface BoardingPageToolbarProps {
  leading?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function BoardingPageToolbar({
  leading,
  actions,
  className,
}: BoardingPageToolbarProps) {
  if (!leading && !actions) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        {leading}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
