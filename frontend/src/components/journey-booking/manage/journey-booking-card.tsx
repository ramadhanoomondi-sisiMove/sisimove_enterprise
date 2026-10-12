
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Card
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Present a concise summary of one journey booking.
// - Display booking reference, status, passenger ID, seat count and dates.
// - Reuse sisiMove Card and Badge design-system primitives.
// - Remain presentational: no API requests or booking mutations.
//
// Notes:
// - JourneyBooking does not expose a passenger name.
// - Pricing and payment details are omitted until their model structures
//   are confirmed.
// - The backend remains authoritative for booking lifecycle transitions.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  CalendarClock,
  Hash,
  UserRound,
  UsersRound,
} from 'lucide-react';

import { Badge, Card } from '@/components/ui';

import type { BadgeVariant } from '@/components/ui';

import type { JourneyBooking } from '@/features/journey-booking';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBookingCardProps {
  /**
   * Booking record to display.
   */
  booking: JourneyBooking;

  /**
   * Optional styling supplied by the results component.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting Helpers
// -----------------------------------------------------------------------------

function formatBookingReference(publicId: string): string {
  return publicId.trim() || 'Booking reference unavailable';
}

function formatStatus(status: JourneyBooking['status']): string {
  return String(status)
    .trim()
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusVariant(
  status: JourneyBooking['status'],
): BadgeVariant {
  switch (status) {
    case 'CONFIRMED':
    case 'COMPLETED':
      return 'success';

    case 'CANCELLED':
    case 'EXPIRED':
      return 'danger';

    case 'PENDING':
      return 'warning';

    default:
      return 'default';
  }
}

function formatDate(value?: string | null): string | null {
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

// -----------------------------------------------------------------------------
// Metadata Item
// -----------------------------------------------------------------------------

interface BookingMetadataProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function BookingMetadata({
  icon,
  label,
  value,
}: BookingMetadataProps) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-[var(--foreground-subtle)]"
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-xs text-[var(--foreground-muted)]">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm font-medium text-[var(--foreground)]">
          {value}
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingCard({
  booking,
  className,
}: JourneyBookingCardProps) {
  const bookingDate = formatDate(booking.createdAt);
  const confirmedDate = formatDate(booking.confirmedAt);

  return (
    <Card
      padding="lg"
      className={[
        'w-full',
        'min-w-0',
        'transition-shadow duration-150',
        'hover:shadow-[var(--shadow-md)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Booking reference and status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--foreground-muted)]">
            <Hash
              className="size-3.5 shrink-0"
              aria-hidden="true"
            />

            <span>Booking reference</span>
          </div>

          <h3 className="mt-1 break-all text-base font-semibold tracking-tight text-[var(--foreground)]">
            {formatBookingReference(booking.publicId)}
          </h3>
        </div>

        <Badge
          variant={getStatusVariant(booking.status)}
          size="md"
          aria-label={`Booking status: ${formatStatus(booking.status)}`}
        >
          {formatStatus(booking.status)}
        </Badge>
      </div>

      {/* Booking details */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <BookingMetadata
          icon={<UserRound className="size-4" />}
          label="Passenger ID"
          value={booking.passengerPublicId}
        />

        <BookingMetadata
          icon={<UsersRound className="size-4" />}
          label="Seats booked"
          value={`${booking.seats} ${
            booking.seats === 1 ? 'seat' : 'seats'
          }`}
        />

        {bookingDate && (
          <BookingMetadata
            icon={<CalendarClock className="size-4" />}
            label="Booking date"
            value={bookingDate}
          />
        )}

        {confirmedDate && (
          <BookingMetadata
            icon={<CalendarClock className="size-4" />}
            label="Confirmation date"
            value={confirmedDate}
          />
        )}
      </div>
    </Card>
  );
}
