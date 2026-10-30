
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Section Header
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Standardize section headings throughout Payment Methods.
 * - Display optional supporting text and section-level actions.
 * - Support an optional heading ID for accessibility relationships.
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMethodSectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  titleId?: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodSectionHeader({
  title,
  description,
  actions,
  titleId,
  className,
}: PaymentMethodSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col justify-between gap-3',
        'sm:flex-row sm:items-start',
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <h2
          id={titleId}
          className="text-base font-semibold text-[var(--foreground)]"
        >
          {title}
        </h2>

        {description && (
          <p className="text-sm leading-5 text-[var(--foreground-secondary)]">
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

export default PaymentMethodSectionHeader;
