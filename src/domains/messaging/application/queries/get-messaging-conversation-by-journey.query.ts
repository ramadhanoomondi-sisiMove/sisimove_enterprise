// -----------------------------------------------------------------------------
// Messaging — Get Messaging Conversation By Journey Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Messaging Conversation aggregates
// associated with a Journey.
//
// MessagingJourneyPublicId is an opaque cross-domain reference to
// Journey.publicId.
//
// The query handler is responsible for loading conversations through
// MessagingConversationRepository.findByJourneyPublicId().
//
// This query does NOT:
//
// - load the Journey aggregate;
// - validate Journey state;
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

import type { MessagingJourneyPublicId } from '../../domain/value-objects/messaging-journey-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetMessagingConversationByJourneyQuery implements Query {
  public constructor(
    /**
     * Public identifier of the Journey associated with the conversations.
     */
    public readonly journeyPublicId: MessagingJourneyPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingConversationByJourneyQuery;
