// -----------------------------------------------------------------------------
// Messaging Conversation — Aggregate
// -----------------------------------------------------------------------------
//
// Represents the Messaging Conversation aggregate.
//
// Aggregate boundary:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity[]
//
// The MessagingConversationAggregate is the consistency boundary for:
//
// - conversation lifecycle;
// - conversation participants;
// - messages belonging to the conversation;
// - participant membership;
// - participant message permissions;
// - conversation closure.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain the MessagingConversationEntity root;
// - maintain conversation participants;
// - maintain messages;
// - enforce participant uniqueness;
// - enforce message uniqueness;
// - ensure messages belong to the aggregate conversation;
// - ensure participants belong to the aggregate conversation;
// - prevent messages from being sent by non-participants;
// - prevent messages from being sent by inactive participants;
// - prevent mutation after conversation closure;
// - manage participant lifecycle;
// - manage conversation closure;
// - record Messaging domain events.
//
// -----------------------------------------------------------------------------
//
// This aggregate does NOT:
//
// - load Identity aggregates;
// - validate whether member identities exist;
// - validate Journey aggregates;
// - validate Booking aggregates;
// - load Asset aggregates;
// - access repositories;
// - access Prisma;
// - perform authorization;
// - deliver messages;
// - send push notifications;
// - moderate content externally.
//
// Cross-domain validation and workflow orchestration belong to the application
// layer or appropriate domain policies.
//
// -----------------------------------------------------------------------------
//
// Aggregate relationships:
//
// MessagingConversationEntity owns:
//
// - journeyPublicId;
// - optional bookingPublicId;
// - conversation type;
// - conversation status;
// - lifecycle timestamps.
//
// MessagingConversationParticipantEntity represents membership within the
// conversation.
//
// MessagingMessageEntity represents messages belonging to the conversation.
//
// Prisma foreign keys are persistence concerns and are not used as mutable
// aggregate relationships.
//
// -----------------------------------------------------------------------------
//
// Aggregate identity:
//
// The aggregate identity is the MessagingConversationEntity identity.
//
// Domain events emitted by this aggregate are therefore conversation-rooted,
// even when the event concerns a participant or message.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { MessagingException } from '../exceptions/messaging.exception';

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

import { MessagingConversationClosedEvent } from '../events/messaging-conversation-closed.event';
import { MessagingConversationCreatedEvent } from '../events/messaging-conversation-created.event';
import { MessagingMessageDeletedEvent } from '../events/messaging-message-deleted.event';
import { MessagingMessageEditedEvent } from '../events/messaging-message-edited.event';
import { MessagingMessageModeratedEvent } from '../events/messaging-message-moderated.event';
import { MessagingMessageSentEvent } from '../events/messaging-message-sent.event';
import { MessagingParticipantAddedEvent } from '../events/messaging-participant-added.event';
import { MessagingParticipantLeftEvent } from '../events/messaging-participant-left.event';
import { MessagingParticipantRemovedEvent } from '../events/messaging-participant-removed.event';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { MessagingConversationEntity } from '../entities/messaging-conversation.entity';
import { MessagingConversationParticipantEntity } from '../entities/messaging-conversation-participant.entity';
import { MessagingMessageEntity } from '../entities/messaging-message.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { MessagingMemberPublicId } from '../value-objects/messaging-member-public-id.vo';
import { MessagingMessageContent } from '../value-objects/messaging-message-content.vo';

import type { MessagingConversationPublicId } from '../value-objects/messaging-conversation-public-id.vo';
import type { MessagingConversationStatus } from '../value-objects/messaging-conversation-status.vo';

// =============================================================================
// Properties
// =============================================================================

export interface MessagingConversationAggregateProps {
  conversation: MessagingConversationEntity;

  participants: MessagingConversationParticipantEntity[];

  messages: MessagingMessageEntity[];
}

// =============================================================================
// Aggregate
// =============================================================================

