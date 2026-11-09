
import { Badge } from '@/components/ui';

import type {
  AdminWithdrawalDestinationType,
} from '@/features/admin/finance/withdrawals';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalDestinationProps {
  destinationType: AdminWithdrawalDestinationType;
  destinationValue: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Destination Labels
// -----------------------------------------------------------------------------

const destinationLabels: Record<
  AdminWithdrawalDestinationType,
  string
> = {
  MOBILE_MONEY: 'Mobile Money',
  BANK_ACCOUNT: 'Bank Account',
  OTHER: 'Other',
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalDestination({
  destinationType,
  destinationValue,
  className,
}: WithdrawalDestinationProps) {
  const value = destinationValue.trim();

  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <Badge variant="outline" size="sm">
        {destinationLabels[destinationType]}
      </Badge>

      <span
        title={value || undefined}
        className="break-all text-sm text-[var(--foreground)]"
      >
        {value || '—'}
      </span>
    </div>
  );
}

export default WithdrawalDestination;
