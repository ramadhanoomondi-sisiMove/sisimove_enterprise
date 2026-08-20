// -----------------------------------------------------------------------------
// Journey Settlement Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Settlement.
 *
 * Represents the externally exposed identity of the settlement associated
 * with a confirmed Journey Completion.
 *
 * The settlement is an internal Journey-domain entity responsible for
 * tracking the settlement lifecycle before, during, and after interaction
 * with the Financial domain.
 *
 * This public identifier is distinct from the internal persistence
 * identifier represented by UniqueEntityId.
 */
export class JourneySettlementPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'JST');
  }
}
