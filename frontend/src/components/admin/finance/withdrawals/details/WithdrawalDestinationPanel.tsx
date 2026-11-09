import { Card } from '@/components/ui';
import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import { WithdrawalDestination } from '../shared/WithdrawalDestination';

export interface WithdrawalDestinationPanelProps {
  withdrawal: AdminWithdrawal;
  className?: string;
}

export function WithdrawalDestinationPanel({
  withdrawal,
  className,
}: WithdrawalDestinationPanelProps) {
  return (
    <Card className={className}>
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        Withdrawal destination
      </h2>

      <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
        Destination details captured when the withdrawal was requested.
      </p>

      <div className="mt-4">
        <WithdrawalDestination
          destinationType={withdrawal.destinationType}
          destinationValue={withdrawal.destinationValue}
        />
      </div>
    </Card>
  );
}

export default WithdrawalDestinationPanel;