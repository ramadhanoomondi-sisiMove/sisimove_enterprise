
import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalDetailHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  status?: ReactNode;
  metadata?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalDetailHeader({
  title,
  description,
  backHref,
  backLabel = 'Back to withdrawals',
  status,
  metadata,
  actions,
  className,
}: WithdrawalDetailHeaderProps) {
  const resolvedBackHref = backHref?.trim();

  return (
    <header
      className={cn(
        'flex flex-col gap-5',
        'border-b border-[var(--border-subtle)]',
        'pb-6',
        className,
      )}
    >
      {resolvedBackHref && (
        <Link
          href={resolvedBackHref}
          className={cn(
            'inline-flex w-fit items-center gap-2',
            'text-sm font-medium',
            'text-[var(--foreground-secondary)]',
            'transition-colors',
            'hover:text-[var(--foreground)]',
            'focus-visible:outline-2',
            'focus-visible:outline-[var(--brand)]',
            'focus-visible:outline-offset-4',
          )}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M15.5 10H4.5M9.5 15 4.5 10l5-5" />
          </svg>

          {backLabel}
        </Link>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="break-words text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {title}
            </h1>

            {status}
          </div>

          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
              {description}
            </p>
          )}

          {metadata && (
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              {metadata}
            </div>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

export default WithdrawalDetailHeader;
