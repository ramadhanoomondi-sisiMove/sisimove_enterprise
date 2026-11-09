/**
 * SisiMove Admin — Withdrawal Metric Grid
 *
 * Composes reusable metric cards into a responsive grid.
 */

import type { ReactNode } from 'react';

import { WithdrawalMetricCard } from './WithdrawalMetricCard';

export interface WithdrawalMetricItem {
  key: string;
  label: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
}

export interface WithdrawalMetricGridProps {
  items: readonly WithdrawalMetricItem[];
  className?: string;
}

export function WithdrawalMetricGrid({
  items,
  className,
}: WithdrawalMetricGridProps) {
  return (
    <div
      className={[
        'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item) => (
        <WithdrawalMetricCard
          key={item.key}
          label={item.label}
          value={item.value}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </div>
  );
}