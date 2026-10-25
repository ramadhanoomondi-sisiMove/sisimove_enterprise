
import {
  Activity,
  CheckCircle2,
  CircleX,
  Clock3,
  RotateCcw,
  Wallet,
  Ban,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import type { AdminFinancialTransactionMetrics } from '@/features/admin/finance/transactions';


import { TransactionMetricCard } from './TransactionMetricCard';
import { TransactionStatusSummary } from './TransactionStatusSummary';
import { TransactionVolumeSummary } from './TransactionVolumeSummary';

export interface TransactionOverviewProps {
  metrics: AdminFinancialTransactionMetrics;
  className?: string;
}

export function TransactionOverview({
  metrics,
  className,
}: TransactionOverviewProps) {
  const cards = [
    {
      label: 'Total transactions',
      value: metrics.totalTransactions,
      description: 'Transactions in the current metrics scope',
      icon: <Activity className="h-5 w-5" />,
      tone: 'brand' as const,
    },
    {
      label: 'Completed',
      value: metrics.completedTransactions,
      description: 'Successfully completed transactions',
      icon: <CheckCircle2 className="h-5 w-5" />,
      tone: 'success' as const,
    },
    {
      label: 'Pending',
      value: metrics.pendingTransactions,
      description: 'Awaiting a final outcome',
      icon: <Clock3 className="h-5 w-5" />,
      tone: 'warning' as const,
    },
    {
      label: 'Failed',
      value: metrics.failedTransactions,
      description: 'Transactions that failed',
      icon: <CircleX className="h-5 w-5" />,
      tone: 'danger' as const,
    },
    {
      label: 'Reversed',
      value: metrics.reversedTransactions,
      description: 'Transactions that were reversed',
      icon: <RotateCcw className="h-5 w-5" />,
      tone: 'default' as const,
    },
    {
      label: 'Cancelled',
      value: metrics.cancelledTransactions,
      description: 'Transactions that were cancelled',
      icon: <Ban className="h-5 w-5" />,
      tone: 'default' as const,
    },
  ];

  return (
    <section
      aria-label="Financial transaction overview"
      className={cn('space-y-6', className)}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <TransactionMetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            description={card.description}
            icon={card.icon}
            tone={card.tone}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TransactionStatusSummary metrics={metrics} />
        <TransactionVolumeSummary metrics={metrics} />
      </div>

      <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
        <Wallet
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--foreground-muted)]"
        />
        <div>
          <p className="text-sm font-medium text-[var(--foreground-secondary)]">
            Metrics scope
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
            {metrics.scope === 'ALL_MATCHING'
              ? 'These metrics represent all transactions matching the metrics query.'
              : 'These metrics represent the current page only, not the entire transaction collection.'}
          </p>
          <p className="mt-1 text-xs text-[var(--foreground-subtle)]">
            Calculated at{' '}
            {Number.isNaN(Date.parse(metrics.calculatedAt))
              ? 'an unknown time'
              : new Intl.DateTimeFormat('en-KE', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(metrics.calculatedAt))}
          </p>
        </div>
      </div>
    </section>
  );
}

export default TransactionOverview;
