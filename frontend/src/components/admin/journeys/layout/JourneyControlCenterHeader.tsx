
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface JourneyControlCenterHeaderProps {
  title?: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

export function JourneyControlCenterHeader({
  title = 'Journey Control Center',
  description = 'Monitor journeys, inspect operational activity, and manage the journey lifecycle from one workspace.',
  eyebrow = 'OPERATIONS',
  actions,
  className,
}: JourneyControlCenterHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-5',
        'border-b border-[var(--border)]',
        'pb-6 sm:pb-8',
        'lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <div className="min-w-0 max-w-3xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
            {eyebrow}
          </p>
        )}

        <h1 className="text-balance text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)] sm:text-base">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3 lg:justify-end">
          {actions}
        </div>
      )}
    </header>
  );
}

export default JourneyControlCenterHeader;
