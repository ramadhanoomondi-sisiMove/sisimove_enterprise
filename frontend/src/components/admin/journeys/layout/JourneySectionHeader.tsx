import type { ReactNode } from 'react';
import { cn } from '@/foundation/utils/cn';

export interface JourneySectionHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  leadingContent?: ReactNode;
  trailingContent?: ReactNode;
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
}

export function JourneySectionHeader({
  title,
  description,
  eyebrow,
  leadingContent,
  trailingContent,
  actions,
  className,
  titleClassName,
}: JourneySectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {leadingContent && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--brand)] shadow-[var(--shadow-sm)]">
            {leadingContent}
          </div>
        )}

        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
              {eyebrow}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <h2
              className={cn(
                'text-base font-semibold tracking-tight text-[var(--foreground)] sm:text-lg',
                titleClassName,
              )}
            >
              {title}
            </h2>

            {trailingContent && (
              <div className="flex items-center">{trailingContent}</div>
            )}
          </div>

          {description && (
            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[var(--foreground-muted)]">
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}

export default JourneySectionHeader;