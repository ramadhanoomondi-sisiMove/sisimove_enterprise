// -----------------------------------------------------------------------------
// Permission
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { IdentityException } from './identity.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Permission-specific domain errors.
 *
 * All Permission-specific domain exceptions should ultimately extend
 * this exception.
 */
export class PermissionException extends IdentityException {
  public constructor(message: string = 'A permission domain error occurred.') {
    super(message);
  }
}
