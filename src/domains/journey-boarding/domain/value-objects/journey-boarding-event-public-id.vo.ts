// -----------------------------------------------------------------------------
// Journey Boarding Event Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Boarding event.
 *
 * Represents the externally exposed `publicId` of a boarding event.
 *
 * This is distinct from the internal persistence identity (`id`).
 */
export class JourneyBoardingEventPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'JBE');
  }
}
