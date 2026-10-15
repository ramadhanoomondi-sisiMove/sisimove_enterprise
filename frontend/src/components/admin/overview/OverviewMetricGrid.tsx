
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Overview Metric Grid
 * -----------------------------------------------------------------------------
 *
 * Responsive metric grid for the Admin Overview dashboard.
 *
 * Responsibilities:
 *
 * - present the platform's aggregate metrics in a consistent grid;
 * - map AdminOverviewModel values to individual metric cards;
 * - provide clear labels and supporting descriptions;
 * - adapt the layout to different screen sizes;
 * - leave metric fetching and refresh behaviour to the hooks.
 *
 * Architectural boundaries:
 *
 * - This component does not fetch API data.
 * - It does not calculate backend metrics.
 * - It does not fabricate historical trends.
 * - It consumes the AdminOverviewModel supplied by its parent.
 *
 * -----------------------------------------------------------------------------
 */

import {
  type BadgeVariant,
} from '@/components/ui';

import type { AdminOverviewModel } from '@/features/admin/overview/models/admin-overview.model';

import OverviewMetricCard from './OverviewMetricCard';


// =============================================================================
// Types
// =============================================================================

export interface OverviewMetricGridProps {
  /**
   * Loaded aggregate metrics from the Admin Overview feature.
   */
  metrics: AdminOverviewModel;

  /**
   * Optional callback for when a metric card is selected.
   *
   * The parent decides how each metric should navigate.
   */
  onMetricClick?: (metricId: OverviewMetricId) => void;

  /**
   * Optional additional CSS classes.
   */
  className?: string;

  /**
   * Number of grid columns at larger screen widths.
   */
  columns?: 2 | 3 | 4;
}

export type OverviewMetricId =
  | 'totalMembers'
  | 'pendingVerifications'
  | 'activeJourneys'
  | 'totalBookings'
  | 'totalBoardingParticipants'
  | 'pendingJourneyCompletions'
  | 'pendingJourneySettlements'
  | 'totalFinancialPayments';


// =============================================================================
// Metric Presentation
// =============================================================================

interface MetricDefinition {
  id: OverviewMetricId;
  title: string;
  description: string;
  value: number;
  badgeLabel?: string;
  badgeVariant?: BadgeVariant;
}

function createMetricDefinitions(
  metrics: AdminOverviewModel,
): MetricDefinition[] {
  return [
    {
      id: 'totalMembers',
      title: 'Total members',
      description: 'Registered platform identities',
      value: metrics.totalMembers,
    },
    {
      id: 'pendingVerifications',
      title: 'Pending verifications',
      description: 'Verification records awaiting review',
      value: metrics.pendingVerifications,
      badgeLabel:
        metrics.pendingVerifications > 0 ? 'Needs attention' : 'All clear',
      badgeVariant:
        metrics.pendingVerifications > 0 ? 'warning' : 'success',
    },
    {
      id: 'activeJourneys',
      title: 'Active journeys',
      description: 'Journeys in active operational statuses',
      value: metrics.activeJourneys,
    },
    {
      id: 'totalBookings',
      title: 'Total bookings',
      description: 'All journey booking records',
      value: metrics.totalBookings,
    },
    {
      id: 'totalBoardingParticipants',
      title: 'Boarding participants',
      description: 'Participants across all journey boardings',
      value: metrics.totalBoardingParticipants,
    },
    {
      id: 'pendingJourneyCompletions',
      title: 'Pending completions',
      description: 'Journey completions awaiting processing',
      value: metrics.pendingJourneyCompletions,
      badgeLabel:
        metrics.pendingJourneyCompletions > 0
          ? 'Needs attention'
          : 'All clear',
      badgeVariant:
        metrics.pendingJourneyCompletions > 0 ? 'warning' : 'success',
    },
    {
      id: 'pendingJourneySettlements',
      title: 'Pending settlements',
      description: 'Journey settlements awaiting processing',
      value: metrics.pendingJourneySettlements,
      badgeLabel:
        metrics.pendingJourneySettlements > 0
          ? 'Needs attention'
          : 'All clear',
      badgeVariant:
        metrics.pendingJourneySettlements > 0 ? 'warning' : 'success',
    },
    {
      id: 'totalFinancialPayments',
      title: 'Financial payments',
      description: 'All financial payment records',
      value: metrics.totalFinancialPayments,
    },
  ];
}


// =============================================================================
// Overview Metric Grid
// =============================================================================

export default function OverviewMetricGrid({
  metrics,
  onMetricClick,
  className,
  columns = 4,
}: OverviewMetricGridProps) {
  const metricDefinitions = createMetricDefinitions(metrics);

  const columnClasses = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 xl:grid-cols-3',
    4: 'sm:grid-cols-2 xl:grid-cols-4',
  }[columns];

  return (
    <section
      aria-label="Platform overview metrics"
      className={className}
    >
      <div
        className={[
          'grid',
          'grid-cols-1',
          'gap-4',
          columnClasses,
        ].join(' ')}
      >
        {metricDefinitions.map((metric) => (
          <OverviewMetricCard
            key={metric.id}
            id={`overview-metric-${metric.id}`}
            title={metric.title}
            value={metric.value.toLocaleString()}
            description={metric.description}
            badge={
              metric.badgeLabel
                ? {
                    label: metric.badgeLabel,
                    variant: metric.badgeVariant,
                  }
                : undefined
            }
            onClick={
              onMetricClick
                ? () => onMetricClick(metric.id)
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
