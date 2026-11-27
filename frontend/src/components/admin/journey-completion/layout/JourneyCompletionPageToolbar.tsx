
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionPageToolbarProps {
  children: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function JourneyCompletionPageToolbar({
  children,
  leading,
  trailing,
  className,
  ariaLabel = 'Journey completion page controls',
}: JourneyCompletionPageToolbarProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        'flex flex-col gap-3',
        'rounded-[var(--radius-lg)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4',
        className,
      )}
    >
      {(leading || trailing) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {leading && (
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {leading}
            </div>
          )}

          {trailing && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {trailing}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {children}
      </div>
    </section>
  );
}
