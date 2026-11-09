import { Card } from '@/components/ui';
import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import { WithdrawalPublicId } from '../shared/WithdrawalPublicId';
import { WithdrawalStatusBadge } from '../shared/WithdrawalStatusBadge';

export interface WithdrawalIdentityPanelProps {
  withdrawal: AdminWithdrawal;
  className?: string;
}

export function WithdrawalIdentityPanel({
  withdrawal,
  className,
}: WithdrawalIdentityPanelProps) {
  return (
    <Card className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Withdrawal public ID
          </p>
          <WithdrawalPublicId publicId={withdrawal.publicId} />
        </div>

        <WithdrawalStatusBadge status={withdrawal.status} />
      </div>
    </Card>
  );
}

export default WithdrawalIdentityPanel;