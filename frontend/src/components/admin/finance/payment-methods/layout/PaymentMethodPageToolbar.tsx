
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Page Toolbar
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Arrange search and filter controls.
 * - Support leading content, child controls, and trailing actions.
 * - Reuse the shared Card primitive for consistent surface styling.
 * - Adapt to narrow screens without horizontal overflow.
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from 'react';

import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMethodPageToolbarProps {
  children?: ReactNode;
  leadingContent?: ReactNode;
  trailingContent?: ReactNode;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodPageToolbar({
  children,
  leadingContent,
  trailingContent,
  className,
}: PaymentMethodPageToolbarProps) {
  return (
    <Card
      padding="sm"
      className={cn('min-w-0 shadow-none', className)}
    >
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {leadingContent}
          {children}
        </div>

        {trailingContent && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {trailingContent}
          </div>
        )}
      </div>
    </Card>
  );
}

export default PaymentMethodPageToolbar;
