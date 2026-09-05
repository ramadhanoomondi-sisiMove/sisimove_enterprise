// -----------------------------------------------------------------------------
// Asset Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of an Asset aggregate.
 *
 * Represents the externally exposed, stable identifier used to reference an
 * Asset across application boundaries.
 *
 * The internal database identifier remains private to the persistence layer.
 * Other domains and external consumers should reference an Asset through this
 * identifier rather than its internal persistence identifier.
 *
 * Generated identifiers use the AS prefix:
 *
 * AS-XXXXXXXX
 */
export class AssetPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'AS');
  }
}
