
/**
 * SisiMove Admin — Withdrawal Amount Summary
 *
 * Displays withdrawal amounts grouped by currency and status.
 *
 * Important:
 * - Uses the existing WithdrawalAmount formatter.
 * - Preserves separate currency totals.
 * - Does not combine different currencies.
 * - Uses the existing AdminWithdrawalMetrics model.
 */

import { Card } from '@/components/ui';

import type { AdminWithdrawalMetrics } from '@/features/admin/finance/withdrawals/models/admin-withdrawal-metrics.model';

import { WithdrawalAmount } from '../shared/WithdrawalAmount';
import WithdrawalCurrency from '../shared/WithdrawalCurrency';
// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const AMOUNT_STATUSES = [
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'failed', label: 'Failed' },
  { key: 'cancelled', label: 'Cancelled' },
] as const;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalAmountSummaryProps {
  metrics: AdminWithdrawalMetrics;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalAmountSummary({
  metrics,
  className,
}: WithdrawalAmountSummaryProps) {
  const currencies = Object.entries(
    metrics.amountsByCurrency,
  ).sort(([currencyA], [currencyB]) =>
    currencyA.localeCompare(currencyB),
  );

  return (
    <Card className={className}>
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          Withdrawal Amounts
        </h3>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Requested amounts grouped by currency and withdrawal status.
        </p>
      </div>

      {/* Empty State */}
      {currencies.length === 0 ? (
        <p className="py-4 text-sm text-[var(--foreground-muted)]">
          No withdrawal amounts are available yet.
        </p>
      ) : (
        <div className="space-y-6">
          {currencies.map(([currency, amounts]) => (
            <section
              key={currency}
              className="space-y-3"
              aria-label={`${currency} withdrawal amounts`}
            >
              {/* Currency Total */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <WithdrawalCurrency currency={currency} amount={0} />

                  <span className="text-sm text-[var(--foreground-muted)]">
                    Total requested
                  </span>
                </div>

                <WithdrawalAmount
                  amount={amounts.total}
                  currency={currency}
                  className="text-base font-semibold"
                />
              </div>

              {/* Status Amounts */}
              <div className="divide-y divide-[var(--border-subtle)]">
                {AMOUNT_STATUSES.map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 py-3 text-sm"
                  >
                    <span className="text-[var(--foreground-muted)]">
                      {label}
                    </span>

                    <WithdrawalAmount
                      amount={amounts[key]}
                      currency={currency}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Card>
  );
}

export default WithdrawalAmountSummary;
