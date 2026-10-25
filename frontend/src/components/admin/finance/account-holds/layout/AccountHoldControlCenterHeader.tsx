
import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface AccountHoldControlCenterHeaderProps {
  title?: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

export function AccountHoldControlCenterHeader({
  title = 'Financial Account Holds',
  description = 'Monitor held funds, review expiry, and manage account-hold lifecycle operations.',
  eyebrow = 'FINANCIAL OPERATIONS',
  actions,
  className,
}: AccountHoldControlCenterHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background-brand)] text-[var(--brand)]">
          <ShieldCheck aria-hidden="true" className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
              {eyebrow}
            </p>
          )}

          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {title}
          </h1>

          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}
