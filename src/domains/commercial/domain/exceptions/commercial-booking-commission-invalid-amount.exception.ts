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
 * Thrown when the calculated booking commission amount is invalid.
 */
export class CommercialBookingCommissionInvalidAmountException extends CommercialException {
  public constructor(amount?: number) {
    super(
      amount !== undefined
        ? `Commercial booking commission amount "${amount}" is invalid.`
        : 'Commercial booking commission amount is invalid.',
    );
  }
}
