// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Booking attempts an invalid lifecycle transition.
 */
export class JourneyBookingInvalidStatusTransitionException extends JourneyBookingException {
  constructor(currentStatus: string, requestedStatus: string) {
    super(
      `Invalid journey booking status transition from "${currentStatus}" to "${requestedStatus}".`,
    );
  }
}
