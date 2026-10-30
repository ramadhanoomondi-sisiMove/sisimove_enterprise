// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Section Header
// -----------------------------------------------------------------------------
//
// Consistent heading for sections within payment overview and detail pages.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

export interface PaymentSectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PaymentSectionHeader({
  title,
  description,
  action,
  className,
}: PaymentSectionHeaderProps) {
  return (
    <div
      className={[
        'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between',
        className ?? '',
      ].join(' ')}
    >
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h2>

        {description ? (
          <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className="flex shrink-0 items-center gap-2">
          {action}
        </div>
      ) : null}
    </div>
  );
}

export default PaymentSectionHeader;