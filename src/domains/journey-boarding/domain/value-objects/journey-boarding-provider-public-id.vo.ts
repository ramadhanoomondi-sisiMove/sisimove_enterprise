// -----------------------------------------------------------------------------
// Journey Boarding Provider Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the Journey Boarding provider.
 *
 * Represents the externally exposed identity of the provider responsible
 * for the journey and its physical boarding process.
 *
 * This is distinct from the Journey Boarding aggregate identity.
 */
export class JourneyBoardingProviderPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'MEM');
  }
}
