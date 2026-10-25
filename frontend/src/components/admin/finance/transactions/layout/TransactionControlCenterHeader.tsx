
import type { ReactNode } from 'react';
import { ArrowLeftRight, ShieldCheck } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface TransactionControlCenterHeaderProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function TransactionControlCenterHeader({
  eyebrow = 'FINANCE OPERATIONS',
  title = 'Financial transactions',
  description = 'Monitor transaction activity, investigate exceptions, and review financial operations.',
  actions,
  className,
}: TransactionControlCenterHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-5',
        'border-b border-[var(--border)] pb-6',
        'sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background-subtle)] text-[var(--brand)]"
        >
          <ArrowLeftRight className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold tracking-[0.12em] text-[var(--foreground-muted)]">
              {eyebrow}
            </p>

            <span
              className="inline-flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--success)]"
              title="Administrative finance workspace"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
            {description}
          </p>
        </div>
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {actions}
        </div>
      ) : null}
    </header>
  );
}

export default TransactionControlCenterHeader;
