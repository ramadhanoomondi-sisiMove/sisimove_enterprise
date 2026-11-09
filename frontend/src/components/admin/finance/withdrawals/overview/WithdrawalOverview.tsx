
'use client';

import { Card } from '@/components/ui';

import { useAdminWithdrawalMetrics } from '@/features/admin/finance/withdrawals/hooks/useAdminWithdrawalMetrics';
import { useAdminWithdrawals } from '@/features/admin/finance/withdrawals/hooks/useAdminWithdrawals';

import { WithdrawalEmptyState } from '../shared/WithdrawalEmptyState';
import { WithdrawalErrorState } from '../shared/WithdrawalErrorState';
import { WithdrawalLoadingState } from '../shared/WithdrawalLoadingState';

import { WithdrawalAmountSummary } from './WithdrawalAmountSummary';
import { WithdrawalMetricGrid } from './WithdrawalMetricGrid';
import { WithdrawalRecentActivity } from './WithdrawalRecentActivity';
import { WithdrawalStatusDistribution } from './WithdrawalStatusDistribution';

export interface WithdrawalOverviewProps {
  className?: string;
}

export function WithdrawalOverview({
  className,
}: WithdrawalOverviewProps) {
  const {
    metrics,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminWithdrawalMetrics();

  const {
    allWithdrawals,
  } = useAdminWithdrawals();

  if (isLoading) {
    return <WithdrawalLoadingState rows={5} />;
  }

  if (isError) {
    return (
      <WithdrawalErrorState
        title="Unable to load withdrawal overview"
        description={
          error instanceof Error
            ? error.message
            : 'There was a problem retrieving withdrawal information.'
        }
        onRetry={() => void refetch()}
      />
    );
  }

  const metricItems = [
    {
      key: 'total',
      label: 'Total Withdrawals',
      value: metrics.totalWithdrawals.toLocaleString('en-KE'),
      description: 'All recorded withdrawal requests',
    },
    {
      key: 'pending',
      label: 'Pending',
      value: metrics.statusCounts.PENDING.toLocaleString('en-KE'),
      description: 'Awaiting processing',
    },
    {
      key: 'processing',
      label: 'Processing',
      value: metrics.statusCounts.PROCESSING.toLocaleString('en-KE'),
      description: 'Currently being processed',
    },
    {
      key: 'completed',
      label: 'Completed',
      value: metrics.statusCounts.COMPLETED.toLocaleString('en-KE'),
      description: 'Successfully completed',
    },
  ] as const;

  const hasWithdrawals = metrics.totalWithdrawals > 0;

  return (
    <div className={['space-y-6', className].filter(Boolean).join(' ')}>
      <WithdrawalMetricGrid items={metricItems} />

      {!hasWithdrawals ? (
        <Card>
          <WithdrawalEmptyState
            title="No withdrawals recorded"
            description="Withdrawal metrics and activity will appear here when withdrawal requests are recorded."
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <WithdrawalStatusDistribution metrics={metrics} />
            <WithdrawalAmountSummary metrics={metrics} />
          </div>

          <WithdrawalRecentActivity withdrawals={allWithdrawals} />
        </>
      )}
    </div>
  );
}

export default WithdrawalOverview;
