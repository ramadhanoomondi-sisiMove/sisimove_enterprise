// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Status Badge
// -----------------------------------------------------------------------------
//
// Presentation-only mapping from the financial account status enum to the
// shared sisiMove Badge primitive. Authorization remains a backend concern.
// -----------------------------------------------------------------------------

import { Badge, type BadgeVariant } from '@/components/ui';
import { AdminFinancialAccountStatus } from '@/features/admin/finance/accounts/models';

export interface FinancialAccountStatusBadgeProps {
  status: AdminFinancialAccountStatus | string;
  size?: 'sm' | 'md';
  className?: string;
}

const statusPresentation: Record<
  AdminFinancialAccountStatus,
  { label: string; variant: BadgeVariant }
> = {
  [AdminFinancialAccountStatus.ACTIVE]: {
    label: 'Active',
    variant: 'success',
  },
  [AdminFinancialAccountStatus.SUSPENDED]: {
    label: 'Suspended',
    variant: 'warning',
  },
  [AdminFinancialAccountStatus.CLOSED]: {
    label: 'Closed',
    variant: 'default',
  },
};

export function FinancialAccountStatusBadge({
  status,
  size = 'sm',
  className,
}: FinancialAccountStatusBadgeProps) {
  const presentation =
    statusPresentation[status as AdminFinancialAccountStatus];

  if (!presentation) {
    return (
      <Badge size={size} variant="outline" className={className}>
        {status || 'Unknown'}
      </Badge>
    );
  }

  return (
    <Badge
      size={size}
      variant={presentation.variant}
      className={className}
    >
      {presentation.label}
    </Badge>
  );
}

export default FinancialAccountStatusBadge;
