// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the Journey referenced by a Journey Booking.
 *
 * This is a cross-domain reference to `Journey.publicId`.
 *
 * It intentionally does not establish a Prisma relation.
 */
export class JourneyBookingJourneyPublicId extends PublicEntityId {
  constructor(value: string) {
    super(value, 'JNY');
  }
}
