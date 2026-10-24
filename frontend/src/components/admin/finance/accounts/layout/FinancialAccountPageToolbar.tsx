// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Page Toolbar
// -----------------------------------------------------------------------------
//
// Small reusable toolbar for contextual actions and metadata.
// It intentionally does not include search/filter controls, because the
// supplied backend controller does not expose an account-list endpoint.
// -----------------------------------------------------------------------------

import type { HTMLAttributes, ReactNode } from 'react';

export interface FinancialAccountPageToolbarProps
  extends HTMLAttributes<HTMLDivElement> {
  leading?: ReactNode;
  actions?: ReactNode;
}

export function FinancialAccountPageToolbar({
  leading,
  actions,
  className,
  ...props
}: FinancialAccountPageToolbarProps) {
  return (
    <div
      {...props}
      className={[
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex min-w-0 items-center gap-3">
        {leading}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export default FinancialAccountPageToolbar;
