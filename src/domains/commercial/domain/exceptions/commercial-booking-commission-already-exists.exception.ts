// -----------------------------------------------------------------------------
// Commercial Booking Commission
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

import { CommercialException } from './commercial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Commercial Booking Commission already exists for a booking.
 */
export class CommercialBookingCommissionAlreadyExistsException extends CommercialException {
  public constructor(bookingPublicId?: string) {
    super(
      bookingPublicId
        ? `A commercial booking commission already exists for booking "${bookingPublicId}".`
        : 'A commercial booking commission already exists.',
    );
  }
}
