// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Booking cannot be cancelled in its current state.
 */
export class JourneyBookingCancellationNotAllowedException extends JourneyBookingException {
  constructor(currentStatus?: string, publicId?: string) {
    if (publicId && currentStatus) {
      super(
        `Journey booking "${publicId}" cannot be cancelled while in status "${currentStatus}".`,
      );

      return;
    }

    if (currentStatus) {
      super(
        `Journey booking cannot be cancelled while in status "${currentStatus}".`,
      );

      return;
    }

    if (publicId) {
      super(`Journey booking "${publicId}" cannot be cancelled.`);

      return;
    }

    super('Journey booking cancellation is not allowed.');
  }
}
