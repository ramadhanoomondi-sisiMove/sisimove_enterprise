// -----------------------------------------------------------------------------
// Authentication — Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AuthenticationException } from './authentication.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an Authentication entity or aggregate cannot be found.
 *
 * This exception represents an Authentication-domain-specific not-found
 * condition and extends the Authentication domain root exception.
 */
export class AuthenticationNotFoundException extends AuthenticationException {
  public constructor(message: string = 'Authentication was not found.') {
    super(message);
  }
}
