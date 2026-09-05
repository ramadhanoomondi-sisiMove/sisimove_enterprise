// -----------------------------------------------------------------------------
// Messaging — Get Messaging Message Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a single Messaging Message aggregate by
// its public identifier.
//
// The query handler is responsible for loading the aggregate through
// MessagingMessageRepository.findByPublicId().
//
// This query does NOT:
//
// - modify the Messaging Message aggregate;
// - modify MessagingMessageEntity;
// - load the Messaging Conversation aggregate;
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

import type { MessagingMessagePublicId } from '../../domain/value-objects/messaging-message-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetMessagingMessageQuery implements Query {
  public constructor(
    /**
     * Public identifier of the Messaging Message aggregate.
     */
    public readonly publicId: MessagingMessagePublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMessagingMessageQuery;
