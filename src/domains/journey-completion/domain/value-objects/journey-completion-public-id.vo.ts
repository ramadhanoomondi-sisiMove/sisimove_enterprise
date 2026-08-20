// -----------------------------------------------------------------------------
// Journey Completion Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Completion aggregate.
 *
 * Represents the externally exposed identifier of the completion record
 * associated with a Journey.
 *
 * The public identifier is intentionally distinct from the internal
 * persistence identifier represented by UniqueEntityId.
 */
export class JourneyCompletionPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'JCP');
  }
}
