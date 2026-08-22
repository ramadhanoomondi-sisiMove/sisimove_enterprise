// -----------------------------------------------------------------------------
// Commercial Booking Commission Journey Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the Journey associated with a Commercial Booking
 * Commission.
 *
 * Represents the externally exposed identifier of the Journey from the
 * Journey domain.
 *
 * This value object intentionally does not establish a persistence relation
 * to the Journey domain because Journey is owned by another bounded context.
 */
export class CommercialBookingCommissionJourneyPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'JRN');
  }
}
