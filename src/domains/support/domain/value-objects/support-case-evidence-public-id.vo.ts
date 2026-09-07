// -----------------------------------------------------------------------------
// Support Case Evidence Public ID
// -----------------------------------------------------------------------------
//
// Public identity of a Support Case Evidence entity.
//
// This identifier belongs to the Support domain and therefore extends the
// foundation PublicEntityId abstraction.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Public Entity ID
// -----------------------------------------------------------------------------

/**
 * Public identifier of a Support Case Evidence entity.
 *
 * This identifies the evidence entity within the Support domain.
 */
export class SupportCaseEvidencePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Creates a Support Case Evidence public ID.
   */
  public constructor(value?: string) {
    super(value, 'SCE');
  }
}
