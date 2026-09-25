'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Summary
// -----------------------------------------------------------------------------
//
// Compact presentation of the essential Journey Booking information.
//
// Responsibilities:
// - Present the booking's primary identity and lifecycle information.
// - Present passenger seat quantity.
// - Present the associated Journey reference.
// - Provide a reusable summary surface for booking detail and management UI.
//
// Non-responsibilities:
// - Fetching booking data.
// - Mutating booking state.
// - Payment processing.
// - Cancellation logic.
// - Navigation.
// - Authorization.
// - Domain/lifecycle decisions.
//
// Data flow:
//
//     Page / parent component
//             │
//             ▼
//     JourneyBookingSummary
//             │
//             ├── JourneyBooking model
//             └── JourneyBookingStatusBadge
//
// The component intentionally consumes the frontend domain model rather than
// backend DTOs. API response mapping belongs in the feature mapper layer.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  Badge,
  Card,
} from '@/components/ui';

import type { JourneyBooking } from '@/features/journey-booking/models';
import { JourneyBookingStatusBadge } from '../booking-status';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBookingSummaryProps {
  /**
   * Booking aggregate represented by the summary.
   */
  booking: JourneyBooking;

  /**
   * Optional content rendered in the summary header.
   *
   * Useful for page-level actions without making the summary responsible for
   * action behavior.
   */
  actions?: ReactNode;

  /**
   * Optional additional content rendered below the primary booking metadata.
   */
  children?: ReactNode;

  /**
   * Optional additional CSS classes.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// JourneyBookingSummary
// -----------------------------------------------------------------------------

export function JourneyBookingSummary({
  booking,
  actions,
  children,
  className,
}: JourneyBookingSummaryProps) {
  return (
    <Card
      className={className}
      padding="md"
    >
      <div className="flex flex-col gap-4">
        {/* -------------------------------------------------------------------
            Header
            ------------------------------------------------------------------- */}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Booking
            </p>

            <h2 className="mt-1 truncate text-base font-semibold text-[var(--foreground)]">
              #{booking.publicId}
            </h2>
          </div>

          <JourneyBookingStatusBadge
            status={booking.status}
          />
        </div>

        {/* -------------------------------------------------------------------
            Core booking metadata
            ------------------------------------------------------------------- */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <SummaryItem
            label="Seats"
            value={String(booking.seats)}
          />

          <SummaryItem
            label="Journey"
            value={booking.journeyPublicId}
            mono
          />

          <SummaryItem
            label="Passenger"
            value={booking.passengerPublicId}
            mono
          />
        </div>

        {/* -------------------------------------------------------------------
            Lifecycle timestamps
            ------------------------------------------------------------------- */}

        <div className="flex flex-wrap gap-2">
          {booking.confirmedAt && (
            <Badge variant="success" size="sm">
              Confirmed
            </Badge>
          )}

          {booking.cancelledAt && (
            <Badge variant="danger" size="sm">
              Cancelled
            </Badge>
          )}

          {booking.completedAt && (
            <Badge variant="brand" size="sm">
              Completed
            </Badge>
          )}

          {booking.expiredAt && (
            <Badge variant="warning" size="sm">
              Expired
            </Badge>
          )}
        </div>

        {/* -------------------------------------------------------------------
            Extension content
            ------------------------------------------------------------------- */}

        {children}

        {/* -------------------------------------------------------------------
            Optional actions
            ------------------------------------------------------------------- */}

        {actions && (
          <div className="border-t border-[var(--border-subtle)] pt-4">
            {actions}
          </div>
        )}
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Summary Item
// -----------------------------------------------------------------------------

interface SummaryItemProps {
  label: string;
  value: string;
  mono?: boolean;
}

function SummaryItem({
  label,
  value,
  mono = false,
}: SummaryItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </p>

      <p
        className={[
          'mt-1',
          'truncate',
          'text-sm',
          'font-medium',
          'text-[var(--foreground)]',
          mono
            ? 'font-mono text-xs'
            : '',
        ].join(' ')}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}