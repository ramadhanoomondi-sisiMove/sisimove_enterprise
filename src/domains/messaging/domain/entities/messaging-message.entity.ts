// -----------------------------------------------------------------------------
// Messaging Message — Entity
// -----------------------------------------------------------------------------
//
// Represents a message within the Messaging domain.
//
// Aggregate context:
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// The Messaging Message entity is the authoritative owner of:
//
// - Messaging Message identity;
// - Messaging Message public identity;
// - owning Messaging Conversation identity;
// - owning Messaging Conversation public identity;
// - sender public identity;
// - message type;
// - message status;
// - optional message content;
// - optional Asset public identity;
// - message timestamps;
// - message lifecycle.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain message identity;
// - maintain message public identity;
// - maintain conversation identity;
// - maintain conversation public identity;
// - maintain sender public identity;
// - maintain message type;
// - maintain message status;
// - maintain optional content;
// - maintain optional asset reference;
// - manage message lifecycle;
// - edit message content;
// - delete message;
// - moderate message;
// - enforce message-level invariants;
// - provide lifecycle-safe predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - create conversations;
// - add participants;
// - remove participants;
// - validate conversation membership;
// - validate Journey membership;
// - validate Booking membership;
// - load Identity aggregates;
// - load Asset aggregates;
// - access Prisma;
// - persist itself;
// - access repositories;
// - communicate with external systems;
// - perform authorization checks.
//
// Conversation membership and authorization belong to the appropriate
// aggregate/application/domain policy.
//
// Persistence belongs to infrastructure.
//
// Application workflow orchestration belongs to the application layer.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// senderPublicId references Identity.publicId.
//
// assetPublicId references Asset.publicId.
//
// These references are opaque public identities owned by other domains or
// bounded contexts. Messaging does not load or mutate the referenced entities.
//
// -----------------------------------------------------------------------------
//
// Conversation reference:
//
// conversationId references the internal identity of MessagingConversation.
//
// conversationPublicId references MessagingConversation.publicId.
//
// The internal conversation identity is persisted through conversationId.
//
// conversationPublicId is carried by the domain entity so conversation-rooted
// message domain events can be raised without loading the Conversation
// aggregate from inside the Message aggregate.
//
// Messaging does not own or mutate the Conversation aggregate.
//
// -----------------------------------------------------------------------------
//
// Message type rules:
//
// TEXT
//   - content is required;
//   - asset is not allowed.
//
// SYSTEM
//   - content is required;
//   - asset is not allowed.
//
// IMAGE
//   - asset is required;
//   - content is optional.
//
// FILE
//   - asset is required;
//   - content is optional.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
//        SENT
//       /    \
//      ▼      ▼
//   EDITED  MODERATED
//      │       │
//      └───┬───┘
//          ▼
//       DELETED
//
// A deleted message is terminal.
//
// Moderation does not destroy the underlying message content.
//
// Deletion does not erase historical lifecycle timestamps.
//
// Therefore an entity in DELETED state may retain:
//
// - editedAt;
// - moderatedAt;
// - deletedAt.
//
// -----------------------------------------------------------------------------
//
// Persistence mapping:
//
// Prisma:
//
// MessagingMessage
// ├── id
// ├── publicId
// ├── conversationId
// ├── senderPublicId
// ├── type
// ├── status
// ├── content
// ├── assetId
// ├── sentAt
// ├── editedAt
// ├── deletedAt
// ├── moderatedAt
// ├── createdAt
// └── updatedAt
//
// `assetId` maps to MessagingMessageEntity.assetPublicId.
//
// `conversationPublicId` is a domain-level conversation reference and is
// supplied by the repository/application rehydration workflow from the
// Messaging Conversation record.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { MessagingException } from '../exceptions/messaging.exception';

import { MessagingMessageAlreadyDeletedException } from '../exceptions/messaging-message-already-deleted.exception';

import { MessagingMessageEmptyException } from '../exceptions/messaging-message-empty.exception';

