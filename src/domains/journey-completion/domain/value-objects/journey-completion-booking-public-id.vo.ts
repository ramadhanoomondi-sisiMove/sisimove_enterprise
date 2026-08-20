// -----------------------------------------------------------------------------
// Journey Completion Booking Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the Journey Booking associated with a
 * Journey Completion confirmation.
 *
 * Represents the externally exposed identity of the booking through which
 * a passenger is associated with the completed Journey.
 *
 * This is a cross-domain reference to JourneyBooking.publicId.
 *
 * It is intentionally NOT a Prisma relation.
 */
export class JourneyCompletionBookingPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'JBK');
  }
}
