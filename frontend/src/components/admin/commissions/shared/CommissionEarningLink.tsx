
 // src/components/admin/commissions/shared/CommissionEarningLink.tsx

import Link from 'next/link';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

export interface CommissionEarningLinkProps {
  readonly publicId: string;
  readonly label?: string;
  readonly className?: string;
}

export function CommissionEarningLink({
  publicId,
  label,
  className,
}: CommissionEarningLinkProps) {
  return (
    <Link
      href={ADMIN_ROUTES.FINANCE_EARNING_COMMISSION(publicId)}
      className={[
        'font-medium',
        'text-[var(--primary)]',
        'underline-offset-4',
        'hover:underline',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--ring)]',
        'focus-visible:ring-offset-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label ?? publicId}
    </Link>
  );
}

export default CommissionEarningLink;
