// -----------------------------------------------------------------------------
// Role Inactive
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { RoleException } from './role.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that an operation cannot be performed because the Role is
 * currently inactive.
 *
 * An inactive Role must not be assigned to an Identity or otherwise used
 * for active authorization decisions.
 */
export class RoleInactiveException extends RoleException {
  public constructor(message: string = 'Role is inactive.') {
    super(message);
  }
}