import { MessagingMessageInvalidStatusException } from '../exceptions/messaging-message-invalid-status.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { MessagingConversationPublicId } from '../value-objects/messaging-conversation-public-id.vo';

import type { MessagingMemberPublicId } from '../value-objects/messaging-member-public-id.vo';

import type { MessagingAssetPublicId } from '../value-objects/messaging-asset-public-id.vo';

import type { MessagingMessageContent } from '../value-objects/messaging-message-content.vo';

import type { MessagingMessageType } from '../value-objects/messaging-message-type.vo';

import { MessagingMessagePublicId } from '../value-objects/messaging-message-public-id.vo';

import { MessagingMessageStatus } from '../value-objects/messaging-message-status.vo';

// =============================================================================
// Props
// =============================================================================

export interface MessagingMessageProps {
  /**
   * Internal identity of the Messaging Conversation that owns this message.
   *
   * This corresponds to MessagingMessage.conversationId in persistence.
   */
  conversationId: UniqueEntityId;

  /**
   * Public identity of the Messaging Conversation that owns this message.
   *
   * This is not duplicated in the MessagingMessage persistence record.
   *
   * Infrastructure supplies it during rehydration from the owning
   * MessagingConversation record.
   */
  conversationPublicId: MessagingConversationPublicId;

  /**
   * Public identity of the Identity-domain member who sent the message.
   */
  senderPublicId: MessagingMemberPublicId;

  /**
   * Type of message.
   */
  type: MessagingMessageType;

  /**
   * Message lifecycle status.
   */
  status: MessagingMessageStatus;

  /**
   * Optional textual message content.
   *
   * Required for TEXT and SYSTEM messages.
   */
  content: MessagingMessageContent | undefined;

  /**
   * Optional Asset public identity.
   *
   * Required for IMAGE and FILE messages.
   */
  assetPublicId: MessagingAssetPublicId | undefined;

  /**
   * Message sent timestamp.
   */
  sentAt: Date;

  /**
   * Timestamp when the message was edited.
   */
  editedAt: Date | undefined;

  /**
   * Timestamp when the message was deleted.
   */
  deletedAt: Date | undefined;

  /**
   * Timestamp when the message was moderated.
   */
  moderatedAt: Date | undefined;

  /**
   * Message creation timestamp.
   */
  createdAt: Date;

