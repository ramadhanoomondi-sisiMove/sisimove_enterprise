// -----------------------------------------------------------------------------
// Role Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Role.
 *
 * Represents the externally exposed identifier of a Role within the
 * Identity domain.
 *
 * The identifier is generated within the Identity domain and is safe to use
 * when referencing a role across application, presentation, integration,
 * and other bounded contexts.
 */
export class RolePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'ROL');
  }
}
