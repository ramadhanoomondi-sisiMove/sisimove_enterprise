// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Card
// -----------------------------------------------------------------------------
//
// Authenticated management presentation for a single Journey Demand.
//
// Responsibilities:
// - Present the Journey Demand summary.
// - Present lifecycle status.
// - Present route, schedule, capacity, and pricing information.
// - Navigate to the authenticated Journey Demand detail surface.
//
// This component does NOT:
// - fetch Journey Demand data,
// - mutate Journey Demand state,
// - determine ownership,
// - enforce permissions,
// - perform lifecycle transitions,
// - construct API requests,
// - manage TanStack Query state.
//
// -----------------------------------------------------------------------------

'use client';

import {
  Badge,
  Button,
  Card,
  Divider,
} from '@/components/ui';

import {
  AUTHENTICATED_ROUTES,
} from '@/foundation/routing';

import type {
  JourneyDemand,
  JourneyDemandStatus,
} from '@/features/journey-demand/models';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCardProps {
  demand: JourneyDemand;
  onOpen?: (journeyDemandPublicId: string) => void;
}

// -----------------------------------------------------------------------------
// Status presentation
// -----------------------------------------------------------------------------

function getStatusVariant(
  status: JourneyDemandStatus,
): 'default' | 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'OPEN':
    case 'MATCHED':
      return 'success';

    case 'CANCELLED':
      return 'danger';

    case 'EXPIRED':
      return 'warning';

    case 'DRAFT':
    case 'CONVERTED':
    case 'FULFILLED':
    default:
      return 'default';
  }
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDate(
  value?: string | null,
): string {
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
  }).format(date);
}

function formatCurrency(
  amount?: number | null,
  currency = 'KES',
): string {
  if (amount === null || amount === undefined) {
    return 'Flexible';
  }

  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCard({
  demand,
  onOpen,
}: JourneyDemandCardProps) {
  const handleOpen = () => {
    if (onOpen) {
      onOpen(demand.publicId);
      return;
    }

    window.location.assign(
      AUTHENTICATED_ROUTES.JOURNEY_DEMAND(
        demand.publicId,
      ),
    );
  };

  const origin =
    demand.corridor?.origin?.name ?? 'Origin not set';

  const destination =
    demand.corridor?.destination?.name ??
    'Destination not set';

  const departure =
    demand.schedule?.earliestDeparture;

  const requestedSeats =
    demand.capacity?.requestedSeats;

  const maximumPrice =
    demand.pricing?.maximumPricePerSeat;

  const currency =
    demand.pricing?.currency ?? 'KES';

  return (
    <Card
      padding="md"
      variant="default"
    >
      <div className="space-y-4">

        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Journey demand
            </p>

            <h3 className="mt-1 text-base font-semibold leading-6 text-slate-950">
              <span className="break-words">
                {origin}
              </span>

              <span
                aria-hidden="true"
                className="mx-2 text-slate-400"
              >
                →
              </span>

              <span className="break-words">
                {destination}
              </span>
            </h3>
          </div>

          <Badge
            size="sm"
            variant={getStatusVariant(demand.status)}
          >
            {demand.status}
          </Badge>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Summary                                                           */}
        {/* ----------------------------------------------------------------- */}

        <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">

          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              Departure
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {formatDate(departure)}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              Seats
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {requestedSeats ?? '—'}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              Maximum / seat
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {formatCurrency(
                maximumPrice,
                currency,
              )}
            </p>
          </div>
        </div>

        <Divider />

        {/* ----------------------------------------------------------------- */}
        {/* Route summary                                                     */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
          <span className="truncate">
            {origin}
          </span>

          <span
            aria-hidden="true"
            className="shrink-0 text-slate-400"
          >
            →
          </span>

          <span className="truncate">
            {destination}
          </span>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Action                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpen}
          >
            View demand
          </Button>
        </div>
      </div>
    </Card>
  );
}