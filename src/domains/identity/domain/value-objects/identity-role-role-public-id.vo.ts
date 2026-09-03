// -----------------------------------------------------------------------------
// Identity Role Role Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the Role associated with an Identity Role.
 *
 * Represents the externally exposed identifier of the Role assigned to an
 * Identity.
 *
 * This is an opaque public reference to the Role within the Identity domain
 * and does not expose the internal database identifier.
 */
export class IdentityRoleRolePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value: string) {
    super(value, 'ROL');
  }
}
