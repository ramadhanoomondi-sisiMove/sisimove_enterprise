// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a booking contains an invalid seat quantity.
 */
export class JourneyBookingInvalidSeatsException extends JourneyBookingException {
  constructor(seats?: number) {
    super(
      seats !== undefined
        ? `Journey booking contains an invalid seat quantity: "${seats}".`
        : 'Journey booking contains an invalid seat quantity.',
    );
  }
}
