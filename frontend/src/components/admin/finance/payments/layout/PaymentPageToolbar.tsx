// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payments Page Toolbar
// -----------------------------------------------------------------------------
//
// Flexible toolbar for payment-page context, metadata, and actions.
// Search and filters are supplied by the parent when supported.
// -----------------------------------------------------------------------------

import type { HTMLAttributes, ReactNode } from 'react';

export interface PaymentPageToolbarProps
  extends HTMLAttributes<HTMLDivElement> {
  leading?: ReactNode;
  actions?: ReactNode;
}

export function PaymentPageToolbar({
  leading,
  actions,
  className,
  ...props
}: PaymentPageToolbarProps) {
  return (
    <div
      {...props}
      className={[
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-3">
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

export default PaymentPageToolbar;