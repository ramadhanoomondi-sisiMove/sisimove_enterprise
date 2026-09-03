// -----------------------------------------------------------------------------
// Role Permission Revoked
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { RolePermissionException } from './role-permission.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that a Role Permission assignment has been revoked.
 *
 * A revoked Role Permission assignment is no longer active and must not be
 * used when evaluating authorization decisions.
 */
export class RolePermissionRevokedException extends RolePermissionException {
  public constructor(
    message: string = 'The Role Permission assignment has been revoked.',
  ) {
    super(message);
  }
}
