// -----------------------------------------------------------------------------
// Role
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { IdentityException } from './identity.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Role-specific domain errors.
 *
 * All Role-specific domain exceptions should ultimately extend
 * this exception.
 */
export class RoleException extends IdentityException {
  public constructor(message: string = 'A role domain error occurred.') {
    super(message);
  }
}
