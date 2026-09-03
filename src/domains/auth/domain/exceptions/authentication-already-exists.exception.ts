// -----------------------------------------------------------------------------
// Authentication — Already Exists Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AuthenticationException } from './authentication.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an Authentication entity or aggregate already exists when
 * creation is expected to be unique.
 *
 * Typical cases include attempting to create another Authentication for an
 * Identity that already has an Authentication record.
 */
export class AuthenticationAlreadyExistsException extends AuthenticationException {
  public constructor(message: string = 'Authentication already exists.') {
    super(message);
  }
}
