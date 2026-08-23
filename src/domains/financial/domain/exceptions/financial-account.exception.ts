// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialException } from './financial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Account-specific domain errors.
 *
 * All Financial Account-specific exceptions should ultimately extend
 * this exception.
 */
export class FinancialAccountException extends FinancialException {
  public constructor(
    message: string = 'A financial account domain error occurred.',
  ) {
    super(message);
  }
}
