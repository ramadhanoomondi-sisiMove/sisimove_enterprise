// -----------------------------------------------------------------------------
// Verification Request Invalid Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { VerificationRequestException } from './verification-request.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that an operation cannot be performed because the Verification
 * Request is currently in an incompatible lifecycle status.
 *
 * This exception is used when a Verification Request operation violates the
 * lifecycle rules represented by VerificationRequestStatus.
 */
export class VerificationRequestInvalidStatusException extends VerificationRequestException {
  public constructor(
    message: string = 'The Verification Request is in an invalid status for this operation.',
  ) {
    super(message);
  }
}
