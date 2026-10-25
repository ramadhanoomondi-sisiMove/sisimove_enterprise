
import { Badge } from '@/components/ui/badge';
import { AdminAccountHoldStatus } from '@/features/admin/finance/account-holds/models';
import type { AdminAccountHoldStatus as HoldStatus } from '@/features/admin/finance/account-holds/models';

export interface AccountHoldStatusBadgeProps {
  status: HoldStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  HoldStatus,
  {
    label: string;
    variant: 'warning' | 'success' | 'brand' | 'default';
  }
> = {
  [AdminAccountHoldStatus.ACTIVE]: {
    label: 'Active',
    variant: 'warning',
  },
  [AdminAccountHoldStatus.RELEASED]: {
    label: 'Released',
    variant: 'success',
  },
  [AdminAccountHoldStatus.CAPTURED]: {
    label: 'Captured',
    variant: 'brand',
  },
  [AdminAccountHoldStatus.CANCELLED]: {
    label: 'Cancelled',
    variant: 'default',
  },
};

export function AccountHoldStatusBadge({
  status,
  size = 'sm',
}: AccountHoldStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      variant={config.variant}
      size={size}
      aria-label={`Hold status: ${config.label}`}
    >
      {config.label}
    </Badge>
  );
}
