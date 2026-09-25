// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Cancellation
// -----------------------------------------------------------------------------
//
// Presentation of the historical cancellation information associated with a
// Journey Booking.
//
// Responsibilities:
// - Present the cancellation reason.
// - Present the optional cancellation explanation.
// - Present the cancellation actor reference when available.
// - Present cancellation timestamps.
//
// Non-responsibilities:
// - Determining whether a booking can be cancelled.
// - Creating or modifying cancellation state.
// - Selecting a cancellation reason.
// - Performing the cancellation transition.
//
// IMPORTANT:
//
// Cancellation is booking-owned historical information. The backend
// JourneyBooking aggregate remains authoritative for cancellation lifecycle
// rules and state transitions.
// -----------------------------------------------------------------------------

import type { JourneyBookingCancellation } from '@/features/journey-booking/models';

export interface JourneyBookingCancellationProps {
  cancellation: JourneyBookingCancellation;
  className?: string;
}

const CANCELLATION_REASON_LABELS: Record<
  JourneyBookingCancellation['reason'],
  string
> = {
  PASSENGER_REQUEST: 'Passenger request',
  PROVIDER_REQUEST: 'Provider request',
  JOURNEY_CANCELLED: 'Journey cancelled',
  NO_SHOW: 'No show',
  SYSTEM: 'System',
  OTHER: 'Other',
};

export function JourneyBookingCancellation({
  cancellation,
  className,
}: JourneyBookingCancellationProps) {
  return (
    <section
      aria-labelledby="journey-booking-cancellation-title"
      className={[
        'flex',
        'flex-col',
        'gap-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
          Cancellation
        </p>

        <h2
          id="journey-booking-cancellation-title"
          className="mt-1 text-base font-semibold text-[var(--foreground)]"
        >
          Cancellation details
        </h2>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        <div className="divide-y divide-[var(--border-subtle)]">
          <CancellationRow
            label="Reason"
            value={CANCELLATION_REASON_LABELS[cancellation.reason]}
            emphasized
          />

          {cancellation.reasonDescription && (
            <div className="px-4 py-3">
              <p className="text-xs font-medium text-[var(--foreground-muted)]">
                Explanation
              </p>

              <p className="mt-1 break-words text-sm leading-5 text-[var(--foreground)]">
                {cancellation.reasonDescription}
              </p>
            </div>
          )}

          {cancellation.cancelledByPublicId && (
            <CancellationRow
              label="Cancelled by"
              value={cancellation.cancelledByPublicId}
              mono
            />
          )}

          <CancellationRow
            label="Cancelled"
            value={formatDateTime(cancellation.cancelledAt)}
          />

          <CancellationRow
            label="Recorded"
            value={formatDateTime(cancellation.createdAt)}
          />
        </div>
      </div>
    </section>
  );
}

interface CancellationRowProps {
  label: string;
  value: string;
  emphasized?: boolean;
  mono?: boolean;
}

function CancellationRow({
  label,
  value,
  emphasized = false,
  mono = false,
}: CancellationRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-sm text-[var(--foreground-secondary)]">
        {label}
      </span>

      <span
        className={[
          'min-w-0',
          'max-w-[65%]',
          'truncate',
          emphasized ? 'text-sm font-semibold' : 'text-sm font-medium',
          'text-[var(--foreground)]',
          mono ? 'font-mono text-xs' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}