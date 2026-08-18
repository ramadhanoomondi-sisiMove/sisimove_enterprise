// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation cannot proceed because the Journey Booking
 * payment has failed.
 */
export class JourneyBookingPaymentFailedException extends JourneyBookingException {
  constructor(publicId?: string, reason?: string) {
    super(
      publicId
        ? reason
          ? `Payment for journey booking "${publicId}" has failed: ${reason}`
          : `Payment for journey booking "${publicId}" has failed.`
        : reason
          ? `Journey booking payment has failed: ${reason}`
          : 'Journey booking payment has failed.',
    );
  }
}
