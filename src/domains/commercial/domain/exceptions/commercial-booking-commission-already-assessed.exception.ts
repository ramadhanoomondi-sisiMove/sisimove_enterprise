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
 * Thrown when a Commercial Booking Commission has already been assessed.
 */
export class CommercialBookingCommissionAlreadyAssessedException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial booking commission "${publicId}" has already been assessed.`
        : 'Commercial booking commission has already been assessed.',
    );
  }
}
