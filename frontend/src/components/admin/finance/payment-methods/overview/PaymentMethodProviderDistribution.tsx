
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Provider Distribution
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Display payment-method counts grouped by provider.
 * - Visualize relative provider totals.
 * - Reuse the shared provider badge for consistent presentation.
 * -----------------------------------------------------------------------------
 */

import { Card } from '@/components/ui';
import { PaymentMethodProviderBadge } from '../shared';

import type { AdminPaymentMethodProviderMetric } from '@/features/admin/finance/payment-methods';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMethodProviderDistributionProps {
  items: readonly AdminPaymentMethodProviderMetric[];
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodProviderDistribution({
  items,
  className,
}: PaymentMethodProviderDistributionProps) {
  const maximum = Math.max(0, ...items.map((item) => item.total));

  return (
    <Card
      padding="md"
      className={['min-w-0 shadow-none', className].filter(Boolean).join(' ')}
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          Payment methods by provider
        </h3>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Compare registered methods across providers.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-sm text-[var(--foreground-muted)]">
          No payment-method provider data is available.
        </p>
      ) : (
        <ul className="space-y-5">
          {items.map((item) => {
            const percentage =
              maximum > 0 ? (item.total / maximum) * 100 : 0;

            return (
              <li key={item.provider} className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <PaymentMethodProviderBadge provider={item.provider} />
                  <span className="text-sm font-semibold tabular-nums text-[var(--foreground)]">
                    {item.total}
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-label={`${item.provider} total`}
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

export default PaymentMethodProviderDistribution;
