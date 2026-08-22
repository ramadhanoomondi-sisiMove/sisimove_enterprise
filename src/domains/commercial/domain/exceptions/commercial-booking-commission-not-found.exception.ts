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
 * Thrown when a Commercial Booking Commission cannot be found.
 */
export class CommercialBookingCommissionNotFoundException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial booking commission "${publicId}" was not found.`
        : 'Commercial booking commission was not found.',
    );
  }
}
