// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialException } from './financial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Transaction-specific domain errors.
 *
 * All Financial Transaction-specific exceptions should ultimately extend
 * this exception.
 */
export class FinancialTransactionException extends FinancialException {
  public constructor(
    message: string = 'A financial transaction domain error occurred.',
  ) {
    super(message);
  }
}
