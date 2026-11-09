
import { Badge, type BadgeSize } from '@/components/ui';

import type {
  AdminWithdrawalStatus,
} from '@/features/admin/finance/withdrawals';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalStatusBadgeProps {
  status: AdminWithdrawalStatus;
  size?: BadgeSize;
}

// -----------------------------------------------------------------------------
// Status Configuration
// -----------------------------------------------------------------------------

const statusConfiguration: Record<
  AdminWithdrawalStatus,
  {
    label: string;
    variant: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  }
> = {
  PENDING: {
    label: 'Pending',
    variant: 'warning',
  },

  PROCESSING: {
    label: 'Processing',
    variant: 'brand',
  },

  COMPLETED: {
    label: 'Completed',
    variant: 'success',
  },

  FAILED: {
    label: 'Failed',
    variant: 'danger',
  },

  CANCELLED: {
    label: 'Cancelled',
    variant: 'default',
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalStatusBadge({
  status,
  size = 'sm',
}: WithdrawalStatusBadgeProps) {
  const configuration = statusConfiguration[status];

  return (
    <Badge
      variant={configuration.variant}
      size={size}
    >
      {configuration.label}
    </Badge>
  );
}

export default WithdrawalStatusBadge;
