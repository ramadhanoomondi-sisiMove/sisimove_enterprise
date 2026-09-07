// -----------------------------------------------------------------------------
// Support Case Note — Entity
// -----------------------------------------------------------------------------
//
// Represents an internal note attached to a Support Case.
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
// SupportCaseNoteEntity is a child entity owned by the
// SupportCaseAggregate.
//
// Notes are internal Support-domain records used by authorized Support
// participants such as support agents and reviewers.
//
// The entity records:
// - the note public identity;
// - the Identity member who authored the note;
// - the note content;
// - creation and update timestamps.
//
// The entity does NOT contain:
// - caseId;
// - Prisma relations;
// - repository access;
// - Identity domain objects.
//
// The aggregate owns the relationship between the Support Case and
// its notes.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SupportCaseNotePublicId } from '../value-objects/support-case-note-public-id.vo';
import type { SupportCaseNoteContent } from '../value-objects/support-case-note-content.vo';
import type { SupportCaseNoteAuthorPublicId } from '../value-objects/support-case-note-author-public-id.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseNoteEmptyException } from '../exceptions/support-case-note-empty.exception';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface SupportCaseNoteProps {
  authorPublicId: SupportCaseNoteAuthorPublicId;
  content: SupportCaseNoteContent;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Represents an internal note attached to a Support Case.
 *
 * A note belongs to the SupportCaseAggregate and is managed through
 * aggregate-level behavior.
 */
export class SupportCaseNoteEntity extends Entity<
  SupportCaseNoteProps,
  SupportCaseNotePublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: SupportCaseNoteProps,
    id?: UniqueEntityId,
    publicId?: SupportCaseNotePublicId,
  ) {
    super(
      {
        ...props,
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

  /**
   * Creates a new Support Case Note entity.
   */
  public static create(props: {
    authorPublicId: SupportCaseNoteAuthorPublicId;
    content: SupportCaseNoteContent;
    createdAt?: Date;
    updatedAt?: Date;
  }): SupportCaseNoteEntity {
    const now = new Date();

    return new SupportCaseNoteEntity({
      authorPublicId: props.authorPublicId,
      content: props.content,
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(now),
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(now),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Rehydrates an existing Support Case Note entity.
   *
   * Intended for repository/infrastructure mapping.
   */
  public static rehydrate(
    props: SupportCaseNoteProps,
    id: UniqueEntityId,
    publicId: SupportCaseNotePublicId,
  ): SupportCaseNoteEntity {
    return new SupportCaseNoteEntity(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public get notePublicId(): SupportCaseNotePublicId {
    return this.publicId;
  }

  // ---------------------------------------------------------------------------
  // Note
  // ---------------------------------------------------------------------------

  /**
   * Returns the Identity member who authored the note.
   *
   * This is an opaque cross-domain reference.
   */
  public get authorPublicId(): SupportCaseNoteAuthorPublicId {
    return this.props.authorPublicId;
  }

  /**
   * Returns the note content.
   */
  public get content(): SupportCaseNoteContent {
    return this.props.content;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Domain Behavior
  // ---------------------------------------------------------------------------

  /**
   * Changes the member who authored the note.
   *
   * This should normally be used only for legitimate domain corrections.
   */
  public changeAuthor(authorPublicId: SupportCaseNoteAuthorPublicId): void {
    this.props.authorPublicId = authorPublicId;
    this.touch();
  }

  /**
   * Changes the note content.
   */
  public changeContent(content: SupportCaseNoteContent): void {
    this.validateContent(content);

    this.props.content = content;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Invariants
  // ---------------------------------------------------------------------------

  private validateInvariants(): void {
    this.validateContent(this.props.content);
    this.validateCreatedAt(this.props.createdAt);
    this.validateUpdatedAt(this.props.updatedAt);
  }

  private validateContent(content: SupportCaseNoteContent): void {
    if (!content || !content.value.trim()) {
      throw new SupportCaseNoteEmptyException();
    }
  }

  private validateCreatedAt(createdAt: Date): void {
    if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
      throw new Error(
        'Support case note creation timestamp must be a valid date.',
      );
    }
  }

  private validateUpdatedAt(updatedAt: Date): void {
    if (!(updatedAt instanceof Date) || Number.isNaN(updatedAt.getTime())) {
      throw new Error(
        'Support case note update timestamp must be a valid date.',
      );
    }
  }
}
