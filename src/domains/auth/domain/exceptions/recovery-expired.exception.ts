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
 * Thrown when a Recovery has expired and can no longer be used.
 */
export class RecoveryExpiredException extends RecoveryException {
  public constructor(message: string = 'Recovery has expired.') {
    super(message);
  }
}
