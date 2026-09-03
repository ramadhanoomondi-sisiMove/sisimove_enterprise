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
 * Thrown when a requested Recovery cannot be found.
 */
export class RecoveryNotFoundException extends RecoveryException {
  public constructor(message: string = 'Recovery was not found.') {
    super(message);
  }
}
