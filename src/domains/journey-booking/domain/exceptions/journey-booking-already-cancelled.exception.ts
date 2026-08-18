// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a booking that is already cancelled is cancelled again.
 */
export class JourneyBookingAlreadyCancelledException extends JourneyBookingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey booking "${publicId}" has already been cancelled.`
        : 'Journey booking has already been cancelled.',
    );
  }
}
