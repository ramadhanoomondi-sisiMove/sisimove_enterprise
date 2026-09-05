// -----------------------------------------------------------------------------
// Messaging Conversation Participant Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of a Messaging Conversation Participant.
 *
 * Represents the externally exposed identifier used to reference a
 * participant record without exposing its internal database identifier.
 *
 * The participant remains owned by the Messaging domain and belongs to a
 * Messaging Conversation aggregate.
 */
export class MessagingConversationParticipantPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'MCP');
  }
}
