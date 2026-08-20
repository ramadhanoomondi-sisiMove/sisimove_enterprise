// -----------------------------------------------------------------------------
// Journey Completion Dispute Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Completion dispute.
 *
 * Represents the externally exposed identity of an individual dispute
 * raised against a Journey Completion.
 *
 * The dispute belongs to the Journey Completion aggregate and records
 * a challenge to the completion process.
 *
 * This public identifier is distinct from the internal persistence
 * identifier represented by UniqueEntityId.
 */
export class JourneyCompletionDisputePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'JCD');
  }
}
