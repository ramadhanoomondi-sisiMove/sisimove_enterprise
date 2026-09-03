// -----------------------------------------------------------------------------
// Verification Request
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { VerificationException } from './verification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Verification Request-specific domain errors.
 *
 * All Verification Request-specific domain exceptions should ultimately
 * extend this exception.
 */
export class VerificationRequestException extends VerificationException {
  public constructor(
    message: string = 'A verification request domain error occurred.',
  ) {
    super(message);
  }
}
