
import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalPageToolbarProps
  extends HTMLAttributes<HTMLDivElement> {
  leadingContent?: ReactNode;
  trailingContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalPageToolbar({
  leadingContent,
  trailingContent,
  children,
  className,
  ...props
}: WithdrawalPageToolbarProps) {
  return (
    <div
      {...props}
      role="toolbar"
      className={cn(
        'flex flex-col gap-3',
        'sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        {leadingContent}
        {children}
      </div>

      {trailingContent && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {trailingContent}
        </div>
      )}
    </div>
  );
}

export default WithdrawalPageToolbar;
