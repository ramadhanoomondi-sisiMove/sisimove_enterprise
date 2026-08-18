// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Booking passenger reference is invalid.
 */
export class JourneyBookingInvalidPassengerException extends JourneyBookingException {
  constructor(passengerPublicId?: string) {
    super(
      passengerPublicId
        ? `Invalid journey booking passenger "${passengerPublicId}".`
        : 'Journey booking passenger is invalid.',
    );
  }
}
