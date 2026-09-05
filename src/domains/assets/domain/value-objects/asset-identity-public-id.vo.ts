// -----------------------------------------------------------------------------
// Asset Identity Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the Identity that owns an Asset.
 *
 * Represents the externally exposed identifier of the Identity associated with
 * and owning the Asset.
 *
 * This is an opaque cross-domain reference to the Identity aggregate and does
 * not expose the internal database identifier.
 *
 * The Asset domain owns asset metadata, classification, lifecycle, visibility,
 * and storage references, while the referenced Identity remains owned by the
 * Identity domain.
 */
export class AssetIdentityPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value: string) {
    super(value, 'ID');
  }
}
