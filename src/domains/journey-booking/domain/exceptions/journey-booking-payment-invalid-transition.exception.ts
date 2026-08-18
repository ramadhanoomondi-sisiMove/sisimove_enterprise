// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Booking payment attempts an invalid state transition.
 */
export class JourneyBookingPaymentInvalidTransitionException extends JourneyBookingException {
  constructor(currentStatus: string, requestedStatus: string) {
    super(
      `Invalid journey booking payment status transition from "${currentStatus}" to "${requestedStatus}".`,
    );
  }
}
