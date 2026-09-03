// -----------------------------------------------------------------------------
// Verification Not Found
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { VerificationException } from './verification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that the requested Verification could not be found within the
 * Identity domain.
 *
 * This exception is used when a Verification is required but no
 * corresponding Verification exists for the supplied public identity
 * reference.
 */
export class VerificationNotFoundException extends VerificationException {
  public constructor(message: string = 'Verification was not found.') {
    super(message);
  }
}
