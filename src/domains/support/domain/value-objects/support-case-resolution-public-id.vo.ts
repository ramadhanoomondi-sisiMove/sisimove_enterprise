// -----------------------------------------------------------------------------
// Support Case Resolution Public ID
// -----------------------------------------------------------------------------
//
// Public identity of a Support Case Resolution entity.
//
// This is the identity of a Support domain entity, not a cross-domain
// reference. Therefore it extends the foundation PublicEntityId.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of a Support Case Resolution.
 *
 * Identifies the resolution entity within the Support domain.
 *
 * Because this identifier belongs to a Support domain entity, it extends
 * PublicEntityId rather than ValueObject<string>.
 */
export class SupportCaseResolutionPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Creates a Support Case Resolution public ID.
   *
   * When no value is supplied, PublicEntityId generates one automatically.
   */
  public constructor(value?: string) {
    super(value, 'SCR');
  }
}
