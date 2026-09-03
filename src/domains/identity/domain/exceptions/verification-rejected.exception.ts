// -----------------------------------------------------------------------------
// Verification Rejected
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { VerificationException } from './verification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that a Verification has been rejected.
 *
 * This exception is used when an operation requires an accepted or verified
 * Verification, but the Verification was rejected during review.
 */
export class VerificationRejectedException extends VerificationException {
  public constructor(message: string = 'Verification has been rejected.') {
    super(message);
  }
}
