// -----------------------------------------------------------------------------
// Commercial Earning Commission
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

import { CommercialException } from './commercial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when the calculated earning commission amount is invalid.
 */
export class CommercialEarningCommissionInvalidAmountException extends CommercialException {
  public constructor(amount?: number) {
    super(
      amount !== undefined
        ? `Commercial earning commission amount "${amount}" is invalid.`
        : 'Commercial earning commission amount is invalid.',
    );
  }
}
