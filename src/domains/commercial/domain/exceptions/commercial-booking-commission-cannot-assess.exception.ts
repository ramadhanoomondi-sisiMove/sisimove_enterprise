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
 * Thrown when a Commercial Booking Commission cannot be assessed
 * because its current lifecycle state does not permit assessment.
 */
export class CommercialBookingCommissionCannotAssessException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial booking commission "${publicId}" cannot be assessed in its current state.`
        : 'Commercial booking commission cannot be assessed in its current state.',
    );
  }
}
