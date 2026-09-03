// -----------------------------------------------------------------------------
// Role Permission Already Assigned
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { RolePermissionException } from './role-permission.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that a Permission is already assigned to a Role.
 *
 * This exception protects the Role Permission invariant that a Role cannot
 * have the same Permission assigned more than once.
 */
export class RolePermissionAlreadyAssignedException extends RolePermissionException {
  public constructor(
    message: string = 'The Permission is already assigned to the Role.',
  ) {
    super(message);
  }
}
