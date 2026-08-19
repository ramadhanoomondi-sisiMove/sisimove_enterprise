// -----------------------------------------------------------------------------
// Journey Boarding Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the Journey Boarding aggregate.
 *
 * Represents the externally exposed `publicId`.
 *
 * This is distinct from the internal persistence identity (`id`).
 */
export class JourneyBoardingPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'JBD');
  }
}
