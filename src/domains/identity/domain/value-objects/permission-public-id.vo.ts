// -----------------------------------------------------------------------------
// Permission Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Permission.
 *
 * Represents the externally exposed identifier of a Permission within the
 * Identity domain.
 *
 * The identifier is generated within the Identity domain and is safe to use
 * when referencing a permission across application, presentation,
 * integration, and other bounded contexts.
 */
export class PermissionPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'PER');
  }
}
