// -----------------------------------------------------------------------------
// Journey Booking Snapshot Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Booking Snapshot.
 *
 * This represents the externally exposed `publicId` of the snapshot,
 * distinct from the internal persistence identity (`id`) and the parent
 * Journey Booking public identity.
 */
export class JourneyBookingSnapshotPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JBS');
  }
}
