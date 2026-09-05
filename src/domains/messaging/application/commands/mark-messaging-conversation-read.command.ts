// -----------------------------------------------------------------------------
// Messaging Conversation — Mark Read Command
// -----------------------------------------------------------------------------
//
// Application command for recording that a Messaging Conversation participant
// has read messages up to a specified point in time.
//
// The command expresses the intent to update participant read state.
//
// Responsibilities:
//
// - identify the target conversation;
// - identify the participant;
// - carry the read timestamp;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - load the aggregate;
// - mutate the participant;
// - access Prisma;
// - access repositories;
// - authorize the caller;
// - publish domain events.
//
// Participant read-state mutation belongs to the participant entity through
// the aggregate/application workflow.
//
// The participant entity owns:
//
// - ACTIVE-state validation;
// - read timestamp validation;
// - monotonic read-state progression.
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

import type { MessagingConversationParticipantPublicId } from '../../domain/value-objects/messaging-conversation-participant-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class MarkMessagingConversationReadCommand implements Command {
  public constructor(
    public readonly conversationId: UniqueEntityId,
    public readonly conversationPublicId: MessagingConversationPublicId,
    public readonly participantId: UniqueEntityId,
    public readonly participantPublicId: MessagingConversationParticipantPublicId,
    public readonly readAt: Date,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}

export default MarkMessagingConversationReadCommand;
