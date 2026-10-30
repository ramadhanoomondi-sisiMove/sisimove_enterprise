
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Control Center Header
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Present the main Payment Methods page heading.
 * - Display optional eyebrow text and supporting description.
 * - Provide a slot for page-level actions.
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMethodControlCenterHeaderProps {
  title?: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodControlCenterHeader({
  title = 'Payment Methods',
  description = 'Manage payment methods and review their configuration and status.',
  eyebrow = 'Finance',
  actions,
  className,
}: PaymentMethodControlCenterHeaderProps) {
  return (
    <header
      className={cn(
        'flex min-w-0 flex-col justify-between gap-4',
        'sm:flex-row sm:items-start',
        className,
      )}
    >
      <div className="min-w-0 space-y-2">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
            {eyebrow}
          </p>
        )}

        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="max-w-3xl text-sm leading-6 text-[var(--foreground-secondary)]">
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

export default PaymentMethodControlCenterHeader;
