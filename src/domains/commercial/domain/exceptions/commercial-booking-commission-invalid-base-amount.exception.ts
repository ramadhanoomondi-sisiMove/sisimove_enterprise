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
 * Thrown when the booking commission base amount is invalid.
 */
export class CommercialBookingCommissionInvalidBaseAmountException extends CommercialException {
  public constructor(amount?: number) {
    super(
      amount !== undefined
        ? `Commercial booking commission base amount "${amount}" is invalid. Base amount must be greater than zero.`
        : 'Commercial booking commission base amount is invalid. Base amount must be greater than zero.',
    );
  }
}
