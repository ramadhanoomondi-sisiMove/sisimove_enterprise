
import { Badge, type BadgeVariant } from '@/components/ui/badge';

import { AdminFinancialTransactionType } from '@/features/admin/finance/transactions';

import type { AdminFinancialTransactionType as TransactionType } from '@/features/admin/finance/transactions';

export interface TransactionTypeBadgeProps {
  type: TransactionType | string;
  className?: string;
}

const typeConfig: Partial<
  Record<AdminFinancialTransactionType, { label: string; variant: BadgeVariant }>
> = {
  [AdminFinancialTransactionType.PAYMENT]: {
    label: 'Payment',
    variant: 'brand',
  },
  [AdminFinancialTransactionType.TRANSFER]: {
    label: 'Transfer',
    variant: 'default',
  },
  [AdminFinancialTransactionType.HOLD]: {
    label: 'Hold',
    variant: 'warning',
  },
  [AdminFinancialTransactionType.RELEASE]: {
    label: 'Release',
    variant: 'success',
  },
  [AdminFinancialTransactionType.CAPTURE]: {
    label: 'Capture',
    variant: 'brand',
  },
  [AdminFinancialTransactionType.SETTLEMENT]: {
    label: 'Settlement',
    variant: 'success',
  },
  [AdminFinancialTransactionType.DISBURSEMENT]: {
    label: 'Disbursement',
    variant: 'brand',
  },
  [AdminFinancialTransactionType.REFUND]: {
    label: 'Refund',
    variant: 'warning',
  },
  [AdminFinancialTransactionType.REVERSAL]: {
    label: 'Reversal',
    variant: 'outline',
  },
  [AdminFinancialTransactionType.ADJUSTMENT]: {
    label: 'Adjustment',
    variant: 'default',
  },
};

export function TransactionTypeBadge({
  type,
  className,
}: TransactionTypeBadgeProps) {
  const normalizedType = type.toUpperCase();
  const config = typeConfig[normalizedType as AdminFinancialTransactionType];

  return (
    <Badge variant={config?.variant ?? 'default'} className={className}>
      {config?.label ?? type.replaceAll('_', ' ')}
    </Badge>
  );
}

export default TransactionTypeBadge;
