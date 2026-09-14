// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Details
// -----------------------------------------------------------------------------
//
// Presentation component for the factual details of a public Journey
// marketplace card.
//
// The details section answers the questions a traveller needs to make an
// initial marketplace decision:
//
//   - When does the journey leave?
//   - When is it expected to arrive?
//   - What vehicle is being used?
//   - How many seats are available?
//   - What does the journey cost?
//   - What are the relevant travel preferences?
//
// The component deliberately does not:
// - fetch Journey data;
// - calculate booking availability;
// - determine whether a Journey can be booked;
// - perform currency conversion;
// - resolve vehicle information;
// - contain booking logic;
// - render route or provider information;
// - render marketplace actions.
//
// Those responsibilities belong to the Journey domain/read model or to the
// surrounding Journey marketplace card components.
//
// -----------------------------------------------------------------------------

import type { PublicJourney } from '@/features/journeys/models/public-journey';

export interface JourneyCardDetailsProps {
  journey: PublicJourney;
  className?: string;
}

const smokingLabels: Record<
  PublicJourney['preferences']['smoking'],
  string
> = {
  ALLOWED: 'Smoking allowed',
  NOT_ALLOWED: 'No smoking',
};

const petsLabels: Record<
  PublicJourney['preferences']['pets'],
  string
> = {
  ALLOWED: 'Pets allowed',
  NOT_ALLOWED: 'No pets',
  SERVICE_ANIMALS_ONLY: 'Service animals only',
};

const luggageLabels: Record<
  PublicJourney['preferences']['luggage'],
  string
> = {
  NONE: 'No luggage',
  LIMITED: 'Limited luggage',
  STANDARD: 'Standard luggage',
  LARGE: 'Large luggage',
};

const conversationLabels: Record<
  PublicJourney['preferences']['conversation'],
  string
> = {
  QUIET: 'Quiet',
  MODERATE: 'Moderate conversation',
  SOCIAL: 'Social',
};

const musicLabels: Record<
  PublicJourney['preferences']['music'],
  string
> = {
  NONE: 'No music',
  LOW: 'Low music',
  MODERATE: 'Moderate music',
  ANY: 'Music welcome',
};

function formatDateTime(
  value: string,
  timezone: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(date);
}

function formatPrice(
  amount: number,
  currency: string,
): string {
  if (!Number.isFinite(amount)) {
    return 'Unavailable';
  }

  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatVehicle(
  vehicle: PublicJourney['vehicle'],
): string {
  const name = [vehicle.make, vehicle.model]
    .filter(Boolean)
    .join(' ')
    .trim();

  if (!name) {
    return 'Vehicle unavailable';
  }

  if (vehicle.year) {
    return `${name} · ${vehicle.year}`;
  }

  return name;
}

export function JourneyCardDetails({
  journey,
  className,
}: JourneyCardDetailsProps) {
  const { schedule, vehicle, capacity, pricing, preferences } = journey;

  const availableSeats = Math.max(0, capacity.availableSeats);

  return (
    <div
      className={[
        'min-w-0 space-y-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Schedule                                                            */}
      {/* ------------------------------------------------------------------- */}

      <div className="grid min-w-0 grid-cols-2 gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            Departure
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-[var(--foreground)]">
            {formatDateTime(
              schedule.departureAt,
              schedule.timezone,
            )}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            Arrival
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-[var(--foreground)]">
            {schedule.arrivalAt
              ? formatDateTime(
                  schedule.arrivalAt,
                  schedule.timezone,
                )
              : 'Not specified'}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Vehicle and availability                                            */}
      {/* ------------------------------------------------------------------- */}

      <div className="grid min-w-0 grid-cols-2 gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            Vehicle
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-[var(--foreground)]">
            {formatVehicle(vehicle)}
          </p>

          {vehicle.color && (
            <p className="truncate text-xs text-[var(--foreground-secondary)]">
              {vehicle.color}
            </p>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            Seats
          </p>

          <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
            {availableSeats} available
          </p>

          <p className="text-xs text-[var(--foreground-secondary)]">
            {capacity.bookedSeats} of {capacity.totalSeats} booked
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Price                                                                */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            Price per seat
          </p>

          <p className="mt-1 text-lg font-bold text-[var(--foreground)]">
            {formatPrice(
              pricing.amount,
              pricing.currency,
            )}
          </p>
        </div>

        <p className="shrink-0 text-xs text-[var(--foreground-secondary)]">
          {pricing.currency}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Travel preferences                                                   */}
      {/* ------------------------------------------------------------------- */}
      {preferences && (
        <div className="border-t border-[var(--border)] pt-3">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            Preferences
          </p>

          <div className="mt-2 flex min-w-0 flex-wrap gap-x-3 gap-y-1.5 text-xs text-[var(--foreground-secondary)]">
            <span>{smokingLabels[preferences.smoking]}</span>
            <span>{petsLabels[preferences.pets]}</span>
            <span>{luggageLabels[preferences.luggage]}</span>
            <span>{conversationLabels[preferences.conversation]}</span>
            <span>{musicLabels[preferences.music]}</span>
          </div>
        </div>
      )}
    </div>
  );
}
