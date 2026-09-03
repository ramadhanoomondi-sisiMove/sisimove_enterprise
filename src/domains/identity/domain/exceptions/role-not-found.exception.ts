// -----------------------------------------------------------------------------
// Role Not Found
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { RoleException } from './role.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that the requested Role could not be found within the
 * Identity domain.
 */
export class RoleNotFoundException extends RoleException {
  public constructor(message: string = 'Role was not found.') {
    super(message);
  }
}
