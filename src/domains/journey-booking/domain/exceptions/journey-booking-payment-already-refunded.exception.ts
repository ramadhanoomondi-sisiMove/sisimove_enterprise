// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Booking payment is already fully refunded.
 */
export class JourneyBookingPaymentAlreadyRefundedException extends JourneyBookingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Payment for journey booking "${publicId}" has already been refunded.`
        : 'Journey booking payment has already been refunded.',
    );
  }
}
