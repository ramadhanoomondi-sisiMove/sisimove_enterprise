// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a cancellation operation does not contain the required
 * cancellation information.
 */
export class JourneyBookingCancellationRequiredException extends JourneyBookingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey booking "${publicId}" requires cancellation information.`
        : 'Journey booking requires cancellation information.',
    );
  }
}
