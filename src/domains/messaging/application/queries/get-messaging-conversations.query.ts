// -----------------------------------------------------------------------------
// Messaging — Get Messaging Conversations Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Messaging Conversation aggregates.
//
// The query supports persistence-oriented conversation filtering.
//
// This query does NOT:
//
// - modify Messaging Conversation aggregates;
// - modify MessagingConversationEntity;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization checks;
// - determine conversation permissions;
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

import type { MessagingConversationType } from '../../domain/value-objects/messaging-conversation-type.vo';

import type { MessagingConversationStatus } from '../../domain/value-objects/messaging-conversation-status.vo';

// =============================================================================
// Query
// =============================================================================

export class GetMessagingConversationsQuery implements Query {
  public constructor(
    /**
     * Optional conversation type filter.
     */
    public readonly type?: MessagingConversationType,

    /**
     * Optional conversation status filter.
     */
    public readonly status?: MessagingConversationStatus,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingConversationsQuery;
