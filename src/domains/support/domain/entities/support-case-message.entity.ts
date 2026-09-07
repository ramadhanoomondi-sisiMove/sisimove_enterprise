// -----------------------------------------------------------------------------
// Support Case Message — Entity
// -----------------------------------------------------------------------------
//
// Represents a message belonging to a Support Case.
//
// Aggregate:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// SupportCaseMessageEntity is a child entity owned by the
// SupportCaseAggregate.
//
// The entity records:
// - the message public identity;
// - the Identity member who sent the message;
// - the message type;
// - optional message content;
// - optional Asset reference;
// - sent, edited, and deleted timestamps;
// - creation and update timestamps.
//
// The entity does NOT contain:
// - caseId;
// - Prisma relations;
// - repository access;
// - Identity domain objects;
// - Asset domain objects.
//
// The aggregate owns the relationship between the Support Case and
// its messages.
//
// Message lifecycle:
//
// CREATED
//   │
//   ├── editContent()
//   │       └── editedAt
//   │
//   └── delete()
//           └── deletedAt
//
// A message may be edited at most once.
// A message may be deleted at most once.
//
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { SupportCaseMessagePublicId } from '../value-objects/support-case-message-public-id.vo';
import type { SupportCaseMessageType } from '../value-objects/support-case-message-type.vo';
import type { SupportCaseMessageContent } from '../value-objects/support-case-message-content.vo';
import type { SupportCaseMessageSenderPublicId } from '../value-objects/support-case-message-sender-public-id.vo';
import type { SupportCaseMessageAssetId } from '../value-objects/support-case-message-asset-id.vo';

import { SupportCaseMessageEmptyException } from '../exceptions/support-case-message-empty.exception';
import { SupportCaseMessageAlreadyEditedException } from '../exceptions/support-case-message-already-edited.exception';
import { SupportCaseMessageAlreadyDeletedException } from '../exceptions/support-case-message-already-deleted.exception';

export interface SupportCaseMessageProps {
  senderPublicId: SupportCaseMessageSenderPublicId;

  type: SupportCaseMessageType;

  content?: SupportCaseMessageContent;
  assetId?: SupportCaseMessageAssetId;

  sentAt: Date;
  editedAt?: Date;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export class SupportCaseMessageEntity extends Entity<
  SupportCaseMessageProps,
  SupportCaseMessagePublicId
> {
  private constructor(
    props: SupportCaseMessageProps,
    id?: UniqueEntityId,
    publicId?: SupportCaseMessagePublicId,
  ) {
    super(
      {
        ...props,
        sentAt: new Date(props.sentAt),
        ...(props.editedAt !== undefined
          ? { editedAt: new Date(props.editedAt) }
          : {}),
        ...(props.deletedAt !== undefined
          ? { deletedAt: new Date(props.deletedAt) }
          : {}),
        createdAt: new Date(props.createdAt),
        updatedAt: new Date(props.updatedAt),
      },
      id,
      publicId,
    );

    this.validateInvariants();
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    senderPublicId: SupportCaseMessageSenderPublicId;
    type: SupportCaseMessageType;
    content?: SupportCaseMessageContent;
    assetId?: SupportCaseMessageAssetId;
    sentAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }): SupportCaseMessageEntity {
    const now = new Date();

    return new SupportCaseMessageEntity({
      senderPublicId: props.senderPublicId,
      type: props.type,

      ...(props.content !== undefined ? { content: props.content } : {}),

      ...(props.assetId !== undefined ? { assetId: props.assetId } : {}),

      sentAt: props.sentAt ? new Date(props.sentAt) : new Date(now),

      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(now),

      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(now),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: SupportCaseMessageProps,
    id: UniqueEntityId,
    publicId: SupportCaseMessagePublicId,
  ): SupportCaseMessageEntity {
    return new SupportCaseMessageEntity(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public get messagePublicId(): SupportCaseMessagePublicId {
    return this.publicId;
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  public get senderPublicId(): SupportCaseMessageSenderPublicId {
    return this.props.senderPublicId;
  }

  public get type(): SupportCaseMessageType {
    return this.props.type;
  }

  public get content(): SupportCaseMessageContent | undefined {
    return this.props.content;
  }

  public get assetId(): SupportCaseMessageAssetId | undefined {
    return this.props.assetId;
  }

  public get sentAt(): Date {
    return new Date(this.props.sentAt);
  }

  public get editedAt(): Date | undefined {
    return this.props.editedAt ? new Date(this.props.editedAt) : undefined;
  }

  public get deletedAt(): Date | undefined {
    return this.props.deletedAt ? new Date(this.props.deletedAt) : undefined;
  }

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Sender
  // ---------------------------------------------------------------------------

  public changeSender(senderPublicId: SupportCaseMessageSenderPublicId): void {
    this.props.senderPublicId = senderPublicId;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  public changeContent(content: SupportCaseMessageContent): void {
    this.ensureNotDeleted();
    this.ensureNotEdited();

    this.validateContent(content);

    this.props.content = content;
    this.props.editedAt = new Date();

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Asset
  // ---------------------------------------------------------------------------

  public changeAsset(assetId: SupportCaseMessageAssetId): void {
    this.ensureNotDeleted();
    this.ensureNotEdited();

    this.props.assetId = assetId;
    this.props.editedAt = new Date();

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  public delete(at: Date = new Date()): void {
    this.ensureNotDeleted();

    this.validateTimestamp(
      at,
      'Support case message deletion timestamp must be a valid date.',
    );

    this.props.deletedAt = new Date(at);

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  public get isEdited(): boolean {
    return this.props.editedAt !== undefined;
  }

  public get isDeleted(): boolean {
    return this.props.deletedAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Invariants
  // ---------------------------------------------------------------------------

  private validateInvariants(): void {
    this.validateContent(this.props.content);

    this.validateTimestamp(
      this.props.sentAt,
      'Support case message sent timestamp must be a valid date.',
    );

    if (this.props.editedAt !== undefined) {
      this.validateTimestamp(
        this.props.editedAt,
        'Support case message edit timestamp must be a valid date.',
      );
    }

    if (this.props.deletedAt !== undefined) {
      this.validateTimestamp(
        this.props.deletedAt,
        'Support case message deletion timestamp must be a valid date.',
      );
    }

    this.validateTimestamp(
      this.props.createdAt,
      'Support case message creation timestamp must be a valid date.',
    );

    this.validateTimestamp(
      this.props.updatedAt,
      'Support case message update timestamp must be a valid date.',
    );
  }

  private validateContent(
    content: SupportCaseMessageContent | undefined,
  ): void {
    if (content !== undefined && !content.value.trim()) {
      throw new SupportCaseMessageEmptyException();
    }
  }

  private ensureNotEdited(): void {
    if (this.props.editedAt !== undefined) {
      throw new SupportCaseMessageAlreadyEditedException();
    }
  }

  private ensureNotDeleted(): void {
    if (this.props.deletedAt !== undefined) {
      throw new SupportCaseMessageAlreadyDeletedException();
    }
  }

  private validateTimestamp(timestamp: Date, message: string): void {
    if (!(timestamp instanceof Date) || Number.isNaN(timestamp.getTime())) {
      throw new Error(message);
    }
  }
}
