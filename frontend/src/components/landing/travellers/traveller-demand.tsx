// -----------------------------------------------------------------------------
// sisiMove — Traveller Demand
// -----------------------------------------------------------------------------
//
// Presentation component for a public traveller journey demand.
//
// Responsibilities:
// - Render the public demand route.
// - Render the requested travel window.
// - Render the number of seats requested.
// - Render the traveller's maximum acceptable price when provided.
//
// This component does not:
// - fetch demand data;
// - calculate demand state;
// - determine matching journeys;
// - perform booking;
// - determine pricing or commercial rules;
// - perform authentication or authorization;
// - expose private traveller information.
//
// The component consumes the authoritative public discovery demand contract.
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import type {
  PublicTravellerDemand,
} from '@/features/traveller-discovery';

import { cn } from '../../../foundation/utils/cn';

import { TravellerPrice } from './traveller-price';
import { TravellerRoute } from './traveller-route';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TravellerDemandProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Public traveller demand.
   *
   * The feature model is authoritative. This component does not reconstruct
   * demand data from independent primitive props.
   */
  readonly demand: PublicTravellerDemand;

  /**
   * Optional presentation content displayed before the route.
   */
  readonly routeLeadingContent?: ReactNode;

  /**
   * Optional presentation content displayed before the schedule.
   */
  readonly scheduleLeadingContent?: ReactNode;

  /**
   * Optional presentation content displayed before the seats-needed value.
   */
  readonly availabilityLeadingContent?: ReactNode;

  /**
   * Optional presentation content displayed before the preferred price.
   */
  readonly priceLeadingContent?: ReactNode;

  /**
   * Whether to display the seats-needed information.
   */
  readonly showAvailability?: boolean;

  /**
   * Whether to display the maximum acceptable price.
   */
  readonly showPrice?: boolean;

  /**
   * Optional class name.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeNonNegativeInteger(
  value: number,
): number | null {
  if (!Number.isFinite(value)) {
    return null;
  }

  const normalized = Math.floor(value);

  return normalized >= 0
    ? normalized
    : null;
}

function hasPriceInformation(
  amount: number | null,
): boolean {
  return (
    amount !== null &&
    Number.isFinite(amount) &&
    amount >= 0
  );
}

function formatDemandSchedule(
  demand: PublicTravellerDemand,
): ReactNode {
  const {
    earliestDepartureAt,
    latestDepartureAt,
    timezone,
    flexibleDeparture,
  } = demand.schedule;

  if (
    !earliestDepartureAt ||
    !latestDepartureAt ||
    !timezone
  ) {
    return null;
  }

  const earliest = new Date(earliestDepartureAt);
  const latest = new Date(latestDepartureAt);

  if (
    Number.isNaN(earliest.getTime()) ||
    Number.isNaN(latest.getTime())
  ) {
    return null;
  }

  const dateFormatter = new Intl.DateTimeFormat(
    'en-KE',
    {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  );

  const timeFormatter = new Intl.DateTimeFormat(
    'en-KE',
    {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
    },
  );

  const earliestDate =
    dateFormatter.format(earliest);

  const latestDate =
    dateFormatter.format(latest);

  const earliestTime =
    timeFormatter.format(earliest);

  const latestTime =
    timeFormatter.format(latest);

  const sameDate =
    earliestDate === latestDate;

  if (!flexibleDeparture) {
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {earliestDate}
        </p>

        <p className="text-sm text-[var(--foreground-muted)]">
          {earliestTime}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-[var(--foreground)]">
        {sameDate
          ? earliestDate
          : `${earliestDate} – ${latestDate}`}
      </p>

      <p className="text-sm text-[var(--foreground-muted)]">
        {earliestTime} – {latestTime}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerDemand({
  demand,
  routeLeadingContent,
  scheduleLeadingContent,
  availabilityLeadingContent,
  priceLeadingContent,
  showAvailability = true,
  showPrice = true,
  className,
  ...props
}: TravellerDemandProps) {
  const {
    route,
    schedule,
    capacity,
    pricing,
  } = demand;

  const seatsNeeded =
    normalizeNonNegativeInteger(
      capacity.seatsNeeded,
    );

  const showAvailabilitySection =
    showAvailability &&
    seatsNeeded !== null;

  const showPriceSection =
    showPrice &&
    hasPriceInformation(pricing.maxAmount);

  const scheduleContent =
    formatDemandSchedule(demand);

  return (
    <div
      {...props}
      className={cn(
        'space-y-5',
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Route                                                               */}
      {/* ------------------------------------------------------------------- */}

      <TravellerRoute
        origin={route.origin}
        destination={route.destination}
        leadingContent={routeLeadingContent}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Requested Schedule                                                  */}
      {/* ------------------------------------------------------------------- */}

      {scheduleContent && (
        <div className="flex min-w-0 items-start gap-3">
          {scheduleLeadingContent && (
            <span
              aria-hidden="true"
              className="inline-flex shrink-0 items-center text-[var(--foreground-muted)]"
            >
              {scheduleLeadingContent}
            </span>
          )}

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--foreground-muted)]">
              {schedule.flexibleDeparture
                ? 'Flexible departure'
                : 'Departure'}
            </p>

            <div className="mt-1">
              {scheduleContent}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Seats Needed                                                         */}
      {/* ------------------------------------------------------------------- */}

      {showAvailabilitySection && (
        <div
          className={cn(
            'flex',
            'min-w-0',
            'items-center',
            'gap-1.5',
            'text-sm',
            'text-[var(--foreground)]',
          )}
        >
          {availabilityLeadingContent && (
            <span
              aria-hidden="true"
              className="inline-flex shrink-0 items-center text-[var(--foreground-muted)]"
            >
              {availabilityLeadingContent}
            </span>
          )}

          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="h-4 w-4 shrink-0"
          >
            <path
              d="M4 6.25h12M5.5 10h9M7 13.75h6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            <path
              d="M3 4.25h14v11.5H3z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

          <span className="font-medium">
            {seatsNeeded === 1
              ? '1 seat needed'
              : `${seatsNeeded} seats needed`}
          </span>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Maximum Acceptable Price                                            */}
      {/* ------------------------------------------------------------------- */}

      {showPriceSection && (
        <TravellerPrice
          amount={pricing.maxAmount!}
          currency={pricing.currency}
          label="Up to"
          leadingContent={priceLeadingContent}
        />
      )}
    </div>
  );
}