// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingException } from './journey-booking-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation requires Journey Booking pricing that has not
 * yet been configured.
 */
export class JourneyBookingPricingRequiredException extends JourneyBookingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey booking "${publicId}" requires pricing.`
        : 'Journey booking requires pricing.',
    );
  }
}
