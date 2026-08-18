// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a booking that is already confirmed is confirmed again.
 */
export class JourneyBookingAlreadyConfirmedException extends JourneyBookingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey booking "${publicId}" has already been confirmed.`
        : 'Journey booking has already been confirmed.',
    );
  }
}
