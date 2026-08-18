// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation requires a captured Journey Booking payment.
 */
export class JourneyBookingPaymentNotCapturedException extends JourneyBookingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Payment for journey booking "${publicId}" has not been captured.`
        : 'Journey booking payment has not been captured.',
    );
  }
}
