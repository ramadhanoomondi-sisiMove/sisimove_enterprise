// -----------------------------------------------------------------------------
// Support Case Participant Public ID
// -----------------------------------------------------------------------------
//
// Public identity of a Support Case Participant entity.
//
// This is distinct from memberPublicId, which is a cross-domain reference
// to the Identity member participating in the Support Case.
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
 * Public identifier of a participant within a Support Case.
 *
 * This identifies the SupportCaseParticipant entity itself.
 *
 * It is distinct from the participant's memberPublicId, which identifies
 * the Identity member participating in the case.
 */
export class SupportCaseParticipantPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Creates a Support Case Participant public ID.
   */
  public constructor(value?: string) {
    super(value, 'SCP');
  }
}
