
import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalPublicIdProps
  extends HTMLAttributes<HTMLSpanElement> {
  publicId: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalPublicId({
  publicId,
  className,
  ...props
}: WithdrawalPublicIdProps) {
  const value = publicId.trim();

  if (!value) {
    return <span className={className}>—</span>;
  }

  return (
    <span
      {...props}
      title={value}
      className={cn(
        'font-mono',
        'text-xs',
        'text-[var(--foreground-secondary)]',
        'break-all',
        className,
      )}
    >
      {value}
    </span>
  );
}

export default WithdrawalPublicId;
