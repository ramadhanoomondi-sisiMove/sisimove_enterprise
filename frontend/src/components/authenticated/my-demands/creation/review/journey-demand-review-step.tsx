'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Review Step
// -----------------------------------------------------------------------------
//
// Final review surface before publishing a Journey Demand.
//
// Responsibilities:
// - Read the saved Journey Demand components.
// - Present a concise review of the complete request.
// - Publish the existing DRAFT aggregate.
//
// This component does not create or mutate individual components. All previous
// creation steps must already have persisted their data.
//
// Publishing is the lifecycle transition from DRAFT → OPEN.
// -----------------------------------------------------------------------------

import { useMemo } from 'react';

import { Badge, Button, Card, Divider, Spinner } from '@/components/ui';
import {
  useJourneyDemandCapacity,
  useJourneyDemandCorridor,
  useJourneyDemandPricing,
  useJourneyDemandSchedule,
  useJourneyDemandWaypoints,
  usePublishJourneyDemand,
} from '@/features/journey-demand/hooks';
import type {
  JourneyDemandPricing,
  JourneyDemandSchedule,
  JourneyDemandWaypoint,
} from '@/features/journey-demand/models';

export interface JourneyDemandReviewStepProps {
  journeyDemandPublicId: string;
  onPublished?: () => void;
}

interface CorridorData {
  origin?: {
    name?: string | null;
  } | null;
  destination?: {
    name?: string | null;
  } | null;
}

interface CapacityData {
  requestedSeats?: number | null;
  matchedSeats?: number | null;
}

function extractItems<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (
    value &&
    typeof value === 'object' &&
    'items' in value &&
    Array.isArray((value as { items?: unknown }).items)
  ) {
    return (value as { items: T[] }).items;
  }

  return [];
}

