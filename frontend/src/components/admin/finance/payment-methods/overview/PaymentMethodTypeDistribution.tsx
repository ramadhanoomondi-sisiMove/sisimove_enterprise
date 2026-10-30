
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Type Distribution
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Display payment-method counts grouped by type.
 * - Visualize relative totals with accessible CSS-based bars.
 * - Use canonical type metrics supplied by the overview model.
 * -----------------------------------------------------------------------------
 */

import { Card } from '@/components/ui';
import { PaymentMethodTypeBadge } from '../shared';

import type { AdminPaymentMethodTypeMetric } from '@/features/admin/finance/payment-methods';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMethodTypeDistributionProps {
  items: readonly AdminPaymentMethodTypeMetric[];
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodTypeDistribution({
  items,
  className,
}: PaymentMethodTypeDistributionProps) {
  const maximum = Math.max(0, ...items.map((item) => item.total));

  return (
    <Card
      padding="md"
      className={['min-w-0 shadow-none', className].filter(Boolean).join(' ')}
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          Payment methods by type
        </h3>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Distribution and lifecycle status for each method type.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-sm text-[var(--foreground-muted)]">
          No payment-method type data is available.
        </p>
      ) : (
        <ul className="space-y-5">
          {items.map((item) => {
            const percentage =
              maximum > 0 ? (item.total / maximum) * 100 : 0;

            return (
              <li key={item.type} className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <PaymentMethodTypeBadge type={item.type} />
                  <span className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
                    {item.total}
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-label={`${item.type} total`}
                  aria-valuemin={0}
                  aria-valuemax={maximum}
                  aria-valuenow={item.total}
                  className="h-2 overflow-hidden rounded-full bg-[var(--background-muted)]"
                >
                  <div
                    className="h-full rounded-full bg-[var(--brand)]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--foreground-muted)]">
                  <span>Active: {item.active}</span>
                  <span>Inactive: {item.inactive}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export default PaymentMethodTypeDistribution;
