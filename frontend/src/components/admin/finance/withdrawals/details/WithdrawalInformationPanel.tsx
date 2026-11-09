import { Card } from '@/components/ui';
import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import { WithdrawalAmount } from '../shared/WithdrawalAmount';
import WithdrawalCurrency from '../shared/WithdrawalCurrency';
import { WithdrawalDate } from '../shared/WithdrawalDate';

export interface WithdrawalInformationPanelProps {
  withdrawal: AdminWithdrawal;
  className?: string;
}

export function WithdrawalInformationPanel({
  withdrawal,
  className,
}: WithdrawalInformationPanelProps) {
  return (
    <Card className={className}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Withdrawal information
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Amount and original request details.
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <dt className="text-xs font-medium text-[var(--foreground-muted)]">
            Amount
          </dt>
          <dd className="text-lg font-semibold">
            <WithdrawalAmount
              amount={withdrawal.amount}
              currency={withdrawal.currency}
            />
          </dd>
        </div>

        <div className="space-y-1">
          <dt className="text-xs font-medium text-[var(--foreground-muted)]">
            Currency
          </dt>
          <dd>
            <WithdrawalCurrency currency={withdrawal.currency} amount={0} />
          </dd>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <dt className="text-xs font-medium text-[var(--foreground-muted)]">
            Requested at
          </dt>
          <dd className="text-sm text-[var(--foreground)]">
            <WithdrawalDate value={withdrawal.requestedAt} includeTime />
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export default WithdrawalInformationPanel;