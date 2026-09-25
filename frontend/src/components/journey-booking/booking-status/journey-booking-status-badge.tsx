// -----------------------------------------------------------------------------
// Journey Booking — Status Badge
// -----------------------------------------------------------------------------
//
// Presentational component for displaying the lifecycle status of a Journey
// Booking.
//
// This component intentionally does not:
//
// - determine whether a transition is allowed;
// - mutate booking state;
// - infer payment state;
// - make lifecycle decisions.
//
// It only translates the backend-owned status value into an accessible,
// human-readable visual representation using the frozen SisiMove design
// system.
// -----------------------------------------------------------------------------

import type { JourneyBookingStatus } from '@/features/journey-booking/models';

export interface JourneyBookingStatusBadgeProps {
  /**
   * Backend-owned Journey Booking lifecycle status.
   */
  status: JourneyBookingStatus;

  /**
   * Optional additional class names for layout composition.
   */
  className?: string;
}

const STATUS_LABELS: Record<JourneyBookingStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  EXPIRED: 'Expired',
};

const STATUS_CLASSES: Record<JourneyBookingStatus, string> = {
  PENDING:
    'border border-amber-200 bg-amber-50 text-amber-800',
  CONFIRMED:
    'border border-blue-200 bg-blue-50 text-blue-800',
  CANCELLED:
    'border border-red-200 bg-red-50 text-red-800',
  COMPLETED:
    'border border-emerald-200 bg-emerald-50 text-emerald-800',
  EXPIRED:
    'border border-slate-200 bg-slate-50 text-slate-700',
};

/**
 * Displays a Journey Booking lifecycle status.
 */
export function JourneyBookingStatusBadge({
  status,
  className,
}: JourneyBookingStatusBadgeProps) {
  const classes = [
    'inline-flex',
    'items-center',
    'rounded-full',
    'px-2.5',
    'py-1',
    'text-xs',
    'font-semibold',
    'leading-5',
    'whitespace-nowrap',
    STATUS_CLASSES[status],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      aria-label={`Booking status: ${STATUS_LABELS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}