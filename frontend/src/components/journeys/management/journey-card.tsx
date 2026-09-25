// -----------------------------------------------------------------------------
// sisiMove — Journey Management
// Journey Card
// -----------------------------------------------------------------------------
//
// Compact management card for authenticated Journey surfaces.
//
// Primary consumers:
// - /my-journeys
// - Journey management lists
// - Journey creation/management summaries
//
// Responsibilities:
// - Present a Journey's management-safe information.
// - Provide a clear route summary.
// - Show lifecycle status.
// - Show schedule, vehicle, seats, and pricing when available.
// - Provide a navigation affordance to Journey management.
//
// Architectural boundaries:
// - Does NOT resolve TravellerProfile.
// - Does NOT resolve TrustProfile.
// - Does NOT expose providerPublicId.
// - Does NOT fetch additional Journey resources.
// - Does NOT perform lifecycle mutations.
// - Does NOT own routing state.
//
// Data is expected to already be composed by the feature/query layer.
//
// Design boundaries:
// - Uses only frozen sisiMove design tokens.
// - No component-specific color palette.
// - No gradients.
// - No new shadows.
// - Compact and mobile-first.
// - One clear management action.
// -----------------------------------------------------------------------------


import Link from 'next/link';

import type { ReactNode } from 'react';

import {
  Badge,
  Card,
} from '@/components/ui';

import type {
  Journey,
  JourneyStatus,
} from '@/features/journey/models';


// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCardProps {
  /**
   * Authenticated Journey model.
   */
  journey: Journey;

  /**
   * Destination for the Journey management surface.
   *
   * The route is supplied by the consuming page so this component does not
   * own application routing conventions.
   */
  href: string;

  /**
   * Optional additional classes.
   */
  className?: string;
}


// -----------------------------------------------------------------------------
// Status presentation
// -----------------------------------------------------------------------------

interface StatusPresentation {
  label: string;

  variant:
    | 'default'
    | 'brand'
    | 'success'
    | 'warning'
    | 'danger'
    | 'outline';
}

const STATUS_PRESENTATION: Record<
  JourneyStatus,
  StatusPresentation
> = {
  DRAFT: {
    label: 'Draft',
    variant: 'default',
  },

  PUBLISHED: {
    label: 'Published',
    variant: 'brand',
  },

  FULL: {
    label: 'Full',
    variant: 'warning',
  },

  BOARDING: {
    label: 'Boarding',
    variant: 'warning',
  },

  IN_PROGRESS: {
    label: 'In progress',
    variant: 'brand',
  },

  COMPLETION_PENDING: {
    label: 'Completion pending',
    variant: 'warning',
  },

  COMPLETED: {
    label: 'Completed',
    variant: 'success',
  },

  CANCELLED: {
    label: 'Cancelled',
    variant: 'danger',
  },

  EXPIRED: {
    label: 'Expired',
    variant: 'outline',
  },
};


// -----------------------------------------------------------------------------
// Formatting helpers
// -----------------------------------------------------------------------------

function formatDate(
  value?: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}


function formatTime(
  value?: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-KE', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}


/**
 * JourneyPricing.amount is represented in minor currency units.
 *
 * Example:
 * - KES 1,500.00 is stored as 150000.
 *
 * The domain model intentionally preserves the backend value. Conversion to
 * a human-readable monetary value belongs at the presentation boundary.
 */
function formatAmount(
  amountInMinorUnits: number,
  currency: string,
): string {
  const amount = amountInMinorUnits / 100;

  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}


// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M4 10h11M11 6l4 4-4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function RouteIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle
        cx="5"
        cy="5"
        r="2"
      />

      <circle
        cx="15"
        cy="15"
        r="2"
      />

      <path
        d="M7 5h2a4 4 0 0 1 4 4v2a4 4 0 0 0 4 4"
        strokeLinecap="round"
      />
    </svg>
  );
}


function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4.5"
        width="14"
        height="12"
        rx="2"
      />

      <path
        d="M6.5 3v3M13.5 3v3M3 8h14"
        strokeLinecap="round"
      />
    </svg>
  );
}


function UsersIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="7"
        r="3"
      />

      <path
        d="M4.5 16a5.5 5.5 0 0 1 11 0"
        strokeLinecap="round"
      />
    </svg>
  );
}


function CarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M4 13.5V9l1.5-4h9L16 9v4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M3 10h14M5 13.5h.01M15 13.5h.01"
        strokeLinecap="round"
      />

      <path
        d="M5 13.5v2M15 13.5v2"
        strokeLinecap="round"
      />
    </svg>
  );
}


function PricingIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 4h10v12H5z"
        strokeLinejoin="round"
      />

      <path
        d="M8 7h4M8 10h4M8 13h2"
        strokeLinecap="round"
      />
    </svg>
  );
}


