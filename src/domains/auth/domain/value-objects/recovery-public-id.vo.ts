// -----------------------------------------------------------------------------
// Recovery Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Recovery aggregate.
 *
 * Represents the externally exposed identifier of a Recovery within the
 * Authentication domain.
 *
 * The identifier is safe to use across application, presentation,
 * integration, and other bounded contexts without exposing the internal
 * database identifier.
 *
 * This is an opaque identifier and does not contain recovery-token material
 * or other authentication secrets.
 */
export class RecoveryPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'REC');
  }
}
