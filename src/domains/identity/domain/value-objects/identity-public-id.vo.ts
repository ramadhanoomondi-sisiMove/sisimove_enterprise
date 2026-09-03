// -----------------------------------------------------------------------------
// Identity Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of an Identity aggregate.
 *
 * Represents the externally exposed identifier of an Identity within the
 * Identity domain.
 *
 * The identifier is safe to use across application, presentation,
 * integration, and other bounded contexts without exposing the internal
 * database identifier.
 */
export class IdentityPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'ID');
  }
}
