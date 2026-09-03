// -----------------------------------------------------------------------------
// Authentication — Locked Exception
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
 * Authentication is currently locked.
 *
 * This exception represents a domain-level authentication lock condition.
 */
export class AuthenticationLockedException extends AuthenticationException {
  public constructor(message: string = 'Authentication is locked.') {
    super(message);
  }
}
