// -----------------------------------------------------------------------------
// Journey Booking — Get By Public ID Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBookingPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Retrieves a Journey Booking aggregate by its public identifier.
 *
 * The query receives the validated domain value object rather than a REST
 * primitive. Presentation-layer mapping is responsible for converting the
 * incoming request value into JourneyBookingPublicId.
 */
export class GetJourneyBookingByPublicIdQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey Booking.
     */
    public readonly journeyBookingPublicId: JourneyBookingPublicId,
  ) {
    super();
  }
}
