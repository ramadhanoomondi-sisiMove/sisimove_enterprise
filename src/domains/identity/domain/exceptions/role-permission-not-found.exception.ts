// -----------------------------------------------------------------------------
// Role Permission — Not Found
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { RolePermissionException } from './role-permission.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a requested RolePermission aggregate or relationship
 * cannot be found.
 *
 * This exception is specific to the RolePermission aggregate boundary.
 */
export class RolePermissionNotFoundException extends RolePermissionException {
  public constructor(message: string = 'Role permission was not found.') {
    super(message);
  }
}
