
import type { HTMLAttributes, ReactNode } from 'react';
import { SlidersHorizontal } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface TransactionPageToolbarProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  leadingContent?: ReactNode;
  actions?: ReactNode;
  title?: string;
  description?: string;
}

export function TransactionPageToolbar({
  children,
  leadingContent,
  actions,
  title,
  description,
  className,
  ...props
}: TransactionPageToolbarProps) {
  return (
    <section
      {...props}
      aria-label="Transaction search and filters"
      className={cn(
        'rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] shadow-[var(--shadow-sm)]',
        className,
      )}
    >
      {title || description || leadingContent || actions ? (
        <div className="flex flex-col gap-3 border-b border-[var(--border-subtle)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex min-w-0 items-start gap-3">
            <div
              aria-hidden="true"
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-muted)] text-[var(--foreground-secondary)]"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              {title ? (
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  {title}
                </h2>
              ) : null}

              {description ? (
                <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                  {description}
                </p>
              ) : null}

              {leadingContent}
            </div>
          </div>

          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}

      {children ? (
        <div className="p-4 sm:p-5">{children}</div>
      ) : null}
    </section>
  );
}

export default TransactionPageToolbar;
