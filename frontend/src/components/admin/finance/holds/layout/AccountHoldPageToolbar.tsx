
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface AccountHoldPageToolbarProps {
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}

export function AccountHoldPageToolbar({
  leading,
  trailing,
  className,
}: AccountHoldPageToolbarProps) {
  if (!leading && !trailing) return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        'rounded-[var(--radius-lg)] border border-[var(--border)]',
        'bg-[var(--surface)] p-3 sm:p-4',
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {leading}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {trailing}
      </div>
    </div>
  );
}
