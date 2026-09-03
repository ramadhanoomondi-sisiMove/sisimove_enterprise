// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AuthenticationException } from './authentication.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an Authentication is in a status that does not permit
 * the requested domain operation.
 */
export class AuthenticationInvalidStatusException extends AuthenticationException {
  public constructor(
    message: string = 'Authentication has an invalid status for this operation.',
  ) {
    super(message);
  }
}
