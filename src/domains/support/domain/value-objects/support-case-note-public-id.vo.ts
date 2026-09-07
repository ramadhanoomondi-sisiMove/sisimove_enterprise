// -----------------------------------------------------------------------------
// Support Case Note Public ID
// -----------------------------------------------------------------------------
//
// Public identity of a Support Case Note entity.
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
 * Public identifier of a Support Case Note.
 *
 * This identifies the note entity within the Support domain.
 */
export class SupportCaseNotePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Creates a Support Case Note public ID.
   */
  public constructor(value?: string) {
    super(value, 'SCN');
  }
}
