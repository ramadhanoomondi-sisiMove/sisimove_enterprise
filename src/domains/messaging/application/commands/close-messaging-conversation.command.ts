// -----------------------------------------------------------------------------
// Messaging Conversation — Close Command
// -----------------------------------------------------------------------------
//
// Application command for closing a Messaging Conversation.
//
// The command expresses the intent to close an existing conversation.
//
// Responsibilities:
//
// - identify the Messaging Conversation;
// - carry correlation/causation metadata;
// - optionally carry the requested closure timestamp.
//
// This command does NOT:
//
// - load the aggregate;
// - close the aggregate;
// - access Prisma;
// - access repositories;
// - publish domain events;
// - authorize the caller.
//
// Aggregate loading and lifecycle mutation belong to the application handler
// and MessagingConversationAggregate.
//
// Closing is a terminal domain transition owned by the aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

import type { MessagingConversationPublicId } from '../../domain/value-objects/messaging-conversation-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class CloseMessagingConversationCommand implements Command {
  public constructor(
    public readonly conversationId: UniqueEntityId,
    public readonly conversationPublicId: MessagingConversationPublicId,
    public readonly correlationId: string,
    public readonly closedAt: Date | undefined = undefined,
    public readonly causationId?: string,
  ) {}
}

export default CloseMessagingConversationCommand;
