// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the passenger referenced by a Journey Booking.
 *
 * This is a cross-domain reference to `Identity.publicId`.
 *
 * It intentionally does not establish a Prisma relation.
 */
export class JourneyBookingPassengerPublicId extends PublicEntityId {
  constructor(value: string) {
    super(value, 'IDN');
  }
}
