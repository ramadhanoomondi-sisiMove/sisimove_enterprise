
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Detail Header
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Present the identity of an individual payment method.
 * - Support optional back-navigation content.
 * - Display status or metadata and detail-level actions.
 * - Leave routing and domain operations to the consuming page.
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMethodDetailHeaderProps {
  title: string;
  description?: string;
  backAction?: ReactNode;
  metadata?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodDetailHeader({
  title,
  description,
  backAction,
  metadata,
  actions,
  className,
}: PaymentMethodDetailHeaderProps) {
  return (
    <header className={cn('min-w-0 space-y-4', className)}>
      {backAction && (
        <div className="flex items-center">
          {backAction}
        </div>
      )}

      <div className="flex min-w-0 flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 space-y-2">
          <h1 className="break-words text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {title}
          </h1>

          {description && (
            <p className="max-w-3xl text-sm leading-6 text-[var(--foreground-secondary)]">
              {description}
            </p>
          )}

          {metadata && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
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

export default PaymentMethodDetailHeader;
