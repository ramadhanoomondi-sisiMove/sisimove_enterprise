// -----------------------------------------------------------------------------
// Identity Role Revoked
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { IdentityRoleException } from './identity-role.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that an Identity Role assignment has been revoked.
 *
 * A revoked Identity Role assignment is no longer active and cannot be used
 * for authorization or operations that require an active role assignment.
 */
export class IdentityRoleRevokedException extends IdentityRoleException {
  public constructor(
    message: string = 'The Identity Role assignment has been revoked.',
  ) {
    super(message);
  }
}
