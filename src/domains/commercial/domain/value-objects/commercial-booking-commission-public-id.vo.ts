// src/domains/commercial/domain/value-objects/commercial-booking-commission-public-id.vo.ts

// -----------------------------------------------------------------------------
// Commercial Booking Commission Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Commercial Booking Commission.
 *
 * Represents the externally exposed identifier of a commission assessment
 * associated with a Journey Booking.
 *
 * The public identifier is intentionally distinct from the internal
 * persistence identifier represented by UniqueEntityId.
 */
export class CommercialBookingCommissionPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'CBC');
  }
}
