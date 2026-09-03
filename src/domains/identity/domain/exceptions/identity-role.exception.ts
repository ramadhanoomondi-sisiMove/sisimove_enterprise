// -----------------------------------------------------------------------------
// Identity Role
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { IdentityException } from './identity.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Identity Role-specific domain errors.
 *
 * All Identity Role-specific domain exceptions should ultimately extend
 * this exception.
 */
export class IdentityRoleException extends IdentityException {
  public constructor(
    message: string = 'An identity role domain error occurred.',
  ) {
    super(message);
  }
}
