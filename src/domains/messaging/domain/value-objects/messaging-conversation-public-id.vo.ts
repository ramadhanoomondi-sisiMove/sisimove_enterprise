// -----------------------------------------------------------------------------
// Messaging Conversation Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of a Messaging Conversation.
 *
 * Represents the externally exposed identifier used to reference a
 * Messaging Conversation without exposing its internal database identifier.
 *
 * The Messaging Conversation remains owned by the Messaging domain.
 */
export class MessagingConversationPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'MSG');
  }
}
