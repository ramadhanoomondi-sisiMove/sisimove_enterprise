// -----------------------------------------------------------------------------
// Messaging Message — Aggregate
// -----------------------------------------------------------------------------
//
// Represents the Messaging Message aggregate.
//
// Aggregate boundary:
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// The Messaging Message aggregate is the consistency boundary for:
//
// - message-local lifecycle;
// - message content;
// - message asset reference;
// - message editing;
// - message deletion;
// - message moderation;
// - message domain event recording.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain the MessagingMessageEntity root;
// - enforce aggregate-level invariants;
// - expose message identity;
// - expose conversation identity;
// - expose sender and message state;
// - edit mutable messages;
// - delete messages;
// - moderate messages;
// - record Messaging domain events.
//
// -----------------------------------------------------------------------------
//
// This aggregate does NOT:
//
// - own the Messaging Conversation aggregate;
// - load MessagingConversationAggregate;
// - load or validate conversation participants;
// - determine whether the sender is an active participant;
// - validate whether the referenced conversation exists;
// - validate whether the sender Identity exists;
// - validate whether the referenced Asset exists;
// - access repositories;
// - access Prisma;
// - perform authorization;
// - deliver messages;
// - send notifications;
// - perform external content moderation.
//
// Message-local lifecycle behavior belongs to MessagingMessageEntity.
//
// Conversation membership and conversation lifecycle validation belong to the
// Messaging Conversation aggregate or to the application workflow coordinating
// the operation.
//
// Cross-domain Identity and Asset validation belongs to the appropriate
// application/domain workflow.
//
// -----------------------------------------------------------------------------
//
// Domain events:
//
// Messaging message lifecycle events are conversation-rooted.
//
// The conversation identity is used as the domain-event aggregate identity,
// while messagePublicId identifies the particular message affected by the
// lifecycle transition.
//
// Message content is intentionally excluded from lifecycle event payloads.
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

import { MessagingMessageDeletedEvent } from '../events/messaging-message-deleted.event';

import { MessagingMessageEditedEvent } from '../events/messaging-message-edited.event';

import { MessagingMessageModeratedEvent } from '../events/messaging-message-moderated.event';

import { MessagingMessageSentEvent } from '../events/messaging-message-sent.event';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { MessagingMessageEntity } from '../entities/messaging-message.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { MessagingAssetPublicId } from '../value-objects/messaging-asset-public-id.vo';

import type { MessagingConversationPublicId } from '../value-objects/messaging-conversation-public-id.vo';

import type { MessagingMemberPublicId } from '../value-objects/messaging-member-public-id.vo';

import { MessagingMessageContent } from '../value-objects/messaging-message-content.vo';

import type { MessagingMessagePublicId } from '../value-objects/messaging-message-public-id.vo';

import type { MessagingMessageStatus } from '../value-objects/messaging-message-status.vo';

import type { MessagingMessageType } from '../value-objects/messaging-message-type.vo';

// =============================================================================
// Properties
// =============================================================================

