// -----------------------------------------------------------------------------
// Journey Booking Cancellation Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Booking Cancellation entity.
 */
export class JourneyBookingCancellationPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JBC');
  }
}
