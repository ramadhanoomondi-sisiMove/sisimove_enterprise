
import Link from 'next/link';

import { cn } from '@/foundation/utils/cn';

import { WithdrawalPublicId } from './WithdrawalPublicId';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalAccountLinkProps {
  accountPublicId: string;
  href?: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalAccountLink({
  accountPublicId,
  href,
  className,
}: WithdrawalAccountLinkProps) {
  const publicId = accountPublicId.trim();

  if (!publicId) {
    return <span className={className}>—</span>;
  }

  const content = (
    <WithdrawalPublicId
      publicId={publicId}
      className={cn(
        href && 'text-[var(--brand)]',
        href && 'hover:underline',
        className,
      )}
    />
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      aria-label={`View financial account ${publicId}`}
      className="inline-flex min-w-0"
    >
      {content}
    </Link>
  );
}

export default WithdrawalAccountLink;
