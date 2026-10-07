// -----------------------------------------------------------------------------
// sisiMove — Get My Journey Booking Details Query
// -----------------------------------------------------------------------------
//
// Purpose
// -------
//
// Requests the passenger-facing detail representations of all Journey
// Bookings belonging to the currently authenticated passenger.
//
// This is a purpose-specific application read query.
//
// It does NOT return JourneyBookingAggregate instances directly to the
// presentation layer. The corresponding query handler is responsible for:
//
//   1. loading the Journey Bookings belonging to the passenger;
//   2. reading each booking's historical snapshot;
//   3. reading each booking's authoritative stored pricing;
//   4. reading each booking's limited passenger-safe payment state;
//   5. reading each booking's cancellation state;
//   6. resolving the referenced Journey;
//   7. resolving each Journey provider's public Traveller profile;
//   8. resolving each Journey provider's public Trust profile;
//   9. composing the passenger-facing detail representations.
//
// Aggregate boundary
// ------------------
//
// JourneyBookingAggregate
// └── JourneyBookingEntity
//     ├── JourneyBookingSnapshotEntity?
//     ├── JourneyBookingPricingEntity?
//     ├── JourneyBookingPaymentEntity?
//     └── JourneyBookingCancellationEntity?
//
// The query does NOT introduce Journey, Traveller, or Trust entities into the
// JourneyBooking aggregate. Those belong to their own bounded contexts and
// are composed at the application read boundary.
//
// Ownership
// ---------
//
// The passenger public ID identifies WHO is requesting the collection.
//
// Unlike GetJourneyBookingDetailQuery, this query does not accept an
// individual Journey Booking public ID because the requested resource is the
// authenticated passenger's complete booking collection.
//
// The handler uses the supplied passenger public ID to ensure that only
// bookings belonging to the authenticated passenger are loaded.
//
// The client must never supply an arbitrary passenger public identifier.
//
// Value Objects
// ------------
//
// The passenger identifier is represented by the domain Value Object:
//
//   JourneyBookingPassengerPublicId
//
// Therefore the query accepts the Value Object directly rather than
// degrading it back to a primitive string.
//
// This keeps the application query strongly typed and prevents accidental
// mixing of different public-identifier concepts.
//
// Pagination
// ----------
//
// Pagination is intentionally not introduced until it is explicitly
// supported by the application query and repository contracts.
//
// Filtering and transport-specific concerns also remain outside this query.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Journey Booking — Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBookingPassengerPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Requests the passenger-facing detail representations of the authenticated
 * passenger's Journey Bookings.
 *
 * This query intentionally differs from GetMyJourneyBookingsQuery.
 *
 * GetMyJourneyBookingsQuery answers:
 *
 *     "Retrieve the lightweight Journey Bookings belonging to this passenger."
 *
 * This query answers:
 *
 *     "Retrieve the authorized passenger-facing detail views for this
 *      passenger's bookings."
 *
 * The latter is an application read use case because each resulting view
 * may cross bounded-context boundaries.
 */
export class GetMyJourneyBookingDetailsQuery extends Query {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    /**
     * Public identity of the authenticated passenger requesting the booking
     * collection.
     *
     * The handler uses this value to load only Journey Bookings belonging to
     * the authenticated passenger.
     */
    public readonly passengerPublicId: JourneyBookingPassengerPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMyJourneyBookingDetailsQuery;
