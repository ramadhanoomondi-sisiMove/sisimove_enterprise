import { Card } from '@/components/ui';
import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import { WithdrawalStatusBadge } from '../shared/WithdrawalStatusBadge';
import { WithdrawalDate } from '../shared/WithdrawalDate';
import WithdrawalLifecycleTimeline from './WithdrawalLifecycleTimeline';

export interface WithdrawalLifecyclePanelProps {
  withdrawal: AdminWithdrawal;
  className?: string;
}

export function WithdrawalLifecyclePanel({
  withdrawal,
  className,
}: WithdrawalLifecyclePanelProps) {
  return (
    <div className={className}>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Current lifecycle status
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Current state of this withdrawal.
            </p>
          </div>

          <WithdrawalStatusBadge status={withdrawal.status} />
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Requested
            </dt>
            <dd className="text-sm text-[var(--foreground)]">
              <WithdrawalDate value={withdrawal.requestedAt} includeTime />
            </dd>
          </div>

          {withdrawal.completedAt && (
            <div className="space-y-1">
              <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                Completed
              </dt>
              <dd className="text-sm text-[var(--foreground)]">
                <WithdrawalDate value={withdrawal.completedAt} includeTime />
              </dd>
            </div>
          )}

          {withdrawal.failedAt && (
            <div className="space-y-1">
              <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                Failed
              </dt>
              <dd className="text-sm text-[var(--foreground)]">
                <WithdrawalDate value={withdrawal.failedAt} includeTime />
              </dd>
            </div>
          )}

          {withdrawal.cancelledAt && (
            <div className="space-y-1">
              <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                Cancelled
              </dt>
              <dd className="text-sm text-[var(--foreground)]">
                <WithdrawalDate value={withdrawal.cancelledAt} includeTime />
              </dd>
            </div>
          )}
        </dl>
      </Card>

      <WithdrawalLifecycleTimeline
        withdrawal={withdrawal}
        className="mt-4"
      />
    </div>
  );
}

export default WithdrawalLifecyclePanel;