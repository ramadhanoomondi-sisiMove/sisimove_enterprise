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
 * Thrown when a Commercial Booking Commission has already been cancelled.
 */
export class CommercialBookingCommissionAlreadyCancelledException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial booking commission "${publicId}" has already been cancelled.`
        : 'Commercial booking commission has already been cancelled.',
    );
  }
}