// -----------------------------------------------------------------------------
// Metadata item
// -----------------------------------------------------------------------------

interface MetadataItemProps {
  icon: ReactNode;
  children: ReactNode;
}


function MetadataItem({
  icon,
  children,
}: MetadataItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-sm text-[var(--foreground-secondary)]">
      <span
        className="flex shrink-0 items-center text-[var(--foreground-muted)]"
        aria-hidden="true"
      >
        {icon}
      </span>

      <span className="min-w-0 truncate">
        {children}
      </span>
    </div>
  );
}


// -----------------------------------------------------------------------------
// Journey Card
// -----------------------------------------------------------------------------

export function JourneyCard({
  journey,
  href,
  className,
}: JourneyCardProps) {
  const status =
    STATUS_PRESENTATION[journey.status];

  const origin =
    journey.corridor?.originName?.trim() ||
    'Origin not set';

  const destination =
    journey.corridor?.destinationName?.trim() ||
    'Destination not set';

  const departureDate =
    formatDate(
      journey.schedule?.departureAt,
    );

  const departureTime =
    formatTime(
      journey.schedule?.departureAt,
    );

  const arrivalTime =
    formatTime(
      journey.schedule?.arrivalAt,
    );

  const vehicleName = journey.vehicle
    ? [
        journey.vehicle.make,
        journey.vehicle.model,
      ]
        .filter(Boolean)
        .join(' ')
    : null;

  const capacity =
    journey.capacity;

  const availableSeats =
    capacity?.availableSeats;

  const pricing =
    journey.pricing;

  return (
    <Card
      padding="md"
      className={className}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]"
              aria-hidden="true"
            >
              <RouteIcon />
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                {origin}
              </p>

              <p className="truncate text-xs text-[var(--foreground-muted)]">
                to {destination}
              </p>
            </div>
          </div>
        </div>

        <Badge
          variant={status.variant}
          size="sm"
        >
          {status.label}
        </Badge>
      </div>


      {/* ------------------------------------------------------------------- */}
      {/* Route                                                                */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--background-subtle)] px-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]"
              aria-hidden="true"
            />

            <span className="truncate text-sm font-medium text-[var(--foreground)]">
              {origin}
            </span>
          </div>

          <span
            className="h-px w-8 shrink-0 bg-[var(--border-strong)]"
            aria-hidden="true"
          />

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            <span className="truncate text-right text-sm font-medium text-[var(--foreground)]">
              {destination}
            </span>

            <span
              className="h-2 w-2 shrink-0 rounded-full bg-[var(--foreground-muted)]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>


      {/* ------------------------------------------------------------------- */}
      {/* Metadata                                                             */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {departureDate && (
          <MetadataItem icon={<CalendarIcon />}>
            <span>
              {departureDate}

              {departureTime && (
                <>
                  {' · '}
                  {departureTime}
                </>
              )}

              {arrivalTime && (
                <>
                  {' – '}
                  {arrivalTime}
                </>
              )}
            </span>
          </MetadataItem>
        )}

        {vehicleName && (
          <MetadataItem icon={<CarIcon />}>
            {vehicleName}
          </MetadataItem>
        )}

        {capacity && (
          <MetadataItem icon={<UsersIcon />}>
            {availableSeats === 1
              ? '1 seat available'
              : `${availableSeats ?? 0} seats available`}
          </MetadataItem>
        )}

        {pricing && (
          <MetadataItem icon={<PricingIcon />}>
            <span>
              {formatAmount(
                pricing.amount,
                pricing.currency,
              )}
              {' / seat'}
            </span>
          </MetadataItem>
        )}
      </div>


      {/* ------------------------------------------------------------------- */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
        <div className="min-w-0">
          {capacity ? (
            <p className="text-xs text-[var(--foreground-muted)]">
              {capacity.bookedSeats} of{' '}
              {capacity.totalSeats} seats booked
            </p>
          ) : (
            <p className="text-xs text-[var(--foreground-muted)]">
              Capacity not configured
            </p>
          )}
        </div>

        <Link
          href={href}
          aria-label={`Manage journey from ${origin} to ${destination}`}
          className={[
            'inline-flex',
            'min-h-9',
            'shrink-0',
            'items-center',
            'gap-1.5',
            'rounded-[var(--radius-md)]',
            'px-3',
            'text-sm',
            'font-medium',
            'text-[var(--brand)]',
            'transition-colors',
            'duration-150',
            'ease-out',
            'hover:bg-[var(--brand-soft)]',
            'focus-visible:outline-2',
            'focus-visible:outline-[var(--brand)]',
            'focus-visible:outline-offset-2',
          ].join(' ')}
        >
          <span>Manage</span>
          <ArrowRightIcon />
        </Link>
      </div>
    </Card>
  );
}