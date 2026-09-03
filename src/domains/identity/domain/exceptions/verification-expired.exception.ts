// -----------------------------------------------------------------------------
// Verification Expired
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { VerificationException } from './verification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that a Verification has expired and is no longer valid for
 * operations that require an active verified state.
 *
 * Expiration is distinct from rejection or revocation:
 *
 * - REJECTED: the submitted verification evidence was not accepted.
 * - EXPIRED: the verification validity period elapsed.
 * - REVOKED: a previously valid verification was explicitly invalidated.
 */
export class VerificationExpiredException extends VerificationException {
  public constructor(message: string = 'Verification has expired.') {
    super(message);
  }
}
