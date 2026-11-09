/**
 * SisiMove Admin — Withdrawal Recent Activity
 *
 * Displays the most recently requested withdrawals.
 */

import { Card } from '@/components/ui';

import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';

import { WithdrawalAccountLink } from '../shared/WithdrawalAccountLink';
import { WithdrawalAmount } from '../shared/WithdrawalAmount';
import { WithdrawalDate } from '../shared/WithdrawalDate';
import { WithdrawalDestination } from '../shared/WithdrawalDestination';
import { WithdrawalPublicId } from '../shared/WithdrawalPublicId';
import { WithdrawalStatusBadge } from '../shared/WithdrawalStatusBadge';

export interface WithdrawalRecentActivityProps {
  withdrawals: readonly AdminWithdrawal[];
  limit?: number;
  className?: string;
}

function getRequestedTimestamp(
  withdrawal: AdminWithdrawal,
): number {
  const timestamp = new Date(
    withdrawal.requestedAt,
  ).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function WithdrawalRecentActivity({
  withdrawals,
  limit = 6,
  className,
}: WithdrawalRecentActivityProps) {
  const safeLimit = Math.max(1, Math.floor(limit));

  const recentWithdrawals = [...withdrawals]
    .sort(
      (a, b) =>
        getRequestedTimestamp(b) - getRequestedTimestamp(a),
    )
    .slice(0, safeLimit);

  return (
    <Card className={className}>
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          Recent Withdrawals
        </h3>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Latest withdrawal requests across financial accounts.
        </p>
      </div>

      {recentWithdrawals.length === 0 ? (
        <p className="text-sm text-[var(--foreground-muted)]">
          No withdrawal activity to display.
        </p>
      ) : (
        <div className="divide-y divide-[var(--border-subtle)]">
          {recentWithdrawals.map((withdrawal) => (
            <div
              key={withdrawal.publicId}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-2">
                <WithdrawalPublicId
                  publicId={withdrawal.publicId}
                />

                <div className="text-sm text-[var(--foreground-secondary)]">
                  <WithdrawalDestination
                    destinationType={withdrawal.destinationType}
                    destinationValue={withdrawal.destinationValue}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--foreground-muted)]">
                  <span>Account</span>

                  <WithdrawalAccountLink
                    accountPublicId={withdrawal.accountPublicId}
                  />

                  <span aria-hidden="true">·</span>

                  <span>Requested</span>

                  <WithdrawalDate
                    value={withdrawal.requestedAt}
                    includeTime
                  />
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                <span className="font-semibold tabular-nums text-[var(--foreground)]">
                  <WithdrawalAmount
                    amount={withdrawal.amount}
                    currency={withdrawal.currency}
                  />
                </span>

                <WithdrawalStatusBadge
                  status={withdrawal.status}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}