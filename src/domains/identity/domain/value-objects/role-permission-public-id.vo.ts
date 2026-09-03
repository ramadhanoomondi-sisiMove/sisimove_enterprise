// -----------------------------------------------------------------------------
// Role Permission Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Role Permission assignment.
 *
 * Represents the externally exposed identifier of the relationship between
 * a Role and a Permission within the Identity domain.
 *
 * This identifier identifies the assignment itself, not the Role or
 * Permission being associated.
 */
export class RolePermissionPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'RPM');
  }
}
