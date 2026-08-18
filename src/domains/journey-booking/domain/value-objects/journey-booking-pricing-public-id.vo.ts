// -----------------------------------------------------------------------------
// Journey Booking Pricing Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Booking Pricing entity.
 *
 * This represents the externally exposed `publicId` of the pricing snapshot,
 * not the internal persistence identity (`id`).
 */
export class JourneyBookingPricingPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JBP');
  }
}
