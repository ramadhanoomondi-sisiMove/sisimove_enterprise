
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Overview
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Compose the Payment Methods overview.
 * - Reuse shared loading, error, and empty-state components.
 * - Delegate metrics and distributions to their dedicated components.
 * - Consume the canonical AdminPaymentMethodMetricsOverview model.
 * -----------------------------------------------------------------------------
 */

import { EmptyState } from '@/components/ui';

import {
  PaymentMethodEmptyState,
  PaymentMethodErrorState,
  PaymentMethodLoadingState,
} from '../shared';

import { PaymentMethodActivitySummary } from './PaymentMethodActivitySummary';
import { PaymentMethodMetricGrid } from './PaymentMethodMetricGrid';
import { PaymentMethodProviderDistribution } from './PaymentMethodProviderDistribution';
import { PaymentMethodTypeDistribution } from './PaymentMethodTypeDistribution';

import type { AdminPaymentMethodMetricsOverview } from '@/features/admin/finance/payment-methods';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PaymentMethodOverviewProps {
  overview: AdminPaymentMethodMetricsOverview | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodOverview({
  overview,
  isLoading = false,
  error,
  onRetry,
  className,
}: PaymentMethodOverviewProps) {
  if (isLoading) {
    return <PaymentMethodLoadingState />;
  }

  if (error) {
    return (
      <PaymentMethodErrorState
        title="Unable to load payment method overview"
        description={error}
        onRetry={onRetry}
      />
    );
  }

  if (!overview) {
    return (
      <PaymentMethodEmptyState
        title="Overview unavailable"
        description="Payment method overview data is not available yet."
      />
    );
  }

  const hasAnyData =
    overview.summary.total > 0 ||
    overview.byType.length > 0 ||
    overview.byProvider.length > 0 ||
    overview.activity.length > 0;

  if (!hasAnyData) {
    return (
      <EmptyState
        title="No payment method data yet"
        description="Overview metrics and distributions will appear here when payment methods are registered."
      />
    );
  }

  return (
    <div className={['min-w-0 space-y-6', className].filter(Boolean).join(' ')}>
      <PaymentMethodMetricGrid metrics={overview.summary} />

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        <PaymentMethodTypeDistribution items={overview.byType} />
        <PaymentMethodProviderDistribution items={overview.byProvider} />
      </div>

      <PaymentMethodActivitySummary
        metrics={overview.summary}
        activity={overview.activity}
      />
    </div>
  );
}

export default PaymentMethodOverview;