export interface MessagingMessageAggregateProps {
  /**
   * Aggregate root entity.
   */
  message: MessagingMessageEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

export class MessagingMessageAggregate extends AggregateRoot<
  MessagingMessageAggregateProps,
  MessagingMessagePublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: MessagingMessageAggregateProps) {
    super(props, props.message.id, props.message.publicId);

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Messaging Message aggregate.
   *
   * Creation does not automatically emit a domain event.
   *
   * The application workflow records the sent event once correlation metadata
   * is available.
   */
  public static create(
    message: MessagingMessageEntity,
  ): MessagingMessageAggregate {
    MessagingMessageAggregate.ensureMessage(message);

    return new MessagingMessageAggregate({
      message,
    });
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Messaging Message aggregate.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    message: MessagingMessageEntity,
  ): MessagingMessageAggregate {
    MessagingMessageAggregate.ensureMessage(message);

    return new MessagingMessageAggregate({
      message,
    });
  }

  // ===========================================================================
  // Message
  // ===========================================================================

  /**
   * Aggregate root Messaging Message entity.
   */
  public get message(): MessagingMessageEntity {
    return this.props.message;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal identity of the Messaging Message aggregate.
   */
  public override get id(): UniqueEntityId {
    return this.message.id;
  }

  /**
   * Public identity of the Messaging Message aggregate.
   */
  public override get publicId(): MessagingMessagePublicId {
    return this.message.publicId;
  }

  // ===========================================================================
  // Conversation
  // ===========================================================================

  /**
   * Internal identity of the Messaging Conversation containing this message.
   *
   * The conversation remains outside this aggregate boundary.
   *
   * This reference exists only to identify the owning conversation for
   * persistence and conversation-rooted domain events.
   */
  public get conversationId(): UniqueEntityId {
    return this.message.conversationId;
  }

  /**
   * Public identity of the Messaging Conversation containing this message.
   *
   * This is a value object and therefore remains strongly typed inside the
   * domain.
   */
  public get conversationPublicId(): MessagingConversationPublicId {
    return this.message.conversationPublicId;
  }

  /**
   * Determines whether the message belongs to the supplied conversation.
   *
   * This only compares identities.
   *
   * It does not validate that the conversation exists.
   */
  public belongsToConversation(conversationId: UniqueEntityId): boolean {
    MessagingMessageAggregate.ensureInternalId(conversationId);

    return this.message.conversationId.equals(conversationId);
  }

  /**
   * Determines whether the message belongs to the supplied public
   * conversation identity.
   *
   * This only compares identities.
   *
   * It does not validate that the conversation exists.
   */
  public belongsToConversationPublicId(conversationPublicId: string): boolean {
    MessagingMessageAggregate.ensureNonEmptyString(
      conversationPublicId,
      'Messaging conversation public identity',
    );

    return this.message.conversationPublicId.value === conversationPublicId;
  }

  // ===========================================================================
  // Sender
  // ===========================================================================

  /**
   * Public identity of the member who sent the message.
   */
  public get senderPublicId(): MessagingMemberPublicId {
    return this.message.senderPublicId;
  }

  /**
   * Determines whether the supplied member sent this message.
   */
  public wasSentBy(memberPublicId: MessagingMemberPublicId): boolean {
    if (memberPublicId === undefined || memberPublicId === null) {
      throw new MessagingException(
        'Messaging message sender identity must be provided.',
      );
    }

    return this.message.wasSentBy(memberPublicId);
  }

  // ===========================================================================
  // Type
  // ===========================================================================

  /**
   * Current message type.
   */
  public get type(): MessagingMessageType {
    return this.message.type;
  }

  /**
   * Determines whether this is a text message.
   */
  public isText(): boolean {
    return this.message.isText();
  }

  /**
   * Determines whether this is an image message.
   */
  public isImage(): boolean {
    return this.message.isImage();
  }

  /**
   * Determines whether this is a file message.
   */
  public isFile(): boolean {
    return this.message.isFile();
  }

  /**
   * Determines whether this is a system message.
   */
  public isSystem(): boolean {
    return this.message.isSystem();
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current message lifecycle status.
   */
  public get status(): MessagingMessageStatus {
    return this.message.status;
  }

  /**
   * Determines whether the message is sent.
   */
  public isSent(): boolean {
    return this.message.isSent();
  }

  /**
   * Determines whether the message is edited.
   */
  public isEdited(): boolean {
    return this.message.isEdited();
  }

  /**
   * Determines whether the message is deleted.
   */
  public isDeleted(): boolean {
    return this.message.isDeleted();
  }

  /**
   * Determines whether the message is moderated.
   */
  public isModerated(): boolean {
    return this.message.isModerated();
  }

  /**
   * Determines whether the message may still be modified.
   */
  public canBeModified(): boolean {
    return this.message.canBeModified();
  }

  /**
   * Determines whether the message can be edited.
   */
  public canBeEdited(): boolean {
    return this.message.canBeEdited();
  }

  /**
   * Determines whether the message can be deleted.
   */
  public canBeDeleted(): boolean {
    return this.message.canBeDeleted();
  }

  /**
   * Determines whether the message can be moderated.
   */
  public canBeModerated(): boolean {
    return this.message.canBeModerated();
  }

  /**
   * Determines whether the message remains usable.
   */
  public isUsable(): boolean {
    return this.message.isUsable();
  }

  // ===========================================================================
  // Content
  // ===========================================================================

  /**
   * Current optional message content.
   */
  public get content(): MessagingMessageContent | undefined {
    return this.message.content;
  }

  /**
   * Determines whether the message contains textual content.
   */
  public hasContent(): boolean {
    return this.message.hasContent();
  }

  // ===========================================================================
  // Asset Reference
  // ===========================================================================

  /**
   * Optional public identity of the referenced Asset.
   */
  public get assetPublicId(): MessagingAssetPublicId | undefined {
    return this.message.assetPublicId;
  }

  /**
   * Determines whether the message references an Asset.
   */
  public hasAsset(): boolean {
    return this.message.hasAsset();
  }

  // ===========================================================================
  // Sent Event
  // ===========================================================================

  /**
   * Records the domain event indicating that this message was sent.
   *
   * The event is rooted in the owning Messaging Conversation.
   *
   * Message creation and event recording are deliberately separate because
   * correlation metadata belongs to the application workflow.
   */
  public recordSent(correlationId: string, causationId?: string): void {
    MessagingMessageAggregate.ensureCorrelationId(correlationId);

    MessagingMessageAggregate.ensureOptionalCausationId(causationId);

    this.addDomainEvent(
      new MessagingMessageSentEvent(
        this.conversationId.value,
        this.conversationPublicId.value,
        this.publicId.value,
        this.senderPublicId.value,
        this.type.value,
        this.assetPublicId?.value,
        this.sentAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Edit
  // ===========================================================================

  /**
   * Edits the textual content of the message.
   *
   * MessagingMessageEntity owns detailed content and lifecycle invariants.
   */
  public edit(
    content: MessagingMessageContent,
    correlationId: string,
    causationId?: string,
    editedAt: Date = new Date(),
  ): void {
    MessagingMessageAggregate.ensureMessageContent(content);

    MessagingMessageAggregate.ensureCorrelationId(correlationId);

    MessagingMessageAggregate.ensureOptionalCausationId(causationId);

    MessagingMessageAggregate.ensureValidDate(editedAt, 'message edit date');

    const previousContent = this.message.content?.value;
    const previousEditedAt = this.message.editedAt;
    const previousStatus = this.message.status.value;

    this.message.editContent(content, editedAt);

    const actualEditedAt = this.message.editedAt;

    if (actualEditedAt === undefined) {
      throw new MessagingException(
        'Messaging message was edited without an edit timestamp.',
      );
    }

    /*
     * Editing with identical content is a domain no-op.
     *
     * The entity intentionally leaves the state unchanged in that case.
     * Therefore no Edited event should be emitted.
     */
    const contentChanged = previousContent !== this.message.content?.value;

    const lifecycleChanged =
      previousEditedAt?.getTime() !== actualEditedAt.getTime() ||
      previousStatus !== this.message.status.value;

    if (!contentChanged && !lifecycleChanged) {
      return;
    }

    this.addDomainEvent(
      new MessagingMessageEditedEvent(
        this.conversationId.value,
        this.conversationPublicId.value,
        this.publicId.value,
        this.senderPublicId.value,
        actualEditedAt,
        correlationId,
        causationId,
      ),
    );

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Deletes the message while preserving the historical entity.
   *
   * Deletion is a lifecycle transition and does not physically remove the
   * entity from persistence.
   */
  public delete(
    correlationId: string,
    causationId?: string,
    deletedAt: Date = new Date(),
  ): void {
    MessagingMessageAggregate.ensureCorrelationId(correlationId);

    MessagingMessageAggregate.ensureOptionalCausationId(causationId);

    MessagingMessageAggregate.ensureValidDate(
      deletedAt,
      'message deletion date',
    );

    this.message.delete(deletedAt);

    const actualDeletedAt = this.message.deletedAt;

    if (actualDeletedAt === undefined) {
      throw new MessagingException(
        'Messaging message was deleted without a deletion timestamp.',
      );
    }

    this.addDomainEvent(
      new MessagingMessageDeletedEvent(
        this.conversationId.value,
        this.conversationPublicId.value,
        this.publicId.value,
        this.senderPublicId.value,
        actualDeletedAt,
        correlationId,
        causationId,
      ),
    );

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Moderate
  // ===========================================================================

  /**
   * Marks the message as moderated.
   *
   * The aggregate records the lifecycle transition. The decision to moderate
   * belongs to the appropriate application or moderation workflow.
   */
  public moderate(
    correlationId: string,
    causationId?: string,
    moderatedAt: Date = new Date(),
  ): void {
    MessagingMessageAggregate.ensureCorrelationId(correlationId);

    MessagingMessageAggregate.ensureOptionalCausationId(causationId);

    MessagingMessageAggregate.ensureValidDate(
      moderatedAt,
      'message moderation date',
    );

    const previousModeratedAt = this.message.moderatedAt;
    const previousStatus = this.message.status.value;

    this.message.moderate(moderatedAt);

    const actualModeratedAt = this.message.moderatedAt;

    if (actualModeratedAt === undefined) {
      throw new MessagingException(
        'Messaging message was moderated without a moderation timestamp.',
      );
    }

    /*
     * The entity treats moderation of an already moderated message as a
     * no-op. Do not emit a duplicate lifecycle event for that no-op.
     */
    const lifecycleChanged =
      previousModeratedAt?.getTime() !== actualModeratedAt.getTime() ||
      previousStatus !== this.message.status.value;

    if (!lifecycleChanged) {
      return;
    }

    this.addDomainEvent(
      new MessagingMessageModeratedEvent(
        this.conversationId.value,
        this.conversationPublicId.value,
        this.publicId.value,
        this.senderPublicId.value,
        actualModeratedAt,
        correlationId,
        causationId,
      ),
    );

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Timestamps
  // ===========================================================================

  /**
   * Message sent timestamp.
   */
  public get sentAt(): Date {
    return this.message.sentAt;
  }

  /**
   * Message edited timestamp.
   */
  public get editedAt(): Date | undefined {
    return this.message.editedAt;
  }

  /**
   * Message deleted timestamp.
   */
  public get deletedAt(): Date | undefined {
    return this.message.deletedAt;
  }

  /**
   * Message moderated timestamp.
   */
  public get moderatedAt(): Date | undefined {
    return this.message.moderatedAt;
  }

  /**
   * Message creation timestamp.
   */
  public get createdAt(): Date {
    return this.message.createdAt;
  }

  /**
   * Message last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.message.updatedAt;
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp.
   *
   * This is not a business lifecycle transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    MessagingMessageAggregate.ensureValidDate(updatedAt, 'message update date');

    this.message.setUpdatedAt(updatedAt);

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Aggregate Invariants
  // ===========================================================================

  /**
   * Validates aggregate-level invariants.
   *
   * Message-local lifecycle, payload, and timestamp invariants remain owned by
   * MessagingMessageEntity.
   *
   * The aggregate additionally requires the message to carry a valid owning
   * conversation reference because message lifecycle events are rooted in the
   * Messaging Conversation identity.
   */
  private validateAggregateInvariants(): void {
    MessagingMessageAggregate.ensureMessage(this.message);

    MessagingMessageAggregate.ensureInternalId(this.message.id);

    if (this.message.publicId === undefined) {
      throw new MessagingException(
        'Messaging message aggregate requires a public identity.',
      );
    }

    MessagingMessageAggregate.ensureInternalId(this.message.conversationId);

    MessagingMessageAggregate.ensureConversationPublicId(
      this.message.conversationPublicId,
    );

    if (this.message.senderPublicId === undefined) {
      throw new MessagingException(
        'Messaging message aggregate requires a sender public identity.',
      );
    }

    if (this.message.type === undefined) {
      throw new MessagingException(
        'Messaging message aggregate requires a message type.',
      );
    }

    if (this.message.status === undefined) {
      throw new MessagingException(
        'Messaging message aggregate requires a message status.',
      );
    }
  }

  // ===========================================================================
  // Entity Guards
  // ===========================================================================

  private static ensureMessage(
    message: unknown,
  ): asserts message is MessagingMessageEntity {
    if (!(message instanceof MessagingMessageEntity)) {
      throw new MessagingException(
        'Messaging message aggregate requires a valid MessagingMessageEntity.',
      );
    }
  }

  // ===========================================================================
  // Identity Guards
  // ===========================================================================

  private static ensureInternalId(id: unknown): asserts id is UniqueEntityId {
    if (!(id instanceof UniqueEntityId)) {
      throw new MessagingException(
        'Messaging message internal identity must be a valid entity identity.',
      );
    }
  }

  // ===========================================================================
  // Conversation Guards
  // ===========================================================================

  private static ensureConversationPublicId(
    conversationPublicId: unknown,
  ): asserts conversationPublicId is MessagingConversationPublicId {
    if (conversationPublicId === undefined || conversationPublicId === null) {
      throw new MessagingException(
        'Messaging message aggregate requires a conversation public identity.',
      );
    }

    if (
      typeof conversationPublicId !== 'object' ||
      typeof (conversationPublicId as { value?: unknown }).value !== 'string' ||
      (conversationPublicId as { value: string }).value.trim().length === 0
    ) {
      throw new MessagingException(
        'Messaging conversation public identity must be a valid value object.',
      );
    }
  }

  // ===========================================================================
  // Value Object Guards
  // ===========================================================================

  private static ensureMessageContent(
    content: unknown,
  ): asserts content is MessagingMessageContent {
    if (!(content instanceof MessagingMessageContent)) {
      throw new MessagingException(
        'Messaging message content must be a valid message content value object.',
      );
    }
  }

  // ===========================================================================
  // Event Guards
  // ===========================================================================

  private static ensureCorrelationId(correlationId: string): void {
    MessagingMessageAggregate.ensureNonEmptyString(
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

    MessagingMessageAggregate.ensureNonEmptyString(
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
