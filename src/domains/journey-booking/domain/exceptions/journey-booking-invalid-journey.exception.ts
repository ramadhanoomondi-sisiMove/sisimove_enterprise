// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Booking journey reference is invalid.
 */
export class JourneyBookingInvalidJourneyException extends JourneyBookingException {
  constructor(journeyPublicId?: string) {
    super(
      journeyPublicId
        ? `Invalid journey booking journey "${journeyPublicId}".`
        : 'Journey booking journey is invalid.',
    );
  }
}
