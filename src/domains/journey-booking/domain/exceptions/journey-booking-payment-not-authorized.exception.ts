// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation requires an authorized Journey Booking payment.
 */
export class JourneyBookingPaymentNotAuthorizedException extends JourneyBookingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Payment for journey booking "${publicId}" has not been authorized.`
        : 'Journey booking payment has not been authorized.',
    );
  }
}
