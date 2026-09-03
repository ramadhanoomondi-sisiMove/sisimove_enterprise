// -----------------------------------------------------------------------------
// Role Permission
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { IdentityException } from './identity.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Role Permission-specific domain errors.
 *
 * All Role Permission-specific domain exceptions should ultimately extend
 * this exception.
 */
export class RolePermissionException extends IdentityException {
  public constructor(
    message: string = 'A role permission domain error occurred.',
  ) {
    super(message);
  }
}
