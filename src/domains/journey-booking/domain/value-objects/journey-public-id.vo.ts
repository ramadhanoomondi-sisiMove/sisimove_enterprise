// -----------------------------------------------------------------------------
// Journey Public ID Value Object
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey.
 *
 * This value object is used for cross-domain references to the Journey domain.
 *
 * The Journey Booking domain intentionally stores this identity instead of
 * creating a domain relation to the Journey aggregate.
 */
export class JourneyPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(value?: string) {
    super(value, 'JNY');
  }
}
