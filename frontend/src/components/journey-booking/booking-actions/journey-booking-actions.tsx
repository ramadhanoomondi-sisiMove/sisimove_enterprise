// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Actions
// -----------------------------------------------------------------------------
//
// Presentation container for actions that can be performed on a Journey
// Booking.
//
// Responsibilities:
// - Render the actions appropriate to the supplied booking state.
// - Forward action callbacks to the individual action components.
// - Keep action presentation separate from booking lifecycle rules.
//
// Non-responsibilities:
// - Determining whether an action is legally/domain-valid.
// - Performing API calls.
// - Mutating booking state locally.
// - Reimplementing JourneyBookingAggregate lifecycle rules.
//
// The parent feature/page owns the mutation hooks and supplies callbacks here.
// -----------------------------------------------------------------------------

import type {
  JourneyBooking,
  JourneyBookingCancellationReason,
} from '@/features/journey-booking/models';
import { ConfirmJourneyBookingAction } from './confirm-journey-booking-action';
import { CancelJourneyBookingAction } from './cancel-journey-booking-action';

export interface JourneyBookingActionsProps {
  booking: JourneyBooking;

  /**
   * Called when the user requests booking confirmation.
   *
   * The parent is responsible for invoking the confirmation mutation.
   */
  onConfirm?: () => void | Promise<void>;

  /**
   * Called when the user requests cancellation.
   *
   * The parent is responsible for invoking the cancellation mutation.
   */
  onCancel?: (
    reason: JourneyBookingCancellationReason,
    reasonDescription?: string,
  ) => void | Promise<void>;

  /**
   * Indicates that a confirmation mutation is currently being processed.
   */
  confirming?: boolean;

  /**
   * Indicates that a cancellation mutation is currently being processed.
   */
  cancelling?: boolean;

  /**
   * Disables all action controls regardless of booking state.
   */
  disabled?: boolean;

  className?: string;
}

export function JourneyBookingActions({
  booking,
  onConfirm,
  onCancel,
  confirming = false,
  cancelling = false,
  disabled = false,
  className,
}: JourneyBookingActionsProps) {
  const showConfirm =
    booking.status === 'PENDING' && Boolean(onConfirm);

  const showCancel =
    !['CANCELLED', 'COMPLETED', 'EXPIRED'].includes(booking.status) &&
    Boolean(onCancel);

  if (!showConfirm && !showCancel) {
    return null;
  }

  return (
    <div
      className={[
        'flex',
        'flex-col',
        'gap-3',
        'sm:flex-row',
        'sm:flex-wrap',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Booking actions"
    >
      {showConfirm && (
        <ConfirmJourneyBookingAction
          onConfirm={onConfirm!}
          loading={confirming}
          disabled={disabled || cancelling}
        />
      )}

      {showCancel && (
        <CancelJourneyBookingAction
          onCancel={onCancel!}
          loading={cancelling}
          disabled={disabled || confirming}
        />
      )}
    </div>
  );
}