// -----------------------------------------------------------------------------
// Journey Completion Confirmation Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Completion confirmation.
 *
 * Represents the externally exposed identity of an individual confirmation
 * recorded against a Journey Completion.
 *
 * The confirmation belongs to the Journey Completion aggregate and records
 * the confirmation decision of a provider or passenger.
 *
 * This public identifier is distinct from the internal persistence
 * identifier represented by UniqueEntityId.
 */
export class JourneyCompletionConfirmationPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'JCC');
  }
}
