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
 * Thrown when a Recovery operation is attempted while the Recovery
 * is in an invalid lifecycle status.
 */
export class RecoveryInvalidStatusException extends RecoveryException {
  public constructor(
    message: string = 'Recovery has an invalid status for this operation.',
  ) {
    super(message);
  }
}
