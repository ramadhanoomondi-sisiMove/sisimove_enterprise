// -----------------------------------------------------------------------------
// SisiMove — Journey Summary
// -----------------------------------------------------------------------------
//
// Compact public presentation of the core Journey decision information.
//
// This component is intentionally presentation-only. It does not:
// - fetch data
// - mutate Journey state
// - expose private traveller information
// - perform booking
// - access Commercial or Financial data
//
// The summary is designed for use in a Journey detail sidebar. Detailed route,
// vehicle, preferences, and other Journey information belong to the main
// Journey detail content and are intentionally not duplicated here.
//
// Public information shown:
// - Journey availability
// - Departure date and time
// - Price per seat
// - Available seats
//
// The backend remains authoritative for booking eligibility and seat
// availability.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — Formatters
// -----------------------------------------------------------------------------

import {
  formatCurrencyMinorUnits,
  formatDate,
  formatTime,
} from '@/foundation/formatters';

// -----------------------------------------------------------------------------
// Journey
// -----------------------------------------------------------------------------

import type { Journey } from '../models/journey';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneySummaryProps {
  journey: Journey;
}

// -----------------------------------------------------------------------------
// Availability Label
// -----------------------------------------------------------------------------

function formatAvailability(
  availableSeats: number,
): string {
  if (availableSeats <= 0) {
    return 'No seats available';
  }

  return `${availableSeats} ${
    availableSeats === 1 ? 'seat' : 'seats'
  } available`;
}

// -----------------------------------------------------------------------------
// Journey Availability Label
// -----------------------------------------------------------------------------
//
// `isBookable` is the backend's authoritative public projection of whether
// the Journey currently accepts bookings.
//
// The frontend does not derive booking eligibility from:
// - Journey status
// - total seats
// - booked seats
// - available seats
//
// Capacity is displayed independently as public availability information.
// -----------------------------------------------------------------------------

function formatJourneyAvailability(
  journey: Journey,
): string {
  if (!journey.isBookable) {
    return 'Journey unavailable';
  }

  if (journey.capacity.availableSeats <= 0) {
    return 'No seats available';
  }

  return 'Journey available';
}

// -----------------------------------------------------------------------------
// Journey Summary
// -----------------------------------------------------------------------------

export function JourneySummary({
  journey,
}: JourneySummaryProps) {
  const {
    schedule,
    capacity,
    pricing,
  } = journey;

  const departureDate = formatDate(
    schedule.departureAt,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: schedule.timezone,
    },
  );

  const departureTime = formatTime(
    schedule.departureAt,
    {
      timeZone: schedule.timezone,
    },
  );

  const price = formatCurrencyMinorUnits(
    pricing.amount,
    pricing.currency,
  );

  const availability = formatAvailability(
    capacity.availableSeats,
  );

  const availabilityStatus =
    formatJourneyAvailability(journey);

  return (
    <section
      aria-labelledby="journey-summary-heading"
      className="surface rounded-[var(--radius-lg)] p-6"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Heading                                                             */}
      {/* ------------------------------------------------------------------- */}

      <h2
        id="journey-summary-heading"
        className="text-lg font-semibold text-[var(--foreground)]"
      >
        Journey summary
      </h2>

      {/* ------------------------------------------------------------------- */}
      {/* Availability Status                                                */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-5">
        <p
          className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]"
          aria-live="polite"
        >
          {availabilityStatus}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Price                                                               */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-6">
        <p className="text-sm text-[var(--muted-foreground)]">
          Price per seat
        </p>

        <p className="mt-1 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          {price}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Departure                                                           */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-6 border-t border-[var(--border)] pt-5">
        <p className="text-sm text-[var(--muted-foreground)]">
          Departure
        </p>

        <p className="mt-1 font-medium text-[var(--foreground)]">
          <time dateTime={schedule.departureAt}>
            {departureDate}
          </time>
        </p>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          <time dateTime={schedule.departureAt}>
            {departureTime}
          </time>
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Availability                                                        */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-5 border-t border-[var(--border)] pt-5">
        <p className="text-sm text-[var(--muted-foreground)]">
          Availability
        </p>

        <p className="mt-1 font-medium text-[var(--foreground)]">
          {availability}
        </p>
      </div>
    </section>
  );
}