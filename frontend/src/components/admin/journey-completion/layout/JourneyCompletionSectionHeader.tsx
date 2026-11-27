
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionSectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  titleId?: string;
}

export function JourneyCompletionSectionHeader({
  title,
  description,
  actions,
  className,
  titleId,
}: JourneyCompletionSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        'sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        <h2
          id={titleId}
          className="text-base font-semibold text-[var(--foreground)]"
        >
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm leading-5 text-[var(--foreground-secondary)]">
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
