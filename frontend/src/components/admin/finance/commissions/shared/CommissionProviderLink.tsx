
 // src/components/admin/commissions/shared/CommissionProviderLink.tsx

import Link from 'next/link';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

export interface CommissionProviderLinkProps {
  readonly publicId: string;
  readonly label?: string;
  readonly className?: string;
}

export function CommissionProviderLink({
  publicId,
  label,
  className,
}: CommissionProviderLinkProps) {
  return (
    <Link
      href={ADMIN_ROUTES.FINANCE_PROVIDER(publicId)}
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

export default CommissionProviderLink;
