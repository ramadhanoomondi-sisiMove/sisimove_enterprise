// -----------------------------------------------------------------------------
// Messaging Conversation — Add Participant Command
// -----------------------------------------------------------------------------
//
// Application command for adding a participant to a Messaging Conversation.
//
// The command expresses the intent to add a new participant.
//
// Responsibilities:
//
// - identify the target conversation;
// - carry the member public identity;
// - carry the participant role;
// - optionally carry the participant join timestamp;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - create the participant entity;
// - mutate the conversation aggregate;
// - validate Identity aggregate existence;
// - access repositories;
// - access Prisma;
// - authorize the caller;
// - publish domain events.
//
// Participant construction belongs to the application handler.
//
// Participant membership and aggregate consistency rules belong to
// MessagingConversationAggregate.
//
// The member public identity remains an opaque cross-domain reference.
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

import type { MessagingMemberPublicId } from '../../domain/value-objects/messaging-member-public-id.vo';

import type { MessagingParticipantRole } from '../../domain/value-objects/messaging-participant-role.vo';

// =============================================================================
// Command
// =============================================================================

export class AddMessagingParticipantCommand implements Command {
  public constructor(
    public readonly conversationId: UniqueEntityId,
    public readonly conversationPublicId: MessagingConversationPublicId,
    public readonly memberPublicId: MessagingMemberPublicId,
    public readonly role: MessagingParticipantRole,
    public readonly correlationId: string,
    public readonly joinedAt: Date | undefined = undefined,
    public readonly causationId?: string,
  ) {}
}

export default AddMessagingParticipantCommand;
