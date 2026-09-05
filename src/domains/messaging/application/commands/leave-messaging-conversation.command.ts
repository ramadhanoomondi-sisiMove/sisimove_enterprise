// -----------------------------------------------------------------------------
// Messaging Conversation — Leave Participant Command
// -----------------------------------------------------------------------------
//
// Application command for removing a participant from active participation
// by voluntarily leaving the Messaging Conversation.
//
// The command expresses the intent for a participant to leave.
//
// Responsibilities:
//
// - identify the target conversation;
// - identify the participant;
// - carry correlation/causation metadata;
// - optionally carry the leave timestamp.
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
// MessagingConversationAggregate.leaveParticipant().
//
// The participant entity owns its local ACTIVE -> LEFT transition and
// timestamp invariants.
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

export class LeaveMessagingConversationCommand implements Command {
  public constructor(
    public readonly conversationId: UniqueEntityId,
    public readonly conversationPublicId: MessagingConversationPublicId,
    public readonly participantId: UniqueEntityId,
    public readonly participantPublicId: MessagingConversationParticipantPublicId,
    public readonly correlationId: string,
    public readonly leftAt: Date | undefined = undefined,
    public readonly causationId?: string,
  ) {}
}

export default LeaveMessagingConversationCommand;
