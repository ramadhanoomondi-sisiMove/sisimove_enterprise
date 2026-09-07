// -----------------------------------------------------------------------------
// Support Case Message Public ID
// -----------------------------------------------------------------------------
//
// Public identity of a Support Case Message entity.
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
 * Public identifier of a Support Case Message.
 *
 * This identifies the message entity within the Support domain.
 */
export class SupportCaseMessagePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Creates a Support Case Message public ID.
   */
  public constructor(value?: string) {
    super(value, 'SCM');
  }
}
