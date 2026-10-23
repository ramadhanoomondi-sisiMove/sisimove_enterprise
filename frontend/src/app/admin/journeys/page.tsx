
'use client';

import { useMemo } from 'react';

import JourneyOverviewDashboard from '@/components/admin/journeys/overview/JourneyOverviewDashboard';
import JourneyDirectory from '@/components/admin/journeys/directory/JourneyDirectory';

import {
  JourneyControlCenterHeader,
  JourneyPageContainer,
  JourneySectionHeader,
} from '@/components/admin/journeys/layout';

import { useAllDetailedJourneys } from '@/features/admin/journeys/hooks/useJourneys';

import type { MappedJourney } from '@/features/admin/journeys/mappers/journey.mapper';

import type {
  JourneyActivityMetrics,
  JourneyLifecycleMetrics,
  JourneyOperationsMetrics,
} from '@/features/admin/journeys/models/journey-metrics.model';

import {
  JOURNEY_STATUSES,
  toJourneyStatus,
} from '@/features/admin/journeys/utils/journey-status';

const EMPTY_JOURNEYS: MappedJourney[] = [];

function getNairobiDateKey(value: string | Date): string | null {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value;

  const year = get('year');
  const month = get('month');
  const day = get('day');

  return year && month && day ? `${year}-${month}-${day}` : null;
}

function isToday(value: string | null | undefined, today: string): boolean {
  return Boolean(value && getNairobiDateKey(value) === today);
}

function buildJourneyMetrics(journeys: MappedJourney[]) {
  const today = getNairobiDateKey(new Date())!;

  const lifecycle: JourneyLifecycleMetrics = {
    total: journeys.length,
    byStatus: Object.fromEntries(
      JOURNEY_STATUSES.map((status) => [
        status,
        journeys.filter(
          (journey) => toJourneyStatus(journey.status) === status,
        ).length,
      ]),
    ),
  };

  const operations: JourneyOperationsMetrics = journeys.reduce(
    (totals, journey) => {
      const capacity = journey.capacity;
      const status = toJourneyStatus(journey.status);

      totals.totalSeats += capacity?.totalSeats ?? 0;
      totals.bookedSeats += capacity?.bookedSeats ?? 0;
      totals.availableSeats += capacity?.availableSeats ?? 0;

      if (
        status === 'FULL' ||
        (capacity != null &&
          capacity.totalSeats > 0 &&
          capacity.availableSeats <= 0)
      ) {
        totals.journeysAtCapacity += 1;
      }

      if (status === 'IN_PROGRESS') {
        totals.journeysInProgress += 1;
      }

      if (status === 'COMPLETION_PENDING') {
        totals.journeysAwaitingCompletion += 1;
      }

      return totals;
    },
    {
      totalSeats: 0,
      bookedSeats: 0,
      availableSeats: 0,
      journeysAtCapacity: 0,
      journeysInProgress: 0,
      journeysAwaitingCompletion: 0,
    },
  );

  const activity: JourneyActivityMetrics = journeys.reduce(
    (totals, journey) => {
      if (isToday(journey.createdAt, today)) {
        totals.createdToday += 1;
      }

      if (isToday(journey.publishedAt, today)) {
        totals.publishedToday += 1;
      }

      if (isToday(journey.startedAt, today)) {
        totals.startedToday += 1;
      }

      if (isToday(journey.completedAt, today)) {
        totals.completedToday += 1;
      }

      if (isToday(journey.cancelledAt, today)) {
        totals.cancelledToday += 1;
      }

      return totals;
    },
    {
      createdToday: 0,
      publishedToday: 0,
      startedToday: 0,
      completedToday: 0,
      cancelledToday: 0,
    },
  );

  return {
    lifecycle,
    operations,
    activity,
    generatedAt: new Date().toISOString(),
  };
}

export default function AdminJourneysPage() {
  const journeysQuery = useAllDetailedJourneys();

  const journeys = journeysQuery.data ?? EMPTY_JOURNEYS;

  const metrics = useMemo(
    () => buildJourneyMetrics(journeys),
    [journeys],
  );

  return (
    <JourneyPageContainer width="wide" spacing="relaxed">
      <div className="space-y-8">
        <JourneyControlCenterHeader
          eyebrow="Operations"
          title="Journey Control Center"
          description="Monitor journey lifecycle, seat capacity, operational activity, and journey records across all providers."
        />

        {journeysQuery.isPending ? (
          <section
            aria-live="polite"
            className="rounded-2xl border border-[var(--border)] p-6"
          >
            <p className="text-sm text-[var(--foreground-muted)]">
              Loading journey metrics…
            </p>
          </section>
        ) : journeysQuery.isError ? (
          <section
            role="alert"
            className="space-y-3 rounded-2xl border border-[var(--border)] p-6"
          >
            <h2 className="font-semibold">
              Unable to load journey metrics
            </h2>

            <p className="text-sm text-[var(--foreground-muted)]">
              The platform-wide journey request failed. Retry to reload the data.
            </p>

            <button
              type="button"
              onClick={() => void journeysQuery.refetch()}
              disabled={journeysQuery.isFetching}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {journeysQuery.isFetching ? 'Retrying…' : 'Retry'}
            </button>
          </section>
        ) : (
          <JourneyOverviewDashboard
            lifecycle={metrics.lifecycle}
            operations={metrics.operations}
            activity={metrics.activity}
            generatedAt={metrics.generatedAt}
          />
        )}

        <section className="space-y-5">
          <JourneySectionHeader
            title="Journey Directory"
            description="Search, filter, and inspect journeys across all providers."
          />

          {!journeysQuery.isPending && !journeysQuery.isError && (
            <JourneyDirectory />
          )}
        </section>
      </div>
    </JourneyPageContainer>
  );
}
