// -----------------------------------------------------------------------------
// sisiMove — Get Journey Booking Detail Query
// -----------------------------------------------------------------------------
//
// Purpose
// -------
//
// Requests the passenger-facing detail representation of a Journey Booking.
//
// This is a purpose-specific application read query.
//
// It does NOT return the JourneyBookingAggregate directly to the presentation
// layer. The corresponding query handler is responsible for:
//
//   1. loading the JourneyBooking aggregate;
//   2. verifying that the authenticated passenger owns the booking;
//   3. reading the booking's historical snapshot;
//   4. reading the booking's authoritative stored pricing;
//   5. reading the limited passenger-safe payment state;
//   6. resolving the referenced Journey;
//   7. resolving the Journey provider's public Traveller profile;
//   8. resolving the Journey provider's public Trust profile;
//   9. composing JourneyBookingDetailResponse.
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
// The booking public ID identifies WHAT is being requested.
//
// The passenger public ID identifies WHO is requesting it.
//
// The handler compares the supplied passenger public ID with the passenger
// public ID stored on the JourneyBooking aggregate.
//
// This prevents a caller from retrieving another passenger's booking merely
// by knowing its public booking ID.
//
// Value Objects
// ------------
//
// Both identifiers are already represented by domain Value Objects:
//
//   JourneyBookingPublicId
//   JourneyBookingPassengerPublicId
//
// Therefore the query accepts those Value Objects directly rather than
// degrading them back to primitive strings.
//
// This keeps the application query strongly typed and prevents accidental
// mixing of different public-identifier concepts.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Journey Booking — Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyBookingPassengerPublicId,
  JourneyBookingPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Requests the passenger-facing detail representation of a Journey Booking.
 *
 * This query intentionally differs from a generic aggregate retrieval query.
 *
 * A generic query answers:
 *
 *     "Retrieve the JourneyBooking aggregate identified by this public ID."
 *
 * This query answers:
 *
 *     "Retrieve the authorized passenger-facing detail view for this booking."
 *
 * The latter is an application read use case because the resulting view
 * crosses bounded-context boundaries.
 */
export class GetJourneyBookingDetailQuery extends Query {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    /**
     * Public identity of the Journey Booking being requested.
     */
    public readonly journeyBookingPublicId: JourneyBookingPublicId,

    /**
     * Public identity of the authenticated passenger requesting the booking.
     *
     * The handler uses this value to enforce ownership against the passenger
     * reference stored by the JourneyBooking aggregate.
     */
    public readonly passengerPublicId: JourneyBookingPassengerPublicId,
  ) {
    super();
  }
}
