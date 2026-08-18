// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the actor who cancelled the Journey Booking.
 *
 * This is intentionally represented as a public identity because the actor
 * may belong to another bounded context, such as Identity.
 *
 * It intentionally does not establish a Prisma relation.
 */
export class JourneyBookingCancelledByPublicId extends PublicEntityId {
  constructor(value: string) {
    super(value, 'IDN');
  }
}
