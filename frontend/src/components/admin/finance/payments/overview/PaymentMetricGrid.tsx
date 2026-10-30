// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Metric Grid
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';
import { PaymentMetricCard } from './PaymentMetricCard';

export interface PaymentMetricItem {
  id: string;
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  footer?: ReactNode;
}

export interface PaymentMetricGridProps {
  metrics: PaymentMetricItem[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const columnClasses: Record<NonNullable<PaymentMetricGridProps['columns']>, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 xl:grid-cols-3',
  4: 'sm:grid-cols-2 xl:grid-cols-4',
};

export function PaymentMetricGrid({
  metrics,
  columns = 4,
  className,
}: PaymentMetricGridProps) {
  if (metrics.length === 0) {
    return null;
  }

  return (
    <div
      className={[
        'grid grid-cols-1 gap-4',
        columnClasses[columns],
        className ?? '',
      ].join(' ')}
    >
      {metrics.map((metric) => (
        <PaymentMetricCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          description={metric.description}
          icon={metric.icon}
          footer={metric.footer}
        />
      ))}
    </div>
  );
}

export default PaymentMetricGrid;