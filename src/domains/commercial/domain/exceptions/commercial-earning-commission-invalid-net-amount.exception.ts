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
 * Thrown when the provider's net earning after commission is invalid.
 */
export class CommercialEarningCommissionInvalidNetAmountException extends CommercialException {
  public constructor(netAmount?: number) {
    super(
      netAmount !== undefined
        ? `Commercial earning commission net amount "${netAmount}" is invalid. Net amount must not be negative.`
        : 'Commercial earning commission net amount is invalid. Net amount must not be negative.',
    );
  }
}