  /**
   * Message last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class MessagingMessageEntity extends Entity<
  MessagingMessageProps,
  MessagingMessagePublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: MessagingMessageProps,
    id?: UniqueEntityId,
    publicId?: MessagingMessagePublicId,
  ) {
    super(props, id, publicId);

    this.validateInvariants();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Messaging Message entity.
   *
   * Newly created messages begin in SENT state.
   *
   * Type-specific content and asset invariants are enforced by the entity.
   */
  public static create(
    conversationId: UniqueEntityId,
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
    type: MessagingMessageType,
    content: MessagingMessageContent | undefined = undefined,
    assetPublicId: MessagingAssetPublicId | undefined = undefined,
    sentAt: Date = new Date(),
  ): MessagingMessageEntity {
    MessagingMessageEntity.ensureConversationId(conversationId);

    MessagingMessageEntity.ensureConversationPublicId(conversationPublicId);

    MessagingMessageEntity.ensureSenderPublicId(senderPublicId);

    MessagingMessageEntity.ensureType(type);

    MessagingMessageEntity.ensureStatus(MessagingMessageStatus.sent());

    MessagingMessageEntity.ensureOptionalContent(content);

    MessagingMessageEntity.ensureOptionalAssetPublicId(assetPublicId);

    MessagingMessageEntity.ensureValidDate(sentAt, 'sent date');

    MessagingMessageEntity.ensureMessagePayload(type, content, assetPublicId);

    const timestamp = MessagingMessageEntity.cloneDate(sentAt);

    const entity = new MessagingMessageEntity(
      {
        conversationId,

        conversationPublicId,

        senderPublicId,

        type,

        status: MessagingMessageStatus.sent(),

        content,

        assetPublicId,

        sentAt: timestamp,

        editedAt: undefined,

        deletedAt: undefined,

        moderatedAt: undefined,

        createdAt: MessagingMessageEntity.cloneDate(timestamp),

        updatedAt: MessagingMessageEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new MessagingMessagePublicId(),
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Messaging Message entity.
   *
   * Rehydration never emits domain events.
   *
   * The conversation public identity is supplied by infrastructure/application
   * rehydration because MessagingMessage persistence stores the internal
   * conversationId but does not duplicate MessagingConversation.publicId.
   */
  public static rehydrate(
    props: MessagingMessageProps,
    id: UniqueEntityId,
    publicId: MessagingMessagePublicId,
  ): MessagingMessageEntity {
    if (props === undefined) {
      throw new MessagingException(
        'Messaging message properties are required for rehydration.',
      );
    }

    MessagingMessageEntity.ensureInternalId(id);

    if (publicId === undefined) {
      throw new MessagingException(
        'Messaging message public identity is required for rehydration.',
      );
    }

    MessagingMessageEntity.ensureConversationId(props.conversationId);

    MessagingMessageEntity.ensureConversationPublicId(
      props.conversationPublicId,
    );

    MessagingMessageEntity.ensureSenderPublicId(props.senderPublicId);

    MessagingMessageEntity.ensureType(props.type);

    MessagingMessageEntity.ensureStatus(props.status);

    MessagingMessageEntity.ensureOptionalContent(props.content);

    MessagingMessageEntity.ensureOptionalAssetPublicId(props.assetPublicId);

    MessagingMessageEntity.ensureValidDate(props.sentAt, 'sent date');

    MessagingMessageEntity.ensureOptionalDate(props.editedAt, 'edited date');

    MessagingMessageEntity.ensureOptionalDate(props.deletedAt, 'deleted date');

    MessagingMessageEntity.ensureOptionalDate(
      props.moderatedAt,
      'moderated date',
    );

    MessagingMessageEntity.ensureValidDate(props.createdAt, 'creation date');

    MessagingMessageEntity.ensureValidDate(props.updatedAt, 'updated date');

    const entity = new MessagingMessageEntity(
      {
        conversationId: props.conversationId,

        conversationPublicId: props.conversationPublicId,

        senderPublicId: props.senderPublicId,

        type: props.type,

        status: props.status,

        content: props.content,

        assetPublicId: props.assetPublicId,

        sentAt: MessagingMessageEntity.cloneDate(props.sentAt),

        editedAt:
          props.editedAt !== undefined
            ? MessagingMessageEntity.cloneDate(props.editedAt)
            : undefined,

        deletedAt:
          props.deletedAt !== undefined
            ? MessagingMessageEntity.cloneDate(props.deletedAt)
            : undefined,

        moderatedAt:
          props.moderatedAt !== undefined
            ? MessagingMessageEntity.cloneDate(props.moderatedAt)
            : undefined,

        createdAt: MessagingMessageEntity.cloneDate(props.createdAt),

        updatedAt: MessagingMessageEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Messaging Message.
   */
  public override get publicId(): MessagingMessagePublicId {
    return super.publicId;
  }

  /**
   * Internal identity of the Messaging Message.
   */
  public override get id(): UniqueEntityId {
    return super.id;
  }

  // ===========================================================================
  // Conversation
  // ===========================================================================

  /**
   * Internal identity of the owning Messaging Conversation.
   */
  public get conversationId(): UniqueEntityId {
    return this.props.conversationId;
  }

  /**
   * Public identity of the owning Messaging Conversation.
   */
  public get conversationPublicId(): MessagingConversationPublicId {
    return this.props.conversationPublicId;
  }

  /**
   * Determines whether this message belongs to the supplied conversation.
   */
  public belongsToConversation(conversationId: UniqueEntityId): boolean {
    MessagingMessageEntity.ensureConversationId(conversationId);

    return this.props.conversationId.equals(conversationId);
  }

  /**
   * Determines whether this message belongs to the supplied public
   * conversation identity.
   */
  public belongsToConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): boolean {
    MessagingMessageEntity.ensureConversationPublicId(conversationPublicId);

    return this.props.conversationPublicId.equals(conversationPublicId);
  }

  // ===========================================================================
  // Sender
  // ===========================================================================

  /**
   * Public identity of the member who sent the message.
   */
  public get senderPublicId(): MessagingMemberPublicId {
    return this.props.senderPublicId;
  }

  /**
   * Determines whether the supplied member sent this message.
   */
  public wasSentBy(memberPublicId: MessagingMemberPublicId): boolean {
    if (memberPublicId === undefined) {
      return false;
    }

    return this.props.senderPublicId.equals(memberPublicId);
  }

  // ===========================================================================
  // Message Type
  // ===========================================================================

  /**
   * Current message type.
   */
  public get type(): MessagingMessageType {
    return this.props.type;
  }

  /**
   * Determines whether this is a text message.
   */
  public isText(): boolean {
    return this.props.type.isText();
  }

  /**
   * Determines whether this is an image message.
   */
  public isImage(): boolean {
    return this.props.type.isImage();
  }

  /**
   * Determines whether this is a file message.
   */
  public isFile(): boolean {
    return this.props.type.isFile();
  }

  /**
   * Determines whether this is a system message.
   */
  public isSystem(): boolean {
    return this.props.type.isSystem();
  }

  // ===========================================================================
  // Content
  // ===========================================================================

  /**
   * Current message content.
   */
  public get content(): MessagingMessageContent | undefined {
    return this.props.content;
  }

  /**
   * Determines whether the message contains textual content.
   */
  public hasContent(): boolean {
    return this.props.content !== undefined;
  }

  /**
   * Changes the textual message content.
   *
   * Only TEXT and SYSTEM messages may be edited.
   *
   * Moderated and deleted messages cannot be edited.
   */
  public editContent(
    content: MessagingMessageContent,
    editedAt: Date = new Date(),
  ): void {
    this.ensureMutable();

    if (this.isModerated()) {
      throw new MessagingMessageInvalidStatusException(
        'A moderated messaging message cannot be edited.',
      );
    }

    if (!this.isText() && !this.isSystem()) {
      throw new MessagingMessageInvalidStatusException(
        'Only text and system messages can have their content edited.',
      );
    }

    MessagingMessageEntity.ensureContent(content);

    MessagingMessageEntity.ensureValidDate(editedAt, 'edited date');

    if (editedAt.getTime() < this.props.sentAt.getTime()) {
      throw new MessagingMessageInvalidStatusException(
        'Message edited date cannot be before sent date.',
      );
    }

    if (
      this.props.editedAt !== undefined &&
      editedAt.getTime() < this.props.editedAt.getTime()
    ) {
      throw new MessagingMessageInvalidStatusException(
        'Message edited date cannot move backwards.',
      );
    }

    if (this.props.content?.equals(content)) {
      return;
    }

    this.props.content = content;

    this.props.status = MessagingMessageStatus.edited();

    this.props.editedAt = MessagingMessageEntity.cloneDate(editedAt);

    this.touch(editedAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Asset
  // ===========================================================================

  /**
   * Public identity of the referenced Asset.
   */
  public get assetPublicId(): MessagingAssetPublicId | undefined {
    return this.props.assetPublicId;
  }

  /**
   * Determines whether the message references an Asset.
   */
  public hasAsset(): boolean {
    return this.props.assetPublicId !== undefined;
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current message lifecycle status.
   */
  public get status(): MessagingMessageStatus {
    return this.props.status;
  }

  /**
   * Determines whether the message is sent.
   */
  public isSent(): boolean {
    return this.props.status.isSent();
  }

  /**
   * Determines whether the message is edited.
   */
  public isEdited(): boolean {
    return this.props.status.isEdited();
  }

  /**
   * Determines whether the message is deleted.
   */
  public isDeleted(): boolean {
    return this.props.status.isDeleted();
  }

  /**
   * Determines whether the message is moderated.
   */
  public isModerated(): boolean {
    return this.props.status.isModerated();
  }

  /**
   * Determines whether the message can still undergo a lifecycle transition.
   */
  public canBeModified(): boolean {
    return !this.isDeleted();
  }

  /**
   * Determines whether the message can be edited.
   *
   * Moderated and deleted messages cannot be edited.
   */
  public canBeEdited(): boolean {
    return (
      !this.isDeleted() &&
      !this.isModerated() &&
      (this.isText() || this.isSystem())
    );
  }

  /**
   * Determines whether the message can be deleted.
   */
  public canBeDeleted(): boolean {
    return !this.isDeleted();
  }

  /**
   * Determines whether the message can be moderated.
   */
  public canBeModerated(): boolean {
    return !this.isDeleted() && !this.isModerated();
  }

  // ===========================================================================
  // Lifecycle — Delete
  // ===========================================================================

  /**
   * Deletes the message while preserving its historical state.
   *
   * Previous editedAt and moderatedAt timestamps are intentionally preserved.
   */
  public delete(deletedAt: Date = new Date()): void {
    if (this.isDeleted()) {
      throw new MessagingMessageAlreadyDeletedException(
        'Messaging message is already deleted.',
      );
    }

    MessagingMessageEntity.ensureValidDate(deletedAt, 'deleted date');

    if (deletedAt.getTime() < this.props.sentAt.getTime()) {
      throw new MessagingMessageInvalidStatusException(
        'Message deleted date cannot be before sent date.',
      );
    }

    if (
      this.props.editedAt !== undefined &&
      deletedAt.getTime() < this.props.editedAt.getTime()
    ) {
      throw new MessagingMessageInvalidStatusException(
        'Message deleted date cannot be before edited date.',
      );
    }

    if (
      this.props.moderatedAt !== undefined &&
      deletedAt.getTime() < this.props.moderatedAt.getTime()
    ) {
      throw new MessagingMessageInvalidStatusException(
        'Message deleted date cannot be before moderated date.',
      );
    }

    this.props.status = MessagingMessageStatus.deleted();

    this.props.deletedAt = MessagingMessageEntity.cloneDate(deletedAt);

    this.touch(deletedAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Lifecycle — Moderate
  // ===========================================================================

  /**
   * Marks the message as moderated.
   *
   * Moderation does not destroy or remove message content.
   */
  public moderate(moderatedAt: Date = new Date()): void {
    if (this.isDeleted()) {
      throw new MessagingMessageAlreadyDeletedException(
        'A deleted messaging message cannot be moderated.',
      );
    }

    MessagingMessageEntity.ensureValidDate(moderatedAt, 'moderated date');

    if (moderatedAt.getTime() < this.props.sentAt.getTime()) {
      throw new MessagingMessageInvalidStatusException(
        'Message moderated date cannot be before sent date.',
      );
    }

    if (
      this.props.editedAt !== undefined &&
      moderatedAt.getTime() < this.props.editedAt.getTime()
    ) {
      throw new MessagingMessageInvalidStatusException(
        'Message moderated date cannot be before edited date.',
      );
    }

    if (this.isModerated()) {
      return;
    }

    this.props.status = MessagingMessageStatus.moderated();

    this.props.moderatedAt = MessagingMessageEntity.cloneDate(moderatedAt);

    this.touch(moderatedAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Lifecycle Predicates
  // ===========================================================================

  /**
   * Determines whether the message remains usable.
   *
   * Moderated messages remain part of the domain and can still be deleted.
   * Deleted messages are terminal and unusable.
   */
  public isUsable(): boolean {
    return !this.isDeleted();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Message sent timestamp.
   */
  public get sentAt(): Date {
    return MessagingMessageEntity.cloneDate(this.props.sentAt);
  }

  /**
   * Message edited timestamp.
   */
  public get editedAt(): Date | undefined {
    return this.props.editedAt !== undefined
      ? MessagingMessageEntity.cloneDate(this.props.editedAt)
      : undefined;
  }

  /**
   * Message deleted timestamp.
   */
  public get deletedAt(): Date | undefined {
    return this.props.deletedAt !== undefined
      ? MessagingMessageEntity.cloneDate(this.props.deletedAt)
      : undefined;
  }

  /**
   * Message moderated timestamp.
   */
  public get moderatedAt(): Date | undefined {
    return this.props.moderatedAt !== undefined
      ? MessagingMessageEntity.cloneDate(this.props.moderatedAt)
      : undefined;
  }

  /**
   * Message creation timestamp.
   */
  public get createdAt(): Date {
    return MessagingMessageEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Message last-update timestamp.
   */
  public get updatedAt(): Date {
    return MessagingMessageEntity.cloneDate(this.props.updatedAt);
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
    MessagingMessageEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = MessagingMessageEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new MessagingException(
        'Messaging message updated date cannot be before creation date.',
      );
    }

    if (timestamp.getTime() < this.props.updatedAt.getTime()) {
      throw new MessagingException(
        'Messaging message updated date cannot move backwards.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Invariants
  // ===========================================================================

  /**
   * Validates all Messaging Message entity-level invariants.
   */
  private validateInvariants(): void {
    MessagingMessageEntity.ensureConversationId(this.props.conversationId);

    MessagingMessageEntity.ensureConversationPublicId(
      this.props.conversationPublicId,
    );

    MessagingMessageEntity.ensureSenderPublicId(this.props.senderPublicId);

    MessagingMessageEntity.ensureType(this.props.type);

    MessagingMessageEntity.ensureStatus(this.props.status);

    MessagingMessageEntity.ensureOptionalContent(this.props.content);

    MessagingMessageEntity.ensureOptionalAssetPublicId(
      this.props.assetPublicId,
    );

    MessagingMessageEntity.ensureValidDate(this.props.sentAt, 'sent date');

    MessagingMessageEntity.ensureOptionalDate(
      this.props.editedAt,
      'edited date',
    );

    MessagingMessageEntity.ensureOptionalDate(
      this.props.deletedAt,
      'deleted date',
    );

    MessagingMessageEntity.ensureOptionalDate(
      this.props.moderatedAt,
      'moderated date',
    );

    MessagingMessageEntity.ensureValidDate(
      this.props.createdAt,
      'creation date',
    );

    MessagingMessageEntity.ensureValidDate(
      this.props.updatedAt,
      'updated date',
    );

    if (this.props.createdAt.getTime() < this.props.sentAt.getTime()) {
      throw new MessagingException(
        'Messaging message creation date cannot be before sent date.',
      );
    }

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new MessagingException(
        'Messaging message updated date cannot be before creation date.',
      );
    }

    MessagingMessageEntity.ensureMessagePayload(
      this.props.type,
      this.props.content,
      this.props.assetPublicId,
    );

    MessagingMessageEntity.ensureLifecycleTimestamps(this.props);
  }

  // ===========================================================================
  // Mutable State Guard
  // ===========================================================================

  /**
   * Ensures the message is not deleted.
   */
  private ensureMutable(): void {
    if (this.isDeleted()) {
      throw new MessagingMessageAlreadyDeletedException(
        'A deleted messaging message cannot be modified.',
      );
    }
  }

  // ===========================================================================
  // Conversation Guards
  // ===========================================================================

  private static ensureConversationId(conversationId: UniqueEntityId): void {
    if (!(conversationId instanceof UniqueEntityId)) {
      throw new MessagingException(
        'Messaging message conversation identity must be a valid entity identity.',
      );
    }
  }

  private static ensureConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): void {
    if (!(conversationPublicId instanceof MessagingConversationPublicId)) {
      throw new MessagingException(
        'Messaging message conversation public identity must be a valid value object.',
      );
    }
  }

  // ===========================================================================
  // Entity Identity Guards
  // ===========================================================================

  private static ensureInternalId(id: UniqueEntityId): void {
    if (!(id instanceof UniqueEntityId)) {
      throw new MessagingException(
        'Messaging message internal identity must be a valid entity identity.',
      );
    }
  }

  // ===========================================================================
  // Sender Guards
  // ===========================================================================

  private static ensureSenderPublicId(
    senderPublicId: MessagingMemberPublicId,
  ): void {
    if (senderPublicId === undefined) {
      throw new MessagingException(
        'Messaging message sender public identity is required.',
      );
    }
  }

  // ===========================================================================
  // Type Guards
  // ===========================================================================

  private static ensureType(type: MessagingMessageType): void {
    if (type === undefined) {
      throw new MessagingException('Messaging message type is required.');
    }
  }

  // ===========================================================================
  // Status Guards
  // ===========================================================================

  private static ensureStatus(status: MessagingMessageStatus): void {
    if (status === undefined) {
      throw new MessagingException('Messaging message status is required.');
    }
  }

  // ===========================================================================
  // Content Guards
  // ===========================================================================

  private static ensureContent(content: MessagingMessageContent): void {
    if (content === undefined) {
      throw new MessagingMessageEmptyException(
        'Messaging message content is required.',
      );
    }
  }

  private static ensureOptionalContent(
    content: MessagingMessageContent | undefined,
  ): void {
    if (content === undefined) {
      return;
    }

    MessagingMessageEntity.ensureContent(content);
  }

  // ===========================================================================
  // Asset Guards
  // ===========================================================================

  private static ensureOptionalAssetPublicId(
    assetPublicId: MessagingAssetPublicId | undefined,
  ): void {
    if (assetPublicId === undefined) {
      return;
    }
  }

  // ===========================================================================
  // Message Payload Guards
  // ===========================================================================

  /**
   * Enforces the relationship between message type, content, and asset.
   */
  private static ensureMessagePayload(
    type: MessagingMessageType,
    content: MessagingMessageContent | undefined,
    assetPublicId: MessagingAssetPublicId | undefined,
  ): void {
    if (type.isText()) {
      if (content === undefined) {
        throw new MessagingMessageEmptyException(
          'Text messaging messages require content.',
        );
      }

      if (assetPublicId !== undefined) {
        throw new MessagingMessageInvalidStatusException(
          'Text messaging messages cannot contain an asset reference.',
        );
      }

      return;
    }

    if (type.isSystem()) {
      if (content === undefined) {
        throw new MessagingMessageEmptyException(
          'System messaging messages require content.',
        );
      }

      if (assetPublicId !== undefined) {
        throw new MessagingMessageInvalidStatusException(
          'System messaging messages cannot contain an asset reference.',
        );
      }

      return;
    }

    if (type.isImage()) {
      if (assetPublicId === undefined) {
        throw new MessagingMessageEmptyException(
          'Image messaging messages require an asset reference.',
        );
      }

      return;
    }

    if (type.isFile()) {
      if (assetPublicId === undefined) {
        throw new MessagingMessageEmptyException(
          'File messaging messages require an asset reference.',
        );
      }

      return;
    }

    throw new MessagingException('Messaging message type is invalid.');
  }

  // ===========================================================================
  // Lifecycle Timestamp Guards
  // ===========================================================================

  private static ensureLifecycleTimestamps(props: MessagingMessageProps): void {
    // -------------------------------------------------------------------------
    // sentAt → createdAt
    // -------------------------------------------------------------------------

    if (props.createdAt.getTime() < props.sentAt.getTime()) {
      throw new MessagingException(
        'Messaging message creation date cannot be before sent date.',
      );
    }

    // -------------------------------------------------------------------------
    // editedAt
    // -------------------------------------------------------------------------

    if (
      props.editedAt !== undefined &&
      props.editedAt.getTime() < props.sentAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging message edited date cannot be before sent date.',
      );
    }

    // -------------------------------------------------------------------------
    // moderatedAt
    // -------------------------------------------------------------------------

    if (
      props.moderatedAt !== undefined &&
      props.moderatedAt.getTime() < props.sentAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging message moderated date cannot be before sent date.',
      );
    }

    // -------------------------------------------------------------------------
    // deletedAt
    // -------------------------------------------------------------------------

    if (
      props.deletedAt !== undefined &&
      props.deletedAt.getTime() < props.sentAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging message deleted date cannot be before sent date.',
      );
    }

    // -------------------------------------------------------------------------
    // Lifecycle ordering
    // -------------------------------------------------------------------------

    if (
      props.editedAt !== undefined &&
      props.moderatedAt !== undefined &&
      props.moderatedAt.getTime() < props.editedAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging message moderated date cannot be before edited date.',
      );
    }

    if (
      props.editedAt !== undefined &&
      props.deletedAt !== undefined &&
      props.deletedAt.getTime() < props.editedAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging message deleted date cannot be before edited date.',
      );
    }

    if (
      props.moderatedAt !== undefined &&
      props.deletedAt !== undefined &&
      props.deletedAt.getTime() < props.moderatedAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging message deleted date cannot be before moderated date.',
      );
    }

    // -------------------------------------------------------------------------
    // updatedAt
    // -------------------------------------------------------------------------

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new MessagingException(
        'Messaging message updated date cannot be before creation date.',
      );
    }

    // -------------------------------------------------------------------------
    // Status ↔ timestamp consistency
    // -------------------------------------------------------------------------

    if (props.status.isSent()) {
      if (props.editedAt !== undefined) {
        throw new MessagingException(
          'A SENT messaging message cannot have an edited date.',
        );
      }

      if (props.deletedAt !== undefined) {
        throw new MessagingException(
          'A SENT messaging message cannot have a deleted date.',
        );
      }

      if (props.moderatedAt !== undefined) {
        throw new MessagingException(
          'A SENT messaging message cannot have a moderated date.',
        );
      }

      return;
    }

    if (props.status.isEdited()) {
      if (props.editedAt === undefined) {
        throw new MessagingException(
          'An EDITED messaging message must have an edited date.',
        );
      }

      if (props.deletedAt !== undefined) {
        throw new MessagingException(
          'An EDITED messaging message cannot have a deleted date.',
        );
      }

      if (props.moderatedAt !== undefined) {
        throw new MessagingException(
          'An EDITED messaging message cannot have a moderated date.',
        );
      }

      return;
    }

    if (props.status.isModerated()) {
      if (props.moderatedAt === undefined) {
        throw new MessagingException(
          'A MODERATED messaging message must have a moderated date.',
        );
      }

      if (props.deletedAt !== undefined) {
        throw new MessagingException(
          'A MODERATED messaging message cannot have a deleted date.',
        );
      }

      return;
    }

    if (props.status.isDeleted()) {
      if (props.deletedAt === undefined) {
        throw new MessagingException(
          'A DELETED messaging message must have a deleted date.',
        );
      }

      // A DELETED message may retain editedAt and/or moderatedAt because
      // deletion is terminal but does not erase historical lifecycle data.
      return;
    }

    throw new MessagingException(
      'Messaging message lifecycle status is invalid.',
    );
  }

  // ===========================================================================
  // Date Guards
  // ===========================================================================

  /**
   * Validates a required Date.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new MessagingException(
        `Messaging message ${fieldName} must be a valid date.`,
      );
    }
  }

  /**
   * Validates an optional Date.
   */
  private static ensureOptionalDate(
    value: Date | undefined,
    fieldName: string,
  ): void {
    if (value === undefined) {
      return;
    }

    MessagingMessageEntity.ensureValidDate(value, fieldName);
  }

  // ===========================================================================
  // Date Clone
  // ===========================================================================

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    MessagingMessageEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