export class MessagingConversationAggregate extends AggregateRoot<
  MessagingConversationAggregateProps,
  MessagingConversationPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: MessagingConversationAggregateProps) {
    super(props, props.conversation.id, props.conversation.publicId);

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a Messaging Conversation aggregate.
   *
   * Creation itself does not automatically record a domain event because
   * correlation metadata belongs to the application workflow.
   *
   * The application workflow should call recordCreated() after the aggregate
   * has been created and correlation metadata is available.
   */
  public static create(
    conversation: MessagingConversationEntity,
    participants: MessagingConversationParticipantEntity[] = [],
    messages: MessagingMessageEntity[] = [],
  ): MessagingConversationAggregate {
    MessagingConversationAggregate.ensureConversation(conversation);
    MessagingConversationAggregate.ensureParticipants(participants);
    MessagingConversationAggregate.ensureMessages(messages);

    return new MessagingConversationAggregate({
      conversation,
      participants: [...participants],
      messages: [...messages],
    });
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Messaging Conversation aggregate.
   *
   * Rehydration never emits domain events.
   *
   * Historical participant state is preserved.
   *
   * In particular, messages sent before a participant left or was removed
   * remain valid historical messages.
   */
  public static rehydrate(
    conversation: MessagingConversationEntity,
    participants: MessagingConversationParticipantEntity[],
    messages: MessagingMessageEntity[],
  ): MessagingConversationAggregate {
    MessagingConversationAggregate.ensureConversation(conversation);
    MessagingConversationAggregate.ensureParticipants(participants);
    MessagingConversationAggregate.ensureMessages(messages);

    return new MessagingConversationAggregate({
      conversation,
      participants: [...participants],
      messages: [...messages],
    });
  }

  // ===========================================================================
  // Conversation
  // ===========================================================================

  public get conversation(): MessagingConversationEntity {
    return this.props.conversation;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  public override get id(): UniqueEntityId {
    return this.conversation.id;
  }

  public override get publicId(): MessagingConversationPublicId {
    return this.conversation.publicId;
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  public get status(): MessagingConversationStatus {
    return this.conversation.status;
  }

  public isActive(): boolean {
    return this.conversation.isActive();
  }

  public isClosed(): boolean {
    return this.conversation.isClosed();
  }

  public canAcceptMessages(): boolean {
    return this.conversation.canReceiveMessages();
  }

  // ===========================================================================
  // Participants
  // ===========================================================================

  public get participants(): readonly MessagingConversationParticipantEntity[] {
    return this.props.participants;
  }

  public get participantCount(): number {
    return this.props.participants.length;
  }

  public hasParticipants(): boolean {
    return this.props.participants.length > 0;
  }

  public hasParticipant(participantId: UniqueEntityId): boolean {
    MessagingConversationAggregate.ensureInternalId(participantId);

    return this.props.participants.some((participant) =>
      participant.id.equals(participantId),
    );
  }

  public getParticipant(
    participantId: UniqueEntityId,
  ): MessagingConversationParticipantEntity | undefined {
    MessagingConversationAggregate.ensureInternalId(participantId);

    return this.props.participants.find((participant) =>
      participant.id.equals(participantId),
    );
  }

  /**
   * Finds a participant by the Identity-domain member public identity.
   *
   * The member public identity is represented as an opaque Messaging
   * value object.
   */
  public findParticipantByMemberPublicId(
    memberPublicId: MessagingMemberPublicId,
  ): MessagingConversationParticipantEntity | undefined {
    MessagingConversationAggregate.ensureMemberPublicId(memberPublicId);

    return this.props.participants.find((participant) =>
      participant.belongsToMember(memberPublicId),
    );
  }

  public hasMember(memberPublicId: MessagingMemberPublicId): boolean {
    return this.findParticipantByMemberPublicId(memberPublicId) !== undefined;
  }

  // ===========================================================================
  // Add Participant
  // ===========================================================================

  public addParticipant(
    participant: MessagingConversationParticipantEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureActive();

    MessagingConversationAggregate.ensureParticipant(participant);
    MessagingConversationAggregate.ensureCorrelationId(correlationId);
    MessagingConversationAggregate.ensureOptionalCausationId(causationId);

    if (!participant.conversationId.equals(this.id)) {
      throw new MessagingException(
        'Messaging conversation participant does not belong to this conversation.',
      );
    }

    if (this.hasParticipant(participant.id)) {
      throw new MessagingException(
        'Messaging conversation cannot contain duplicate participants.',
      );
    }

    if (this.hasMember(participant.memberPublicId)) {
      throw new MessagingException(
        'Messaging conversation already contains this member.',
      );
    }

    if (!participant.isActive()) {
      throw new MessagingException(
        'Only an active messaging participant can be added to an active conversation.',
      );
    }

    this.props.participants.push(participant);

    this.addDomainEvent(
      new MessagingParticipantAddedEvent(
        this.id.value,
        this.publicId.value,
        participant.publicId.value,
        participant.memberPublicId.value,
        participant.role.value,
        participant.status.value,
        participant.joinedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Leave Participant
  // ===========================================================================

  public leaveParticipant(
    participantId: UniqueEntityId,
    correlationId: string,
    causationId?: string,
    leftAt: Date = new Date(),
  ): void {
    this.ensureActive();

    MessagingConversationAggregate.ensureInternalId(participantId);
    MessagingConversationAggregate.ensureCorrelationId(correlationId);
    MessagingConversationAggregate.ensureOptionalCausationId(causationId);

    MessagingConversationAggregate.ensureValidDate(
      leftAt,
      'participant leave date',
    );

    const participant = this.getParticipant(participantId);

    if (participant === undefined) {
      throw new MessagingException(
        'Messaging conversation participant does not belong to this conversation.',
      );
    }

    participant.leave(leftAt);

    const actualLeftAt = participant.leftAt;

    if (actualLeftAt === undefined) {
      throw new MessagingException(
        'Messaging conversation participant left without a leave timestamp.',
      );
    }

    this.addDomainEvent(
      new MessagingParticipantLeftEvent(
        this.id.value,
        this.publicId.value,
        participant.publicId.value,
        participant.memberPublicId.value,
        actualLeftAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Remove Participant
  // ===========================================================================

  public removeParticipant(
    participantId: UniqueEntityId,
    correlationId: string,
    causationId?: string,
    removedAt: Date = new Date(),
  ): void {
    this.ensureActive();

    MessagingConversationAggregate.ensureInternalId(participantId);
    MessagingConversationAggregate.ensureCorrelationId(correlationId);
    MessagingConversationAggregate.ensureOptionalCausationId(causationId);

    MessagingConversationAggregate.ensureValidDate(
      removedAt,
      'participant removal date',
    );

    const participant = this.getParticipant(participantId);

    if (participant === undefined) {
      throw new MessagingException(
        'Messaging conversation participant does not belong to this conversation.',
      );
    }

    participant.remove(removedAt);

    const actualRemovedAt = participant.removedAt;

    if (actualRemovedAt === undefined) {
      throw new MessagingException(
        'Messaging conversation participant was removed without a removal timestamp.',
      );
    }

    this.addDomainEvent(
      new MessagingParticipantRemovedEvent(
        this.id.value,
        this.publicId.value,
        participant.publicId.value,
        participant.memberPublicId.value,
        actualRemovedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Messages
  // ===========================================================================

  public get messages(): readonly MessagingMessageEntity[] {
    return this.props.messages;
  }

  public get messageCount(): number {
    return this.props.messages.length;
  }

  public hasMessages(): boolean {
    return this.props.messages.length > 0;
  }

  public hasMessage(messageId: UniqueEntityId): boolean {
    MessagingConversationAggregate.ensureInternalId(messageId);

    return this.props.messages.some((message) => message.id.equals(messageId));
  }

  public getMessage(
    messageId: UniqueEntityId,
  ): MessagingMessageEntity | undefined {
    MessagingConversationAggregate.ensureInternalId(messageId);

    return this.props.messages.find((message) => message.id.equals(messageId));
  }

  // ===========================================================================
  // Send Message
  // ===========================================================================

  /**
   * Adds a newly sent message to the conversation.
   *
   * The aggregate validates:
   *
   * - conversation lifecycle;
   * - message ownership;
   * - message uniqueness;
   * - sender membership;
   * - sender activity;
   * - sender membership timing;
   * - message lifecycle state.
   *
   * MessagingMessageEntity owns message-local invariants.
   */
  public sendMessage(
    message: MessagingMessageEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureActive();

    MessagingConversationAggregate.ensureMessage(message);
    MessagingConversationAggregate.ensureCorrelationId(correlationId);
    MessagingConversationAggregate.ensureOptionalCausationId(causationId);

    if (!message.conversationId.equals(this.id)) {
      throw new MessagingException(
        'Messaging message does not belong to this conversation.',
      );
    }

    if (!message.conversationPublicId.equals(this.publicId)) {
      throw new MessagingException(
        'Messaging message conversation public identity does not match this conversation.',
      );
    }

    if (this.hasMessage(message.id)) {
      throw new MessagingException(
        'Messaging conversation cannot contain duplicate messages.',
      );
    }

    const participant = this.findParticipantByMemberPublicId(
      message.senderPublicId,
    );

    if (participant === undefined) {
      throw new MessagingException(
        'Messaging message sender is not a participant in this conversation.',
      );
    }

    if (!participant.canSendMessages()) {
      throw new MessagingException(
        'Messaging message sender must be an active conversation participant.',
      );
    }

    if (message.sentAt.getTime() < participant.joinedAt.getTime()) {
      throw new MessagingException(
        'Messaging message cannot be sent before the sender joined the conversation.',
      );
    }

    if (
      participant.leftAt !== undefined &&
      message.sentAt.getTime() > participant.leftAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging message cannot be sent after the sender left the conversation.',
      );
    }

    if (
      participant.removedAt !== undefined &&
      message.sentAt.getTime() > participant.removedAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging message cannot be sent after the sender was removed from the conversation.',
      );
    }

    //
    // MessagingMessageEntity.create() creates a SENT message.
    //
    // Rehydrated messages may have another lifecycle state. Such a message
    // represents an existing historical message and cannot be inserted as a
    // newly sent message.
    //
    if (!message.isSent()) {
      throw new MessagingException(
        'Only a SENT messaging message can be added as a new conversation message.',
      );
    }

    this.props.messages.push(message);

    this.conversation.recordMessageActivity(message.sentAt);

    this.addDomainEvent(
      new MessagingMessageSentEvent(
        this.id.value,
        this.publicId.value,
        message.publicId.value,
        message.senderPublicId.value,
        message.type.value,
        message.assetPublicId?.value,
        message.sentAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Edit Message
  // ===========================================================================

  /**
   * Edits an existing message.
   *
   * The aggregate owns conversation-level rules while the message entity owns
   * message-local lifecycle and content mutation.
   */
  public editMessage(
    messageId: UniqueEntityId,
    content: string,
    correlationId: string,
    causationId?: string,
    editedAt: Date = new Date(),
  ): void {
    this.ensureActive();

    MessagingConversationAggregate.ensureInternalId(messageId);

    MessagingConversationAggregate.ensureNonEmptyString(
      content,
      'Messaging message content',
    );

    MessagingConversationAggregate.ensureCorrelationId(correlationId);
    MessagingConversationAggregate.ensureOptionalCausationId(causationId);

    MessagingConversationAggregate.ensureValidDate(
      editedAt,
      'message edit date',
    );

    const message = this.getMessage(messageId);

    if (message === undefined) {
      throw new MessagingException(
        'Messaging message does not belong to this conversation.',
      );
    }

    if (!message.canBeEdited()) {
      throw new MessagingException(
        'Messaging message cannot be edited in its current state.',
      );
    }

    //
    // MessagingMessageContent is the authoritative domain representation of
    // message content. The aggregate converts the application primitive into
    // the value object and delegates mutation to the entity.
    //
    const previousContent = message.content?.value;

    const messageContent =
      MessagingConversationAggregate.createMessageContent(content);

    //
    // editContent() owns:
    //
    // - lifecycle validation;
    // - message-type validation;
    // - content validation;
    // - timestamp ordering;
    // - mutation;
    // - unchanged-content no-op behavior.
    //
    message.editContent(messageContent, editedAt);

    const actualEditedAt = message.editedAt;

    //
    // If the content was unchanged, the entity intentionally performs a
    // no-op. No domain event should be emitted.
    //
    if (previousContent === message.content?.value) {
      return;
    }

    if (actualEditedAt === undefined) {
      throw new MessagingException(
        'Messaging message was edited without an edit timestamp.',
      );
    }

    this.addDomainEvent(
      new MessagingMessageEditedEvent(
        this.id.value,
        this.publicId.value,
        message.publicId.value,
        message.senderPublicId.value,
        actualEditedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Delete Message
  // ===========================================================================

  /**
   * Deletes an existing message.
   *
   * Message deletion remains inside the conversation aggregate boundary while
   * message-local lifecycle validation remains inside MessagingMessageEntity.
   */
  public deleteMessage(
    messageId: UniqueEntityId,
    correlationId: string,
    causationId?: string,
    deletedAt: Date = new Date(),
  ): void {
    this.ensureActive();

    MessagingConversationAggregate.ensureInternalId(messageId);
    MessagingConversationAggregate.ensureCorrelationId(correlationId);
    MessagingConversationAggregate.ensureOptionalCausationId(causationId);

    MessagingConversationAggregate.ensureValidDate(
      deletedAt,
      'message deletion date',
    );

    const message = this.getMessage(messageId);

    if (message === undefined) {
      throw new MessagingException(
        'Messaging message does not belong to this conversation.',
      );
    }

    if (!message.canBeDeleted()) {
      throw new MessagingException(
        'Messaging message cannot be deleted in its current state.',
      );
    }

    message.delete(deletedAt);

    const actualDeletedAt = message.deletedAt;

    if (actualDeletedAt === undefined) {
      throw new MessagingException(
        'Messaging message was deleted without a deletion timestamp.',
      );
    }

    this.addDomainEvent(
      new MessagingMessageDeletedEvent(
        this.id.value,
        this.publicId.value,
        message.publicId.value,
        message.senderPublicId.value,
        actualDeletedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Moderate Message
  // ===========================================================================

  /**
   * Moderates an existing message.
   *
   * External moderation systems are deliberately outside this aggregate.
   * The aggregate only records the domain lifecycle transition.
   */
  public moderateMessage(
    messageId: UniqueEntityId,
    correlationId: string,
    causationId?: string,
    moderatedAt: Date = new Date(),
  ): void {
    this.ensureActive();

    MessagingConversationAggregate.ensureInternalId(messageId);
    MessagingConversationAggregate.ensureCorrelationId(correlationId);
    MessagingConversationAggregate.ensureOptionalCausationId(causationId);

    MessagingConversationAggregate.ensureValidDate(
      moderatedAt,
      'message moderation date',
    );

    const message = this.getMessage(messageId);

    if (message === undefined) {
      throw new MessagingException(
        'Messaging message does not belong to this conversation.',
      );
    }

    if (!message.canBeModerated()) {
      throw new MessagingException(
        'Messaging message cannot be moderated in its current state.',
      );
    }

    message.moderate(moderatedAt);

    const actualModeratedAt = message.moderatedAt;

    if (actualModeratedAt === undefined) {
      throw new MessagingException(
        'Messaging message was moderated without a moderation timestamp.',
      );
    }

    this.addDomainEvent(
      new MessagingMessageModeratedEvent(
        this.id.value,
        this.publicId.value,
        message.publicId.value,
        message.senderPublicId.value,
        actualModeratedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Conversation Creation Event
  // ===========================================================================

  /**
   * Records the conversation-created domain event.
   *
   * Creation-event recording is deliberately separate from aggregate
   * construction so correlation and causation metadata can be supplied by the
   * application workflow.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    MessagingConversationAggregate.ensureCorrelationId(correlationId);
    MessagingConversationAggregate.ensureOptionalCausationId(causationId);

    this.addDomainEvent(
      new MessagingConversationCreatedEvent(
        this.id.value,
        this.publicId.value,
        this.conversation.type.value,
        this.conversation.status.value,
        this.conversation.journeyPublicId.value,
        this.conversation.bookingPublicId?.value,
        this.conversation.createdAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Close Conversation
  // ===========================================================================

  /**
   * Closes the conversation.
   *
   * Closing is terminal. The conversation entity owns the lifecycle transition
   * and timestamp invariants.
   */
  public close(
    correlationId: string,
    causationId?: string,
    closedAt: Date = new Date(),
  ): void {
    MessagingConversationAggregate.ensureCorrelationId(correlationId);
    MessagingConversationAggregate.ensureOptionalCausationId(causationId);

    MessagingConversationAggregate.ensureValidDate(
      closedAt,
      'conversation closure date',
    );

    if (this.isClosed()) {
      throw new MessagingException('Messaging conversation is already closed.');
    }

    this.conversation.close(closedAt);

    const actualClosedAt = this.conversation.closedAt;

    if (actualClosedAt === undefined) {
      throw new MessagingException(
        'Messaging conversation was closed without a closure timestamp.',
      );
    }

    this.addDomainEvent(
      new MessagingConversationClosedEvent(
        this.id.value,
        this.publicId.value,
        actualClosedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Aggregate Invariants
  // ===========================================================================

  /**
   * Validates all invariants spanning multiple entities inside the aggregate.
   *
   * Entity-local invariants remain owned by their respective entities.
   */
  private validateAggregateInvariants(): void {
    MessagingConversationAggregate.ensureConversation(this.conversation);
    MessagingConversationAggregate.ensureParticipants(this.participants);
    MessagingConversationAggregate.ensureMessages(this.messages);

    this.ensureParticipantMembershipIsUnique();
    this.ensureParticipantMemberPublicIdsAreUnique();
    this.ensureParticipantConversationOwnership();

    this.ensureMessageIdsAreUnique();
    this.ensureMessageConversationOwnership();
    this.ensureMessageSendersAreParticipants();
    this.ensureMessageTemporalConsistency();

    if (this.isClosed()) {
      this.ensureClosedConversationState();
    }
  }

  // ===========================================================================
  // Participant Invariants
  // ===========================================================================

  /**
   * Participant entity identities must be unique within the aggregate.
   */
  private ensureParticipantMembershipIsUnique(): void {
    const participantIds = new Set<string>();

    for (const participant of this.participants) {
      const participantId = participant.id.value;

      if (participantIds.has(participantId)) {
        throw new MessagingException(
          'Messaging conversation cannot contain duplicate participants.',
        );
      }

      participantIds.add(participantId);
    }
  }

  /**
   * A member can participate only once in a conversation.
   *
   * Participant entity identity and member identity are deliberately
   * different uniqueness constraints.
   */
  private ensureParticipantMemberPublicIdsAreUnique(): void {
    const memberPublicIds = new Set<string>();

    for (const participant of this.participants) {
      const memberPublicId = participant.memberPublicId.value;

      if (memberPublicIds.has(memberPublicId)) {
        throw new MessagingException(
          'Messaging conversation cannot contain duplicate participant members.',
        );
      }

      memberPublicIds.add(memberPublicId);
    }
  }

  /**
   * Every participant must belong to this conversation aggregate.
   */
  private ensureParticipantConversationOwnership(): void {
    for (const participant of this.participants) {
      if (!participant.conversationId.equals(this.id)) {
        throw new MessagingException(
          'Messaging conversation contains a participant belonging to another conversation.',
        );
      }
    }
  }

  // ===========================================================================
  // Message Invariants
  // ===========================================================================

  /**
   * Message entity identities must be unique within the aggregate.
   */
  private ensureMessageIdsAreUnique(): void {
    const messageIds = new Set<string>();

    for (const message of this.messages) {
      const messageId = message.id.value;

      if (messageIds.has(messageId)) {
        throw new MessagingException(
          'Messaging conversation cannot contain duplicate messages.',
        );
      }

      messageIds.add(messageId);
    }
  }

  /**
   * Every message must belong to this conversation aggregate.
   */
  private ensureMessageConversationOwnership(): void {
    for (const message of this.messages) {
      if (!message.conversationId.equals(this.id)) {
        throw new MessagingException(
          'Messaging conversation contains a message belonging to another conversation.',
        );
      }

      if (!message.conversationPublicId.equals(this.publicId)) {
        throw new MessagingException(
          'Messaging conversation contains a message with a mismatched conversation public identity.',
        );
      }
    }
  }

  /**
   * Every message sender must have membership in the conversation.
   *
   * Membership is checked independently from participant activity because
   * historical messages remain valid after a participant leaves or is removed.
   */
  private ensureMessageSendersAreParticipants(): void {
    for (const message of this.messages) {
      if (!this.hasMember(message.senderPublicId)) {
        throw new MessagingException(
          'Messaging conversation contains a message whose sender is not a participant.',
        );
      }
    }
  }

  /**
   * Validates the temporal relationship between messages and participant
   * membership.
   *
   * A message cannot exist before its sender joined the conversation.
   *
   * A message also cannot occur after the participant's terminal membership
   * transition.
   *
   * This allows historical messages from participants who later LEFT or were
   * REMOVED while still rejecting impossible aggregate state.
   */
  private ensureMessageTemporalConsistency(): void {
    for (const message of this.messages) {
      const participant = this.findParticipantByMemberPublicId(
        message.senderPublicId,
      );

      if (participant === undefined) {
        throw new MessagingException(
          'Messaging conversation contains a message whose sender is not a participant.',
        );
      }

      const messageTime = message.sentAt.getTime();
      const joinedTime = participant.joinedAt.getTime();

      if (messageTime < joinedTime) {
        throw new MessagingException(
          'Messaging conversation contains a message sent before the sender joined the conversation.',
        );
      }

      if (
        participant.leftAt !== undefined &&
        messageTime > participant.leftAt.getTime()
      ) {
        throw new MessagingException(
          'Messaging conversation contains a message sent after the sender left the conversation.',
        );
      }

      if (
        participant.removedAt !== undefined &&
        messageTime > participant.removedAt.getTime()
      ) {
        throw new MessagingException(
          'Messaging conversation contains a message sent after the sender was removed from the conversation.',
        );
      }
    }
  }

  // ===========================================================================
  // Closed Conversation Invariants
  // ===========================================================================

  private ensureClosedConversationState(): void {
    if (this.conversation.closedAt === undefined) {
      throw new MessagingException(
        'Closed messaging conversation must contain a closure timestamp.',
      );
    }
  }

  // ===========================================================================
  // Conversation State Guard
  // ===========================================================================

  /**
   * Guards operations that require an operationally active conversation.
   *
   * CLOSED is terminal.
   */
  private ensureActive(): void {
    if (!this.conversation.isActive()) {
      throw new MessagingException(
        'Messaging conversation must be active for this operation.',
      );
    }
  }

  // ===========================================================================
  // Entity Guards
  // ===========================================================================

  private static ensureConversation(
    conversation: unknown,
  ): asserts conversation is MessagingConversationEntity {
    if (!(conversation instanceof MessagingConversationEntity)) {
      throw new MessagingException(
        'Messaging conversation aggregate requires a valid MessagingConversationEntity.',
      );
    }
  }

  private static ensureParticipant(
    participant: unknown,
  ): asserts participant is MessagingConversationParticipantEntity {
    if (!(participant instanceof MessagingConversationParticipantEntity)) {
      throw new MessagingException(
        'Messaging conversation participant must be a valid MessagingConversationParticipantEntity.',
      );
    }
  }

  private static ensureParticipants(
    participants: unknown,
  ): asserts participants is MessagingConversationParticipantEntity[] {
    if (!Array.isArray(participants)) {
      throw new MessagingException(
        'Messaging conversation participants must be an array.',
      );
    }

    for (const participant of participants) {
      MessagingConversationAggregate.ensureParticipant(participant);
    }
  }

  private static ensureMessage(
    message: unknown,
  ): asserts message is MessagingMessageEntity {
    if (!(message instanceof MessagingMessageEntity)) {
      throw new MessagingException(
        'Messaging message must be a valid MessagingMessageEntity.',
      );
    }
  }

  private static ensureMessages(
    messages: unknown,
  ): asserts messages is MessagingMessageEntity[] {
    if (!Array.isArray(messages)) {
      throw new MessagingException(
        'Messaging conversation messages must be an array.',
      );
    }

    for (const message of messages) {
      MessagingConversationAggregate.ensureMessage(message);
    }
  }

  // ===========================================================================
  // Identity Guards
  // ===========================================================================

  private static ensureInternalId(id: unknown): asserts id is UniqueEntityId {
    if (!(id instanceof UniqueEntityId)) {
      throw new MessagingException(
        'Messaging internal identity must be a valid internal entity identity.',
      );
    }
  }

  private static ensureMemberPublicId(
    memberPublicId: unknown,
  ): asserts memberPublicId is MessagingMemberPublicId {
    if (!(memberPublicId instanceof MessagingMemberPublicId)) {
      throw new MessagingException(
        'Messaging member public identity must be a valid value object.',
      );
    }
  }

  // ===========================================================================
  // Message Content
  // ===========================================================================

  /**
   * Converts application-facing primitive content into the Messaging Message
   * content value object.
   *
   * MessagingMessageContent owns its own validation. The aggregate therefore
   * does not duplicate the value object's length/content rules.
   */
  private static createMessageContent(
    content: string,
  ): MessagingMessageContent {
    return MessagingMessageContent.create(content);
  }

  // ===========================================================================
  // Event Guards
  // ===========================================================================

  private static ensureCorrelationId(correlationId: string): void {
    MessagingConversationAggregate.ensureNonEmptyString(
      correlationId,
      'Messaging correlation identity',
    );
  }

  private static ensureOptionalCausationId(
    causationId: string | undefined,
  ): void {
    if (causationId === undefined) {
      return;
    }

    MessagingConversationAggregate.ensureNonEmptyString(
      causationId,
      'Messaging causation identity',
    );
  }

  // ===========================================================================
  // Primitive Guards
  // ===========================================================================

  private static ensureNonEmptyString(
    value: unknown,
    fieldName: string,
  ): asserts value is string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new MessagingException(`${fieldName} must be a non-empty string.`);
    }
  }

  // ===========================================================================
  // Date Guards
  // ===========================================================================

  private static ensureValidDate(
    value: unknown,
    fieldName: string,
  ): asserts value is Date {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new MessagingException(
        `Messaging ${fieldName} must be a valid date.`,
      );
    }
  }
}
