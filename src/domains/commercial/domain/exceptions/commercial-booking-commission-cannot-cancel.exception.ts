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
 * Thrown when a Commercial Booking Commission cannot be cancelled
 * because its current lifecycle state does not permit cancellation.
 */
export class CommercialBookingCommissionCannotCancelException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial booking commission "${publicId}" cannot be cancelled in its current state.`
        : 'Commercial booking commission cannot be cancelled in its current state.',
    );
  }
}
