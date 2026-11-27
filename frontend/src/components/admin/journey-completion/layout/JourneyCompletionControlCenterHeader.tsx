
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionControlCenterHeaderProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function JourneyCompletionControlCenterHeader({
  title = 'Journey Completion & Settlement',
  eyebrow = 'ADMINISTRATION',
  description = 'Monitor journey completion, confirmations, disputes and settlement activity.',
  actions,
  className,
}: JourneyCompletionControlCenterHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4',
        'sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wider text-[var(--foreground-muted)]">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
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
