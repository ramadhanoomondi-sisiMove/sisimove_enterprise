
'use client';

import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Route,
  Users,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import type {
  JourneyActivityMetrics,
  JourneyLifecycleMetrics,
  JourneyMetricComparison,
  JourneyOperationsMetrics,
} from '@/features/admin/journeys/models/journey-metrics.model';

import JourneyActivityOverview from './JourneyActivityOverview';
import JourneyLifecycleSummary from './JourneyLifecycleSummary';
import JourneyMetricCard from './JourneyMetricCard';
import JourneyOperationsHealth from './JourneyOperationsHealth';

interface JourneyOverviewDashboardProps {
  lifecycle: JourneyLifecycleMetrics;
  operations: JourneyOperationsMetrics;
  activity: JourneyActivityMetrics;
  comparisons?: {
    totalJourneys?: JourneyMetricComparison;
    publishedJourneys?: JourneyMetricComparison;
    completedToday?: JourneyMetricComparison;
    bookedSeats?: JourneyMetricComparison;
  };
  generatedAt?: string | Date;
  onStatusSelect?: (status: string) => void;
  className?: string;
}

function formatGeneratedAt(value?: string | Date): string | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function JourneyOverviewDashboard({
  lifecycle,
  operations,
  activity,
  comparisons,
  generatedAt,
  onStatusSelect,
  className,
}: JourneyOverviewDashboardProps) {
  const updatedLabel = formatGeneratedAt(generatedAt);

  const metricCards = [
    {
      title: 'Total journeys',
      value: lifecycle.total,
      description: 'Across all journey statuses',
      icon: <Route className="size-5" aria-hidden="true" />,
      comparison: comparisons?.totalJourneys,
      comparisonLabel: 'vs. previous period',
    },
    {
      title: 'Published journeys',
      value: lifecycle.byStatus.PUBLISHED ?? 0,
      description: 'Available for booking',
      icon: <CalendarDays className="size-5" aria-hidden="true" />,
      comparison: comparisons?.publishedJourneys,
      comparisonLabel: 'vs. previous period',
    },
    {
      title: 'Booked seats',
      value: operations.bookedSeats,
      description: `${operations.availableSeats.toLocaleString()} seats available`,
      icon: <Users className="size-5" aria-hidden="true" />,
      comparison: comparisons?.bookedSeats,
      comparisonLabel: 'vs. previous period',
    },
    {
      title: 'Completed today',
      value: activity.completedToday,
      description: 'Journeys completed today',
      icon: <CheckCircle2 className="size-5" aria-hidden="true" />,
      comparison: comparisons?.completedToday,
      comparisonLabel: 'vs. previous period',
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <section
        aria-labelledby="journey-overview-heading"
        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-soft)]">
              <Activity
                aria-hidden="true"
                className="size-5 text-[var(--brand)]"
              />
            </div>

            <div>
              <h2
                id="journey-overview-heading"
                className="text-lg font-semibold tracking-tight text-[var(--foreground)]"
              >
                Journey overview
              </h2>

              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                A consolidated view of journey activity and operations across
                all providers.
              </p>
            </div>
          </div>

          {updatedLabel && (
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-3 py-1.5 text-xs text-[var(--foreground-muted)] sm:self-center">
              <Clock3 aria-hidden="true" className="size-3.5" />
              Updated {updatedLabel}
            </div>
          )}
        </div>
      </section>

      <section aria-label="Key journey metrics">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Key metrics
          </h3>

          <span className="text-xs text-[var(--foreground-muted)]">
            Current snapshot
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => (
            <JourneyMetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              description={metric.description}
              icon={metric.icon}
              comparison={metric.comparison}
              comparisonLabel={metric.comparisonLabel}
            />
          ))}
        </div>
      </section>

      <section aria-label="Journey lifecycle">
        <JourneyLifecycleSummary
          metrics={lifecycle}
          onStatusSelect={onStatusSelect}
        />
      </section>

      <section aria-label="Journey operations">
        <JourneyOperationsHealth metrics={operations} />
      </section>

      <section aria-label="Daily journey activity">
        <JourneyActivityOverview metrics={activity} />
      </section>
    </div>
  );
}
