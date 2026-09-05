// -----------------------------------------------------------------------------
// Messaging Conversation — Remove Participant Command
// -----------------------------------------------------------------------------
//
// Application command for removing a participant from a Messaging Conversation.
//
// The command expresses the intent to remove a participant.
//
// Responsibilities:
//
// - identify the target conversation;
// - identify the participant;
// - carry correlation/causation metadata;
// - optionally carry the removal timestamp.
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
// Participant lifecycle mutation belongs to
// MessagingConversationAggregate.removeParticipant().
//
// The participant entity owns its local ACTIVE -> REMOVED transition and
// timestamp invariants.
//
// Authorization for removing another participant belongs to the application
// or authorization boundary, not this command.
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

export class RemoveMessagingParticipantCommand implements Command {
  public constructor(
    public readonly conversationId: UniqueEntityId,
    public readonly conversationPublicId: MessagingConversationPublicId,
    public readonly participantId: UniqueEntityId,
    public readonly participantPublicId: MessagingConversationParticipantPublicId,
    public readonly correlationId: string,
    public readonly removedAt: Date | undefined = undefined,
    public readonly causationId?: string,
  ) {}
}

export default RemoveMessagingParticipantCommand;
