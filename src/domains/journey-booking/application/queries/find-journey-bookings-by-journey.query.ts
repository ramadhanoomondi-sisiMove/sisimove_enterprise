// -----------------------------------------------------------------------------
// Journey Booking — Find By Journey Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Finds Journey Bookings associated with a Journey.
 *
 * The Journey is represented across the bounded-context boundary by its
 * public identifier.
 *
 * The query receives the validated JourneyPublicId domain value object.
 */
export class FindJourneyBookingsByJourneyQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey whose bookings should be retrieved.
     */
    public readonly journeyPublicId: JourneyPublicId,
  ) {
    super();
  }
}
