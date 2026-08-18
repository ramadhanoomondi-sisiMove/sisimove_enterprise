// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Booking aggregate invariant is violated.
 */
export class JourneyBookingInvariantException extends JourneyBookingException {
  constructor(message: string) {
    super(`Journey booking invariant violated: ${message}`);
  }
}
