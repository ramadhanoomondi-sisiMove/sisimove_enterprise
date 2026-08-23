// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialException } from './financial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial domain invariant is violated.
 *
 * This exception represents a business rule violation that cannot be
 * expressed by a more specific Financial exception.
 */
export class FinancialInvariantException extends FinancialException {
  public constructor(
    message: string = 'A financial domain invariant was violated.',
  ) {
    super(message);
  }
}
