// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Public ID
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display a payment's public identifier consistently.
// - Preserve the complete identifier for accessibility and inspection.
// - Remain a presentation-only component.
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentPublicIdProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  publicId: string;
  truncate?: boolean;
}

// -----------------------------------------------------------------------------
// PaymentPublicId
// -----------------------------------------------------------------------------

export function PaymentPublicId({
  publicId,
  truncate = true,
  className,
  ...props
}: PaymentPublicIdProps) {
  const value = publicId.trim() || '—';

  return (
    <code
      {...props}
      title={value}
      className={[
        'font-mono',
        'text-xs',
        'text-[var(--foreground-secondary)]',
        truncate
          ? 'inline-block max-w-48 truncate align-bottom'
          : 'break-all',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {value}
    </code>
  );
}