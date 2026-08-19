// -----------------------------------------------------------------------------
// Journey Boarding Booking Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the Journey Booking associated with a boarding
 * participant.
 *
 * Represents the externally exposed `publicId` of the Journey Booking
 * that established the participant's entitlement to board the journey.
 *
 * This is distinct from the Journey Boarding participant identity.
 *
 * The booking identity is optional at the persistence level because a
 * Journey Boarding participant may exist without a Journey Booking
 * reference, such as the journey provider.
 */
export class JourneyBoardingBookingPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'JBO');
  }
}
