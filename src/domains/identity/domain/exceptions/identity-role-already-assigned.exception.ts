// -----------------------------------------------------------------------------
// Identity Role Already Assigned
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { IdentityRoleException } from './identity-role.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that a Role is already assigned to an Identity.
 *
 * This exception protects the Identity Role invariant that an Identity
 * cannot have the same Role assigned more than once.
 */
export class IdentityRoleAlreadyAssignedException extends IdentityRoleException {
  public constructor(
    message: string = 'The Role is already assigned to the Identity.',
  ) {
    super(message);
  }
}
