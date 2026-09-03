// -----------------------------------------------------------------------------
// Role Permission Permission Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the Permission associated with a Role
 * Permission assignment.
 *
 * Represents the externally exposed identifier of the Permission assigned
 * to a Role.
 *
 * This is an opaque public reference to the Permission within the Identity
 * domain and does not expose the internal database identifier.
 */
export class RolePermissionPermissionPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value: string) {
    super(value, 'PER');
  }
}
