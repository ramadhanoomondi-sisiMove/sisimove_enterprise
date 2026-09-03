// -----------------------------------------------------------------------------
// Session — Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { SessionException } from './session.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Session entity or aggregate cannot be found.
 *
 * This exception represents a Session-domain-specific not-found condition
 * and extends the Session domain root exception.
 */
export class SessionNotFoundException extends SessionException {
  public constructor(message: string = 'Session was not found.') {
    super(message);
  }
}
