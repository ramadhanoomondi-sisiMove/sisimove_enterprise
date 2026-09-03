// -----------------------------------------------------------------------------
// Identity Not Found
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { IdentityException } from './identity.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that the requested Identity could not be found within the
 * Identity domain.
 *
 * This exception is intended for domain/application boundary scenarios
 * where an Identity reference is required but no corresponding Identity
 * exists.
 */
export class IdentityNotFoundException extends IdentityException {
  public constructor(message: string = 'Identity was not found.') {
    super(message);
  }
}
