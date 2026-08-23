// -----------------------------------------------------------------------------
// Financial Account Hold
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialException } from './financial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Account Hold-specific domain errors.
 *
 * All Financial Account Hold-specific exceptions should ultimately extend
 * this exception.
 */
export class FinancialAccountHoldException extends FinancialException {
  public constructor(
    message: string = 'A financial account hold domain error occurred.',
  ) {
    super(message);
  }
}
