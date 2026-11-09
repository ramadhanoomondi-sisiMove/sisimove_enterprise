import { Card } from '@/components/ui';
import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import { WithdrawalDisbursementLink } from '../shared/WithdrawalDisbursementLink';

export interface WithdrawalDisbursementPanelProps {
  withdrawal: AdminWithdrawal;
  disbursementHref?: string;
  className?: string;
}

export function WithdrawalDisbursementPanel({
  withdrawal,
  disbursementHref,
  className,
}: WithdrawalDisbursementPanelProps) {
  return (
    <Card className={className}>
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        Financial disbursement
      </h2>

      <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
        Disbursement associated with this withdrawal, if one has been created.
      </p>

      <div className="mt-4 space-y-1">
        <p className="text-xs font-medium text-[var(--foreground-muted)]">
          Disbursement public ID
        </p>

        <WithdrawalDisbursementLink
          disbursementPublicId={withdrawal.disbursementPublicId}
          href={disbursementHref}
        />
      </div>
    </Card>
  );
}

export default WithdrawalDisbursementPanel;