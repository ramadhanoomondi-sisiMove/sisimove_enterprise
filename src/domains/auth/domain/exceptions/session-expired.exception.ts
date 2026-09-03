// -----------------------------------------------------------------------------
// Session — Expired Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { SessionException } from './session.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation requires an active Session but the Session has
 * expired.
 *
 * This exception represents a Session-domain-specific expiration condition.
 */
export class SessionExpiredException extends SessionException {
  public constructor(message: string = 'Session has expired.') {
    super(message);
  }
}
