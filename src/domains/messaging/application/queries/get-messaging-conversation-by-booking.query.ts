// -----------------------------------------------------------------------------
// Messaging — Get Messaging Conversation By Booking Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Messaging Conversation aggregates
// associated with a Booking.
//
// MessagingBookingPublicId is an opaque cross-domain reference to
// JourneyBooking.publicId.
//
// The query handler is responsible for loading conversations through
// MessagingConversationRepository.findByBookingPublicId().
//
// This query does NOT:
//
// - load the Booking aggregate;
// - validate Booking state;
// - modify Messaging Conversation aggregates;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization checks;
// - publish domain events.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

import type { MessagingBookingPublicId } from '../../domain/value-objects/messaging-booking-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetMessagingConversationByBookingQuery implements Query {
  public constructor(
    /**
     * Public identifier of the Booking associated with the conversations.
     */
    public readonly bookingPublicId: MessagingBookingPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingConversationByBookingQuery;
