// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Type Badge
// -----------------------------------------------------------------------------
//
// Presentation-only label for financial account types.
// -----------------------------------------------------------------------------

import { Badge, type BadgeVariant } from '@/components/ui';
import { AdminFinancialAccountType } from '@/features/admin/finance/accounts/models';

export interface FinancialAccountTypeBadgeProps {
  type: AdminFinancialAccountType | string;
  size?: 'sm' | 'md';
  className?: string;
}

const typePresentation: Record<
  AdminFinancialAccountType,
  { label: string; variant: BadgeVariant }
> = {
  [AdminFinancialAccountType.USER]: {
    label: 'User',
    variant: 'default',
  },
  [AdminFinancialAccountType.PLATFORM]: {
    label: 'Platform',
    variant: 'brand',
  },
  [AdminFinancialAccountType.MERCHANT]: {
    label: 'Merchant',
    variant: 'success',
  },
  [AdminFinancialAccountType.HOLDING]: {
    label: 'Holding',
    variant: 'warning',
  },
  [AdminFinancialAccountType.SETTLEMENT]: {
    label: 'Settlement',
    variant: 'outline',
  },
};

export function FinancialAccountTypeBadge({
  type,
  size = 'sm',
  className,
}: FinancialAccountTypeBadgeProps) {
  const presentation =
    typePresentation[type as AdminFinancialAccountType];

  if (!presentation) {
    return (
      <Badge size={size} variant="outline" className={className}>
        {type || 'Unknown'}
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

export default FinancialAccountTypeBadge;
