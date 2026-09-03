// -----------------------------------------------------------------------------
// Session — Invalid Status Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { SessionException } from './session.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation cannot be performed because the Session is in
 * an invalid lifecycle state for that operation.
 *
 * This exception represents a Session-domain-specific lifecycle violation.
 */
export class SessionInvalidStatusException extends SessionException {
  public constructor(
    message: string = 'Session has an invalid status for this operation.',
  ) {
    super(message);
  }
}
