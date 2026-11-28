
import type {
  AdminJourneyCompletionMetrics,
} from '@/features/admin/journey-completion/models';

import type {
  AdminJourneyCompletionActivityItem,
} from '@/features/admin/journey-completion/hooks';

import { JourneyCompletionMetricGrid } from './JourneyCompletionMetricGrid';
import { JourneyCompletionStatusDistribution } from './JourneyCompletionStatusDistribution';
import { JourneyCompletionVolumeSummary } from './JourneyCompletionVolumeSummary';
import { JourneyCompletionRecentActivity } from './JourneyCompletionRecentActivity';
import { JourneyCompletionPerformanceSummary } from './JourneyCompletionPerformanceSummary';

export interface JourneyCompletionOverviewProps {
  metrics: AdminJourneyCompletionMetrics;
  activity?: AdminJourneyCompletionActivityItem[];
  className?: string;
}

export function JourneyCompletionOverview({
  metrics,
  activity = [],
  className,
}: JourneyCompletionOverviewProps) {
  const headlineMetrics = [
    {
      label: 'Total completions',
      value: metrics.totalCompletions.toLocaleString(),
      description: 'Completion records in this dataset',
      tone: 'brand' as const,
    },
    {
      label: 'Pending',
      value: metrics.pendingCount.toLocaleString(),
      description: 'Not yet requested or confirmed',
      tone: 'default' as const,
    },
    {
      label: 'Confirmed',
      value: metrics.confirmedCount.toLocaleString(),
      description: 'Successfully confirmed',
      tone: 'success' as const,
    },
    {
      label: 'Disputed',
      value: metrics.disputedCount.toLocaleString(),
      description: 'Require dispute attention',
      tone: 'danger' as const,
    },
  ];

  return (
    <section
      className={className}
      aria-label="Journey completion overview"
    >
      <div className="space-y-6">
        <JourneyCompletionMetricGrid metrics={headlineMetrics} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <JourneyCompletionStatusDistribution metrics={metrics} />
          <JourneyCompletionVolumeSummary metrics={metrics} />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <JourneyCompletionPerformanceSummary metrics={metrics} />
          <JourneyCompletionRecentActivity activity={activity} />
        </div>
      </div>
    </section>
  );
}
