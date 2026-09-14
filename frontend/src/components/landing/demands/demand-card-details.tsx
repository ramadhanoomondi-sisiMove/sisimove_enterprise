// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Card Details
// -----------------------------------------------------------------------------
//
// Presentation component for the detail portion of a public Journey Demand
// marketplace card.
//
// The component provides the compact marketplace facts a visitor needs after
// seeing the requester and route:
//
// - Demand status
// - Requested / remaining seats
// - Departure window
// - Preferred / maximum price per seat
//
// The component deliberately does not:
// - fetch Demand data;
// - calculate Demand state;
// - determine whether the Demand can be joined;
// - perform currency conversion;
// - calculate prices;
// - format the route;
// - render requester information;
// - render marketplace actions.
//
// Those responsibilities belong outside this presentation component.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemand } from '@/features/journey-demands/models/public-journey-demand';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface DemandCardDetailsProps {
  /**
   * Public Journey Demand representation.
   */
  demand: PublicJourneyDemand;

  /**
   * Optional additional styling supplied by the parent marketplace card.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

/**
 * Formats an ISO date/time using the Demand's declared timezone.
 *
 * The backend remains responsible for providing valid ISO timestamps and the
 * authoritative timezone. The card only turns that existing representation
 * into readable marketplace text.
 */
function formatDateTime(
  value: string,
  timezone: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(date);
}

/**
 * Formats a price already represented in the public Demand model.
 *
 * This component does not convert or reinterpret the amount.
 */
function formatPrice(
  amount: number | null,
  currency: string,
): string | null {
  if (amount === null) {
    return null;
  }

  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// -----------------------------------------------------------------------------
// Status Labels
// -----------------------------------------------------------------------------

const statusLabels = {
  OPEN: 'Open',
  MATCHED: 'Matched',
  CONVERTED: 'Converted',
  FULFILLED: 'Fulfilled',
} as const;

type KnownDemandStatus = keyof typeof statusLabels;

/**
 * Resolves a safe marketplace label from an untrusted runtime status value.
 *
 * TypeScript guarantees the declared PublicJourneyDemand status at compile
 * time, but API responses are runtime data and therefore cannot be trusted
 * solely because the TypeScript model says they are valid.
 *
 * The unknown input prevents this function from assuming that the runtime
 * value is one of the known Demand statuses.
 *
 * Unknown, malformed, or missing values are rendered as "Unavailable" rather
 * than leaking an undefined value into the marketplace UI.
 */
function getStatusLabel(status: unknown): string {
  if (
    typeof status === 'string' &&
    Object.prototype.hasOwnProperty.call(statusLabels, status)
  ) {
    return statusLabels[status as KnownDemandStatus];
  }

  return 'Unavailable';
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DemandCardDetails({
  demand,
  className,
}: DemandCardDetailsProps) {
  const {
    schedule,
    capacity,
    pricing,
    status,
  } = demand;

  const preferredPrice = formatPrice(
    pricing.preferredPricePerSeat,
    pricing.currency,
  );

  const maximumPrice = formatPrice(
    pricing.maximumPricePerSeat,
    pricing.currency,
  );

  const departureWindow = [
    formatDateTime(
      schedule.earliestDeparture,
      schedule.timezone,
    ),
    formatDateTime(
      schedule.latestDeparture,
      schedule.timezone,
    ),
  ].join(' – ');

  const statusLabel = getStatusLabel(status);

  return (
    <div
      className={[
        'min-w-0',
        'space-y-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Status                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-[var(--foreground-secondary)]">
          Demand
        </span>

        <span className="text-xs font-medium text-[var(--foreground)]">
          {statusLabel}
        </span>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Departure window                                                    */}
      {/* ------------------------------------------------------------------- */}

      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--foreground-secondary)]">
          Departure
        </p>

        <p className="mt-1 truncate text-sm font-medium text-[var(--foreground)]">
          {departureWindow}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Capacity                                                            */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            Seats needed
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {capacity.requestedSeats}
          </p>
        </div>

        <div className="min-w-0 text-right">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            Still needed
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {capacity.remainingSeats}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Pricing                                                             */}
      {/* ------------------------------------------------------------------- */}

      {(preferredPrice || maximumPrice) && (
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            Price per seat
          </p>

          <div className="mt-1 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
            {preferredPrice && (
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {preferredPrice}
              </span>
            )}

            {maximumPrice && (
              <span className="text-xs text-[var(--foreground-secondary)]">
                {preferredPrice
                  ? `up to ${maximumPrice}`
                  : `maximum ${maximumPrice}`}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

