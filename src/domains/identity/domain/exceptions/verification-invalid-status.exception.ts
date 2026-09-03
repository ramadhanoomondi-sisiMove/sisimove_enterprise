// -----------------------------------------------------------------------------
// Verification Invalid Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { VerificationException } from './verification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that an operation cannot be performed because the Verification
 * is currently in an incompatible lifecycle status.
 *
 * This exception is used when a Verification operation violates the
 * lifecycle rules represented by VerificationStatus.
 */
export class VerificationInvalidStatusException extends VerificationException {
  public constructor(
    message: string = 'The Verification is in an invalid status for this operation.',
  ) {
    super(message);
  }
}
