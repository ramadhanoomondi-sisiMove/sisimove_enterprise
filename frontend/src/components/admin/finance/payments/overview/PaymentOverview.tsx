// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Overview
// -----------------------------------------------------------------------------
//
// Composes the payment overview sections.
// Receives metrics and activity data from its parent; performs no fetching.
// -----------------------------------------------------------------------------

import {
  Activity,
  CheckCircle2,
  Clock3,
  CreditCard,
  XCircle,
} from 'lucide-react';

import type {
  AdminFinancialPaymentMetrics,
  AdminFinancialPaymentReference,
} from '@/features/admin/finance/payments';

import { PaymentMetricGrid } from './PaymentMetricGrid';
import { PaymentStatusDistribution } from './PaymentStatusDistribution';
import { PaymentVolumeChart } from './PaymentVolumeChart';
import { PaymentActivitySummary } from './PaymentActivitySummary';

export interface PaymentOverviewProps {
  metrics: AdminFinancialPaymentMetrics;
  recentPayments: AdminFinancialPaymentReference[];
  activityHref?: string;
  className?: string;
}

export function PaymentOverview({
  metrics,
  recentPayments,
  activityHref = '/admin/finance/payments',
  className,
}: PaymentOverviewProps) {
  const metricItems = [
    {
      id: 'total-payments',
      label: 'Total payments',
      value: metrics.totalPayments.toLocaleString(),
      description: 'Payments in the metrics reporting scope.',
      icon: <CreditCard aria-hidden="true" className="h-5 w-5" />,
    },
    {
      id: 'succeeded-payments',
      label: 'Succeeded',
      value: metrics.succeededPayments.toLocaleString(),
      description: 'Payments recorded as succeeded.',
      icon: <CheckCircle2 aria-hidden="true" className="h-5 w-5" />,
    },
    {
      id: 'in-progress-payments',
      label: 'Pending and processing',
      value: (
        metrics.pendingPayments + metrics.processingPayments
      ).toLocaleString(),
      description: 'Payments awaiting completion.',
      icon: <Clock3 aria-hidden="true" className="h-5 w-5" />,
    },
    {
      id: 'failed-payments',
      label: 'Failed',
      value: metrics.failedPayments.toLocaleString(),
      description: 'Payments recorded as failed.',
      icon: <XCircle aria-hidden="true" className="h-5 w-5" />,
    },
  ];

  return (
    <div className={['space-y-6', className ?? ''].join(' ')}>
      <PaymentMetricGrid metrics={metricItems} columns={4} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PaymentStatusDistribution
          counts={metrics.paymentCountsByStatus}
        />

        <PaymentVolumeChart
          data={metrics.trend}
        />
      </div>

      <PaymentActivitySummary
        payments={recentPayments}
        viewAllHref={activityHref}
      />

      <p className="flex items-start gap-2 text-xs leading-5 text-[var(--foreground-muted)]">
        <Activity aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        {metrics.generatedAt
          ? `Metrics generated ${new Intl.DateTimeFormat(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(metrics.generatedAt))}.`
          : 'Metrics reporting timestamp has not been provided.'}
      </p>
    </div>
  );
}

export default PaymentOverview;