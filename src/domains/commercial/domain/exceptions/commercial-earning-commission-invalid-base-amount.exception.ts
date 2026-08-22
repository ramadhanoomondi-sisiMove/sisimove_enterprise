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
 * Thrown when the provider earning commission base amount is invalid.
 */
export class CommercialEarningCommissionInvalidBaseAmountException extends CommercialException {
  public constructor(amount?: number) {
    super(
      amount !== undefined
        ? `Commercial earning commission base amount "${amount}" is invalid. Base amount must be greater than zero.`
        : 'Commercial earning commission base amount is invalid. Base amount must be greater than zero.',
    );
  }
}
