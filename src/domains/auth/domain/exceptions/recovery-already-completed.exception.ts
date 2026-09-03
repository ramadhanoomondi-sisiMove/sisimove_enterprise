// -----------------------------------------------------------------------------
// Recovery
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { RecoveryException } from './recovery.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation is attempted on a Recovery that has
 * already been completed.
 */
export class RecoveryAlreadyCompletedException extends RecoveryException {
  public constructor(message: string = 'Recovery has already been completed.') {
    super(message);
  }
}
