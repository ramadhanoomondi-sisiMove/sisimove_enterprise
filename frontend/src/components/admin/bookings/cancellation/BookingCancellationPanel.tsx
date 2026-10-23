
'use client';

// -----------------------------------------------------------------------------
// Booking — Cancellation Panel
// -----------------------------------------------------------------------------
//
// Displays cancellation information for an administrative booking.
//
// Responsibilities:
// - Present the recorded cancellation reason.
// - Display the cancellation timestamp.
// - Identify the cancelling user.
// - Return nothing when cancellation information is unavailable.
//
// Component boundaries:
// - BookingSectionHeader owns section heading presentation.
// - BookingPublicId owns public identifier presentation.
// - This component owns cancellation-specific layout and formatting.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

import {
  CalendarClock,
  FileText,
  UserRound,
  XCircle,
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Shared Components
// -----------------------------------------------------------------------------

import { BookingSectionHeader } from '@/components/admin/bookings/layout';
import { BookingPublicId } from '@/components/admin/bookings/shared';

// -----------------------------------------------------------------------------
// Feature Types
// -----------------------------------------------------------------------------

import type { AdminBooking } from '@/features/admin/bookings';

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type BookingCancellationData = NonNullable<
  AdminBooking['cancellation']
>;

interface BookingCancellationPanelProps {
  cancellation: BookingCancellationData | null | undefined;
  className?: string;
}

// -----------------------------------------------------------------------------
// Date Formatting
// -----------------------------------------------------------------------------

/**
 * Formats a cancellation timestamp using the Kenyan locale.
 *
 * Invalid or missing timestamps are presented as unavailable rather than
 * exposing invalid date output in the administrative interface.
 */
function formatDate(value: string | null | undefined): string {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

// -----------------------------------------------------------------------------
// Detail Row
// -----------------------------------------------------------------------------

interface DetailRowProps {
  icon: typeof FileText;
  label: string;
  children: ReactNode;
}

/**
 * Displays one labelled cancellation detail with a contextual icon.
 */
function DetailRow({
  icon: Icon,
  label,
  children,
}: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div
        className={cn(
          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center',
          'rounded-xl bg-[var(--background-subtle)]',
          'text-[var(--foreground-secondary)]',
        )}
      >
        <Icon
          className="h-4 w-4"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[var(--foreground-muted)]">
          {label}
        </p>

        <div className="mt-1 break-words text-sm font-medium text-[var(--foreground)]">
          {children}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Cancellation Panel
// -----------------------------------------------------------------------------

export function BookingCancellationPanel({
  cancellation,
  className,
}: BookingCancellationPanelProps) {
  // Cancellation details are not applicable when no cancellation exists.
  if (!cancellation) {
    return null;
  }

  const cancellationReason =
    cancellation.reasonDescription ||
    cancellation.reason ||
    'No reason recorded';

  return (
    <section
      className={cn(
        'rounded-2xl border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-sm',
        className,
      )}
      aria-label="Booking cancellation details"
    >
      {/* Section heading and cancellation icon. */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center',
            'rounded-xl bg-[var(--background-subtle)]',
            'text-[var(--foreground-secondary)]',
          )}
        >
          <XCircle
            className="h-5 w-5"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <BookingSectionHeader
            title="Cancellation details"
            description="Recorded reason and cancellation information."
          />
        </div>
      </div>

      {/* Cancellation metadata. */}
      <div className="mt-3 divide-y divide-[var(--border-subtle)]">
        <DetailRow
          icon={FileText}
          label="Cancellation reason"
        >
          {cancellationReason}
        </DetailRow>

        <DetailRow
          icon={CalendarClock}
          label="Cancelled on"
        >
          {formatDate(cancellation.cancelledAt)}
        </DetailRow>

        <DetailRow
          icon={UserRound}
          label="Cancelled by"
        >
          {cancellation.cancelledByPublicId ? (
            <BookingPublicId
              publicId={cancellation.cancelledByPublicId}
            />
          ) : (
            'Not available'
          )}
        </DetailRow>
      </div>
    </section>
  );
}
