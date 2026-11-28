// src/components/admin/commissions/overview/CommissionMetricGrid.tsx

import type { ReactNode } from 'react';

export interface CommissionMetricGridProps {
  readonly children: ReactNode;
  readonly columns?: 2 | 3 | 4;
  readonly className?: string;
}

const columnClasses = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 xl:grid-cols-3',
  4: 'sm:grid-cols-2 xl:grid-cols-4',
} satisfies Record<NonNullable<CommissionMetricGridProps['columns']>, string>;

export function CommissionMetricGrid({
  children,
  columns = 4,
  className,
}: CommissionMetricGridProps) {
  return (
    <div
      className={[
        'grid',
        'grid-cols-1',
        'gap-4',
        columnClasses[columns],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}