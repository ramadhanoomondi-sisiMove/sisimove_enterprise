
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Metric Grid
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Present key payment-method metrics in a responsive grid.
 * - Consume the canonical AdminPaymentMethodMetrics model.
 * - Delegate individual metric rendering to PaymentMethodMetricCard.
 * -----------------------------------------------------------------------------
 */

import { PaymentMethodMetricCard } from './PaymentMethodMetricCard';

import type { AdminPaymentMethodMetrics } from '@/features/admin/finance/payment-methods';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMethodMetricGridProps {
  metrics: AdminPaymentMethodMetrics;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodMetricGrid({
  metrics,
  className,
}: PaymentMethodMetricGridProps) {
  const items = [
    {
      label: 'Total payment methods',
      value: metrics.total,
      description: 'Registered payment methods',
    },
    {
      label: 'Active',
      value: metrics.active,
      description: 'Currently active methods',
    },
    {
      label: 'Inactive',
      value: metrics.inactive,
      description: 'Currently inactive methods',
    },
    {
      label: 'Default methods',
      value: metrics.defaultMethods,
      description: 'Marked as an account default',
    },
    {
      label: 'Accounts represented',
      value: metrics.accountsWithPaymentMethods,
      description: 'Accounts with payment methods',
    },
    {
      label: 'Providers',
      value: metrics.providerCount,
      description: 'Distinct provider names',
    },
  ];

  return (
    <div
      className={[
        'grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item) => (
        <PaymentMethodMetricCard
          key={item.label}
          label={item.label}
          value={item.value}
          description={item.description}
        />
      ))}
    </div>
  );
}

export default PaymentMethodMetricGrid;
