// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { IdentityException } from './identity.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Verification-specific domain errors.
 *
 * All Verification-specific domain exceptions should ultimately extend
 * this exception.
 */
export class VerificationException extends IdentityException {
  public constructor(
    message: string = 'A verification domain error occurred.',
  ) {
    super(message);
  }
}
