// -----------------------------------------------------------------------------
// Role Already Exists
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { RoleException } from './role.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that a Role already exists for a unique Role attribute or
 * business constraint.
 *
 * This exception is typically used when attempting to create a Role with
 * a code or name that is already associated with another Role.
 */
export class RoleAlreadyExistsException extends RoleException {
  public constructor(
    message: string = 'A Role with the specified attributes already exists.',
  ) {
    super(message);
  }
}
