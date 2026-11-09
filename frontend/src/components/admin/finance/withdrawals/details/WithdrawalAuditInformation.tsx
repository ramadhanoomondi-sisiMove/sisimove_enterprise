import { Card } from '@/components/ui';
import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import { WithdrawalDate } from '../shared/WithdrawalDate';

export interface WithdrawalAuditInformationProps {
  withdrawal: AdminWithdrawal;
  className?: string;
}

export function WithdrawalAuditInformation({
  withdrawal,
  className,
}: WithdrawalAuditInformationProps) {
  return (
    <Card className={className}>
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        Audit information
      </h2>

      <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
        Record creation and last update timestamps.
      </p>

      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <dt className="text-xs font-medium text-[var(--foreground-muted)]">
            Created at
          </dt>
          <dd className="text-sm text-[var(--foreground)]">
            <WithdrawalDate value={withdrawal.createdAt} includeTime />
          </dd>
        </div>

        <div className="space-y-1">
          <dt className="text-xs font-medium text-[var(--foreground-muted)]">
            Last updated
          </dt>
          <dd className="text-sm text-[var(--foreground)]">
            <WithdrawalDate value={withdrawal.updatedAt} includeTime />
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export default WithdrawalAuditInformation;