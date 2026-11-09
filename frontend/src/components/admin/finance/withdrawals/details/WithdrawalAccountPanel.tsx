import { Card } from '@/components/ui';
import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import { WithdrawalAccountLink } from '../shared/WithdrawalAccountLink';

export interface WithdrawalAccountPanelProps {
  withdrawal: AdminWithdrawal;
  accountHref?: string;
  className?: string;
}

export function WithdrawalAccountPanel({
  withdrawal,
  accountHref,
  className,
}: WithdrawalAccountPanelProps) {
  return (
    <Card className={className}>
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        Financial account
      </h2>

      <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
        Account associated with this withdrawal.
      </p>

      <div className="mt-4 space-y-1">
        <p className="text-xs font-medium text-[var(--foreground-muted)]">
          Account public ID
        </p>

        <WithdrawalAccountLink
          accountPublicId={withdrawal.accountPublicId}
          href={accountHref}
        />
      </div>
    </Card>
  );
}

export default WithdrawalAccountPanel;