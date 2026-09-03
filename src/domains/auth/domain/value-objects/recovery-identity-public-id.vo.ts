// -----------------------------------------------------------------------------
// Recovery Identity Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the Identity associated with a Recovery.
 *
 * Represents the externally exposed identifier of the Identity for which the
 * Recovery operation was created.
 *
 * This is an opaque cross-domain reference to the Identity aggregate and does
 * not expose the internal database identifier.
 */
export class RecoveryIdentityPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // --------------------------------------------------------------------------- 
  public constructor(value: string) {
    super(value, 'ID');
  }
}
