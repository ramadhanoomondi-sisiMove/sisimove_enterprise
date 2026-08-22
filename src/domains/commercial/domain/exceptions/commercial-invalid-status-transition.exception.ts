// -----------------------------------------------------------------------------
// Commercial
// -----------------------------------------------------------------------------

import { CommercialException } from './commercial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Commercial entity attempts an invalid lifecycle
 * status transition.
 */
export class CommercialInvalidStatusTransitionException extends CommercialException {
  public constructor(currentStatus: string, targetStatus: string) {
    super(
      `Invalid commercial status transition from "${currentStatus}" to "${targetStatus}".`,
    );
  }
}
