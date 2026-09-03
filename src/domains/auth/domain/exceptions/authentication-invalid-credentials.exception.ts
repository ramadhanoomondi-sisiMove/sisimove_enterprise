// -----------------------------------------------------------------------------
// Authentication — Invalid Credentials Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AuthenticationException } from './authentication.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when supplied authentication credentials cannot be accepted.
 *
 * This exception intentionally does not expose whether a particular
 * credential component, such as a password, exists or is incorrect.
 *
 * This helps preserve authentication failure semantics and prevents
 * unnecessary credential-enumeration information from leaking through
 * domain errors.
 */
export class AuthenticationInvalidCredentialsException extends AuthenticationException {
  public constructor(message: string = 'Invalid authentication credentials.') {
    super(message);
  }
}