function formatDateTime(value?: string | null): string {
  if (!value) {
    return 'Not set';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-KE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatMoney(
  amount?: number | null,
  currency = 'KES',
): string {
  if (amount === undefined || amount === null) {
    return 'Not set';
  }

  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function waypointTypeLabel(
  type: JourneyDemandWaypoint['type'],
): string {
  switch (type) {
    case 'PICKUP':
      return 'Pickup';
    case 'DROPOFF':
      return 'Drop-off';
    case 'WAYPOINT':
      return 'Stop';
    case 'ORIGIN':
      return 'Origin';
    case 'DESTINATION':
      return 'Destination';
    default:
      return type;
  }
}

export function JourneyDemandReviewStep({
  journeyDemandPublicId,
  onPublished,
}: JourneyDemandReviewStepProps) {
  const {
    data: corridor,
    isLoading: isCorridorLoading,
  } = useJourneyDemandCorridor(journeyDemandPublicId);

  const {
    data: waypointData,
    isLoading: isWaypointsLoading,
  } = useJourneyDemandWaypoints(journeyDemandPublicId);

  const {
    data: schedule,
    isLoading: isScheduleLoading,
  } = useJourneyDemandSchedule(journeyDemandPublicId);

  const {
    data: capacity,
    isLoading: isCapacityLoading,
  } = useJourneyDemandCapacity(journeyDemandPublicId);

  const {
    data: pricing,
    isLoading: isPricingLoading,
  } = useJourneyDemandPricing(journeyDemandPublicId);

  const publishMutation = usePublishJourneyDemand();

  const waypoints = useMemo(
    () => extractItems<JourneyDemandWaypoint>(waypointData),
    [waypointData],
  );

  const orderedWaypoints = useMemo(
    () =>
      [...waypoints].sort(
        (first, second) => first.sequence - second.sequence,
      ),
    [waypoints],
  );

  const corridorData = corridor as CorridorData | undefined;
  const capacityData = capacity as CapacityData | undefined;
  const scheduleData = schedule as JourneyDemandSchedule | undefined;
  const pricingData = pricing as JourneyDemandPricing | undefined;

  const isLoading =
    isCorridorLoading ||
    isWaypointsLoading ||
    isScheduleLoading ||
    isCapacityLoading ||
    isPricingLoading;

  const origin = corridorData?.origin?.name ?? 'Not set';
  const destination =
    corridorData?.destination?.name ?? 'Not set';

  const currency = pricingData?.currency ?? 'KES';

  const handlePublish = () => {
    publishMutation.mutate(
      {
        journeyDemandPublicId,
      },
      {
        onSuccess: () => {
          onPublished?.();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div
        className="flex min-h-64 items-center justify-center"
        aria-live="polite"
        aria-busy="true"
      >
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Step 5 of 5
        </p>

        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          Review your journey demand
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Check your request before publishing it to the sisiMove
          journey market.
        </p>
      </div>

      <Card padding="md" variant="default">
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Route
              </p>

              <h2 className="mt-1 text-base font-semibold text-slate-950">
                {origin}
                <span
                  aria-hidden="true"
                  className="mx-2 text-slate-400"
                >
                  →
                </span>
                {destination}
              </h2>
            </div>

            <Badge size="sm" variant="default">
              Draft
            </Badge>
          </div>

          <Divider />

          <section aria-labelledby="review-route-heading">
            <h3
              id="review-route-heading"
              className="text-sm font-semibold text-slate-900"
            >
              Route
            </h3>

            {orderedWaypoints.length > 0 ? (
              <div className="mt-3 space-y-2">
                {orderedWaypoints.map((waypoint) => (
                  <div
                    key={waypoint.publicId}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0 truncate text-slate-700">
                      {waypoint.name}
                    </span>

                    <Badge size="sm" variant="default">
                      {waypointTypeLabel(waypoint.type)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                No additional stops.
              </p>
            )}
          </section>

          <Divider />

          <section aria-labelledby="review-schedule-heading">
            <h3
              id="review-schedule-heading"
              className="text-sm font-semibold text-slate-900"
            >
              Schedule
            </h3>

            <dl className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">
                  Earliest departure
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">
                  {formatDateTime(
                    scheduleData?.earliestDeparture,
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-slate-500">
                  Latest departure
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">
                  {formatDateTime(
                    scheduleData?.latestDeparture,
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-slate-500">
                  Target arrival
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">
                  {formatDateTime(scheduleData?.targetArrival)}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-slate-500">
                  Latest acceptable arrival
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">
                  {formatDateTime(scheduleData?.maximumArrival)}
                </dd>
              </div>
            </dl>
          </section>

          <Divider />

          <section aria-labelledby="review-capacity-heading">
            <h3
              id="review-capacity-heading"
              className="text-sm font-semibold text-slate-900"
            >
              Seats
            </h3>

            <p className="mt-2 text-sm text-slate-700">
              {capacityData?.requestedSeats ?? 'Not set'}{' '}
              {capacityData?.requestedSeats === 1
                ? 'seat'
                : 'seats'}
            </p>
          </section>

          <Divider />

          <section aria-labelledby="review-pricing-heading">
            <h3
              id="review-pricing-heading"
              className="text-sm font-semibold text-slate-900"
            >
              Pricing
            </h3>

            <dl className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">
                  Preferred price
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">
                  {formatMoney(
                    pricingData?.preferredPricePerSeat,
                    currency,
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-slate-500">
                  Maximum price
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">
                  {formatMoney(
                    pricingData?.maximumPricePerSeat,
                    currency,
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </Card>

      {publishMutation.isError ? (
        <p className="text-sm text-red-600" role="alert">
          {publishMutation.error instanceof Error
            ? publishMutation.error.message
            : 'We could not publish your journey demand. Please try again.'}
        </p>
      ) : null}

      <Card padding="md" variant="muted">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Ready to publish?
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Publishing makes your demand visible to the sisiMove
              marketplace so suitable journey providers can discover it.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handlePublish}
              disabled={publishMutation.isPending}
            >
              {publishMutation.isPending
                ? 'Publishing…'
                : 'Publish journey demand'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}