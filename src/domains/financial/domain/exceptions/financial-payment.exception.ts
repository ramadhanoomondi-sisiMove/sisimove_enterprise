// -----------------------------------------------------------------------------
// Financial Payment
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialException } from './financial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Payment-specific domain errors.
 *
 * All Financial Payment-specific exceptions should ultimately extend
 * this exception.
 */
export class FinancialPaymentException extends FinancialException {
  public constructor(
    message: string = 'A financial payment domain error occurred.',
  ) {
    super(message);
  }
}
