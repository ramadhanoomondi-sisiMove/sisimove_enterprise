// -----------------------------------------------------------------------------
// Session — Token Reuse Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { SessionException } from './session.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a previously used or replaced refresh token is presented
 * again.
 *
 * Token reuse is a security-sensitive Session-domain condition and may
 * require revocation of the associated token family.
 */
export class SessionTokenReuseException extends SessionException {
  public constructor(
    message: string = 'Session refresh token reuse detected.',
  ) {
    super(message);
  }
}
