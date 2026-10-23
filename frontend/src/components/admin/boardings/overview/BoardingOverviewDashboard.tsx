// src/features/admin/boardings/overview/BoardingOverviewDashboard.tsx

import {
  Activity,
  CalendarCheck,
  ClipboardList,
  Users,
  XCircle,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import type {
  AdminBoardingMetrics,
} from '@/features/admin/boardings';

import { BoardingMetricCard } from './BoardingMetricCard';
import { BoardingLifecycleSummary } from './BoardingLifecycleSummary';
import { BoardingParticipantOverview } from './BoardingParticipantOverview';

export interface BoardingOverviewDashboardProps {
  metrics: AdminBoardingMetrics;
  className?: string;
}

export function BoardingOverviewDashboard({
  metrics,
  className,
}: BoardingOverviewDashboardProps) {
  return (
    <div className={cn('space-y-8', className)}>
      <section
        aria-label="Boarding key performance indicators"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <BoardingMetricCard
          label="Total boardings"
          value={metrics.totalBoardings}
          description="All boarding records"
          icon={<ClipboardList className="h-5 w-5" />}
          accent="brand"
        />

        <BoardingMetricCard
          label="Total participants"
          value={metrics.totalParticipants}
          description="Participants across boarding records"
          icon={<Users className="h-5 w-5" />}
          accent="default"
        />

        <BoardingMetricCard
          label="Total boarding events"
          value={metrics.totalEvents}
          description="Recorded boarding lifecycle events"
          icon={<Activity className="h-5 w-5" />}
          accent="default"
        />

        <BoardingMetricCard
          label="Created today"
          value={metrics.boardingsCreatedToday}
          description="Boarding records created today"
          icon={<CalendarCheck className="h-5 w-5" />}
          accent="brand"
        />

        <BoardingMetricCard
          label="Journeys started today"
          value={metrics.boardingsStartedToday}
          description="Boardings whose journeys started today"
          icon={<Activity className="h-5 w-5" />}
          accent="success"
        />

        <BoardingMetricCard
          label="Cancelled today"
          value={metrics.boardingsCancelledToday}
          description="Boardings cancelled today"
          icon={<XCircle className="h-5 w-5" />}
          accent="danger"
        />
      </section>

      <BoardingLifecycleSummary
        statusCounts={metrics.statusCounts}
      />

      <BoardingParticipantOverview
        totalParticipants={metrics.totalParticipants}
        participantStatusCounts={metrics.participantStatusCounts}
      />

      {metrics.lastUpdatedAt && (
        <p className="text-right text-xs text-[var(--foreground-muted)]">
          Metrics updated{' '}
          {new Date(metrics.lastUpdatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
