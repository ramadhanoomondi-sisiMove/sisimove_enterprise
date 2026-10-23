
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

interface BookingPageToolbarProps {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
}

export function BookingPageToolbar({
  leftContent,
  rightContent,
  className,
}: BookingPageToolbarProps) {
  if (!leftContent && !rightContent) {
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
        {leftContent}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
        {rightContent}
      </div>
    </div>
  );
}

export type { BookingPageToolbarProps };
