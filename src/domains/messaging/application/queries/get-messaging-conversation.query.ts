// -----------------------------------------------------------------------------
// Messaging — Get Messaging Conversation Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a single Messaging Conversation aggregate
// by its public identifier.
//
// The query handler is responsible for loading the aggregate through
// MessagingConversationRepository.findByPublicId().
//
// This query does NOT:
//
// - modify the Messaging Conversation aggregate;
// - modify MessagingConversationEntity;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization checks;
// - publish domain events;
// - perform application orchestration.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

import type { MessagingConversationPublicId } from '../../domain/value-objects/messaging-conversation-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetMessagingConversationQuery implements Query {
  public constructor(
    /**
     * Public identifier of the Messaging Conversation aggregate.
     */
    public readonly publicId: MessagingConversationPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingConversationQuery;
