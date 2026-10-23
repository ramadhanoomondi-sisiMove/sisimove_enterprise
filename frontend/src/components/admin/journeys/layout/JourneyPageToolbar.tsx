
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface JourneyPageToolbarProps {
  title?: string;
  description?: string;
  leadingContent?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function JourneyPageToolbar({
  title,
  description,
  leadingContent,
  actions,
  children,
  className,
}: JourneyPageToolbarProps) {
  return (
    <section
      aria-label={title || 'Journey page toolbar'}
      className={cn(
        'w-full space-y-4',
        className,
      )}
    >
      {(title || description || leadingContent || actions) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {leadingContent && (
              <div className="flex shrink-0 items-center justify-center">
                {leadingContent}
              </div>
            )}

            {(title || description) && (
              <div className="min-w-0">
                {title && (
                  <h2 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
                    {title}
                  </h2>
                )}

                {description && (
                  <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>

          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
              {actions}
            </div>
          )}
        </div>
      )}

      {children && (
        <div className="min-w-0">
          {children}
        </div>
      )}
    </section>
  );
}

export default JourneyPageToolbar;
