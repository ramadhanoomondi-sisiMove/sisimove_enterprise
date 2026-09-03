// -----------------------------------------------------------------------------
// Authentication — Disabled Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AuthenticationException } from './authentication.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an authentication operation cannot proceed because the
 * Authentication is disabled.
 *
 * This exception represents a domain-level disabled Authentication condition.
 */
export class AuthenticationDisabledException extends AuthenticationException {
  public constructor(message: string = 'Authentication is disabled.') {
    super(message);
  }
}
