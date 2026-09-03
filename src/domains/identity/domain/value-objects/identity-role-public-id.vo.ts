// -----------------------------------------------------------------------------
// Identity Role Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of an Identity Role assignment.
 *
 * Represents the externally exposed identifier of the relationship between
 * an Identity and a Role within the Identity domain.
 *
 * This identifier identifies the assignment itself, not the Identity or
 * Role being assigned.
 */
export class IdentityRolePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'IRL');
  }
}
