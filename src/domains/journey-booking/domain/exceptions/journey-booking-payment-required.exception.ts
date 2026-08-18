// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation requires a Journey Booking payment that has not
 * yet been created.
 */
export class JourneyBookingPaymentRequiredException extends JourneyBookingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey booking "${publicId}" requires a payment.`
        : 'Journey booking requires a payment.',
    );
  }
}
