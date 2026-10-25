
import { Badge, type BadgeVariant } from '@/components/ui/badge';

import { AdminFinancialTransactionStatus } from '@/features/admin/finance/transactions';

import type { AdminFinancialTransactionStatus as TransactionStatus } from '@/features/admin/finance/transactions';

export interface TransactionStatusBadgeProps {
  status: TransactionStatus | string;
  className?: string;
}

const statusConfig: Record<
  AdminFinancialTransactionStatus,
  { label: string; variant: BadgeVariant }
> = {
  [AdminFinancialTransactionStatus.PENDING]: {
    label: 'Pending',
    variant: 'warning',
  },
  [AdminFinancialTransactionStatus.COMPLETED]: {
    label: 'Completed',
    variant: 'success',
  },
  [AdminFinancialTransactionStatus.FAILED]: {
    label: 'Failed',
    variant: 'danger',
  },
  [AdminFinancialTransactionStatus.REVERSED]: {
    label: 'Reversed',
    variant: 'outline',
  },
  [AdminFinancialTransactionStatus.CANCELLED]: {
    label: 'Cancelled',
    variant: 'default',
  },
};

export function TransactionStatusBadge({
  status,
  className,
}: TransactionStatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();
  const config =
    statusConfig[normalizedStatus as AdminFinancialTransactionStatus];

  return (
    <Badge
      variant={config?.variant ?? 'default'}
      className={className}
    >
      {config?.label ?? status.replaceAll('_', ' ')}
    </Badge>
  );
}

export default TransactionStatusBadge;
