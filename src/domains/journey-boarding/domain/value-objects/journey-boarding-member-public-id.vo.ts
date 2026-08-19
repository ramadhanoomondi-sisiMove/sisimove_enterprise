// -----------------------------------------------------------------------------
// Journey Boarding Member Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Boarding participant member.
 *
 * Represents the externally exposed identity of the member participating
 * in the physical boarding process.
 *
 * This is distinct from the Journey Boarding participant identity.
 */
export class JourneyBoardingMemberPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'MEM');
  }
}
