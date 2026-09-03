// -----------------------------------------------------------------------------
// Identity Role Identity Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the Identity associated with an Identity Role.
 *
 * Represents the externally exposed identifier of the Identity to which
 * the Role is assigned.
 *
 * This is an opaque public reference to the Identity aggregate and does not
 * expose the internal database identifier.
 */
export class IdentityRoleIdentityPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value: string) {
    super(value, 'ID');
  }
}
