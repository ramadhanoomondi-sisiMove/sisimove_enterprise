// -----------------------------------------------------------------------------
// Permission Not Found
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PermissionException } from './permission.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that the requested Permission could not be found within the
 * Identity domain.
 */
export class PermissionNotFoundException extends PermissionException {
  public constructor(message: string = 'Permission was not found.') {
    super(message);
  }
}
