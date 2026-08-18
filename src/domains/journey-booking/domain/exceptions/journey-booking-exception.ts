// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Journey Booking domain.
 *
 * All Journey Booking-specific domain exceptions should ultimately extend
 * this exception.
 */
export class JourneyBookingException extends DomainException {
  constructor(message: string = 'A journey booking domain error occurred.') {
    super('JOURNEY_BOOKING.DOMAIN.ERROR', message);
  }
}
