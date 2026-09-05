// -----------------------------------------------------------------------------
// Messaging Message Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of a Messaging Message.
 *
 * Represents the externally exposed identifier used to reference a
 * Messaging Message without exposing its internal database identifier.
 *
 * The Messaging Message remains owned by the Messaging domain.
 */
export class MessagingMessagePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'MSG');
  }
}
