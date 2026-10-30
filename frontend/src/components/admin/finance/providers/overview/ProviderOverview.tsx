"use client";
import {
  ProviderEmptyState,
  ProviderErrorState,
  ProviderLoadingState,
} from '../shared';

import { useAdminProviderMetrics } from '@/features/admin/finance/providers';

import { ProviderMetricGrid } from './ProviderMetricGrid';
import { ProviderTypeDistribution } from './ProviderTypeDistribution';
import { ProviderEnvironmentDistribution } from './ProviderEnvironmentDistribution';
import { ProviderStatusDistribution } from './ProviderStatusDistribution';
import { ProviderCapabilitySummary } from './ProviderCapabilitySummary';
import { ProviderOperationalSummary } from './ProviderOperationalSummary';

import { ProviderSectionHeader } from '../layout';

import { cn } from '@/foundation/utils/cn';

export interface ProviderOverviewProps {
  className?: string;
}

export function ProviderOverview({
  className,
}: ProviderOverviewProps) {
  const {
    metrics,
    providers,
    isLoading,
    isError,
    refetch,
  } = useAdminProviderMetrics();

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <ProviderLoadingState className="h-8 w-56" />
        <ProviderLoadingState className="h-32 w-full" />
        <ProviderLoadingState className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <ProviderErrorState
        title="Unable to load provider overview"
        description="The payment provider metrics could not be loaded."
        retryAction={{
          label: 'Try again',
          onClick: () => {
            void refetch();
          },
        }}
      />
    );
  }

  if (providers.length === 0) {
    return (
      <ProviderEmptyState
        title="No payment providers yet"
        description="Add a payment provider to start monitoring integrations, operational readiness, and capabilities."
      />
    );
  }

  return (
    <section className={cn('space-y-6', className)}>
      <ProviderSectionHeader
        title="Provider Overview"
        description="Monitor provider availability, integration status, environments, and capabilities."
      />

      <ProviderMetricGrid metrics={metrics} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ProviderTypeDistribution
          distribution={metrics.providersByType}
        />

        <ProviderEnvironmentDistribution
          distribution={metrics.providersByEnvironment}
        />

        <ProviderStatusDistribution
          distribution={metrics.providersByStatus}
        />

        <ProviderOperationalSummary
          metrics={metrics}
        />
      </div>

      <ProviderCapabilitySummary metrics={metrics} />
    </section>
  );
}
