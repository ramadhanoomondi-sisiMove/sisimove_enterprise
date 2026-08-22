// -----------------------------------------------------------------------------
// Commercial
// -----------------------------------------------------------------------------

import { CommercialException } from './commercial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Commercial domain invariant is violated.
 *
 * This exception represents a business rule violation that cannot be
 * expressed by a more specific Commercial exception.
 */
export class CommercialInvariantException extends CommercialException {
  public constructor(
    message: string = 'A commercial domain invariant was violated.',
  ) {
    super(message);
  }
}
