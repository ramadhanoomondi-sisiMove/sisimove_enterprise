// -----------------------------------------------------------------------------
// Session — Already Revoked Exception
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
 * already been revoked.
 *
 * This exception represents a Session-domain-specific revoked-state
 * violation.
 */
export class SessionAlreadyRevokedException extends SessionException {
  public constructor(message: string = 'Session has already been revoked.') {
    super(message);
  }
}
