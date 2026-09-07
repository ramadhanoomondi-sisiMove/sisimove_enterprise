// -----------------------------------------------------------------------------
// Support Case — Aggregate
// -----------------------------------------------------------------------------
//
// Represents the Support Case aggregate.
//
// Aggregate boundary:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// The SupportCaseAggregate is the consistency boundary for:
//
// - Support Case lifecycle;
// - Support Case assignment;
// - Support Case priority;
// - Support Case category;
// - Support Case participants;
// - participant membership;
// - Support Case messages;
// - message membership;
// - Support Case notes;
// - Support Case evidence;
// - Support Case resolution;
// - aggregate-level uniqueness;
// - child entity ownership;
// - temporal consistency;
// - domain-event recording.
//
// Important lifecycle rule:
//
// A SupportCaseResolutionEntity may be created before the Support Case
// transitions to RESOLVED.
//
// Therefore:
//
//   createResolution()
//       |
//       v
//   resolution exists
//       |
//       v
//   resolve()
//       |
//       v
//   Support Case becomes RESOLVED
//
// A resolution is required before the Support Case can become RESOLVED.
//
// -----------------------------------------------------------------------------
//
// Architectural rules:
//
// - The aggregate root owns all child entities.
// - Child entities must not be mutated directly by application handlers.
// - Cross-domain identities remain opaque public IDs.
// - Application-facing child operations use public identities.
// - Internal UniqueEntityId values remain internal to the domain model.
// - Domain invariants are enforced inside this aggregate.
// - Rehydration must not emit domain events.
// - Creation and mutation may emit domain events.
// - Terminal states are non-operational.
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

import { SupportCaseException } from '../exceptions/support-case.exception';

import { SupportCaseAlreadyClosedException } from '../exceptions/support-case-already-closed.exception';
import { SupportCaseAlreadyCancelledException } from '../exceptions/support-case-already-cancelled.exception';
import { SupportCaseAlreadyResolvedException } from '../exceptions/support-case-already-resolved.exception';

import { SupportCaseParticipantAlreadyExistsException } from '../exceptions/support-case-participant-already-exists.exception';
import { SupportCaseParticipantNotFoundException } from '../exceptions/support-case-participant-not-found.exception';

import { SupportCaseMessageNotFoundException } from '../exceptions/support-case-message-not-found.exception';

import { SupportCaseResolutionAlreadyExistsException } from '../exceptions/support-case-resolution-already-exists.exception';

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

import { SupportCaseCreatedEvent } from '../events/support-case-created.event';
import { SupportCaseOpenedEvent } from '../events/support-case-opened.event';
import { SupportCaseAssignedEvent } from '../events/support-case-assigned.event';
import { SupportCaseUnassignedEvent } from '../events/support-case-unassigned.event';
import { SupportCasePriorityChangedEvent } from '../events/support-case-priority-changed.event';
import { SupportCaseCategoryChangedEvent } from '../events/support-case-category-changed.event';
import { SupportCaseStartedEvent } from '../events/support-case-started.event';
import { SupportCaseWaitingForMemberEvent } from '../events/support-case-waiting-for-member.event';
import { SupportCaseWaitingForInternalActionEvent } from '../events/support-case-waiting-for-internal-action.event';
import { SupportCaseResolvedEvent } from '../events/support-case-resolved.event';
import { SupportCaseClosedEvent } from '../events/support-case-closed.event';
import { SupportCaseCancelledEvent } from '../events/support-case-cancelled.event';

import { SupportCaseParticipantAddedEvent } from '../events/support-case-participant-added.event';
import { SupportCaseParticipantRemovedEvent } from '../events/support-case-participant-removed.event';

import { SupportCaseMessageAddedEvent } from '../events/support-case-message-added.event';
import { SupportCaseMessageEditedEvent } from '../events/support-case-message-edited.event';
import { SupportCaseMessageDeletedEvent } from '../events/support-case-message-deleted.event';

import { SupportCaseNoteAddedEvent } from '../events/support-case-note-added.event';

import { SupportCaseEvidenceAddedEvent } from '../events/support-case-evidence-added.event';

import { SupportCaseResolutionCreatedEvent } from '../events/support-case-resolution-created.event';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { SupportCaseEntity } from '../entities/support-case.entity';
import { SupportCaseParticipantEntity } from '../entities/support-case-participant.entity';
import { SupportCaseMessageEntity } from '../entities/support-case-message.entity';
import { SupportCaseNoteEntity } from '../entities/support-case-note.entity';
import { SupportCaseEvidenceEntity } from '../entities/support-case-evidence.entity';
import { SupportCaseResolutionEntity } from '../entities/support-case-resolution.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { SupportCaseStatus } from '../value-objects/support-case-status.vo';

import type { SupportCasePublicId } from '../value-objects/support-case-public-id.vo';
import type { SupportCasePriority } from '../value-objects/support-case-priority.vo';
import type { SupportCaseCategory } from '../value-objects/support-case-category.vo';
import type { SupportCaseAssignedToPublicId } from '../value-objects/support-case-assigned-to-public-id.vo';
import type { SupportCaseMessageContent } from '../value-objects/support-case-message-content.vo';
import type { SupportCaseParticipantPublicId } from '../value-objects/support-case-participant-public-id.vo';
import type { SupportCaseMessagePublicId } from '../value-objects/support-case-message-public-id.vo';

// =============================================================================
// Properties
// =============================================================================

export interface SupportCaseAggregateProps {
  /**
   * Aggregate root entity.
   */
  case: SupportCaseEntity;

  /**
   * Participants owned by the aggregate.
   */
  participants: SupportCaseParticipantEntity[];

  /**
   * Messages owned by the aggregate.
   */
  messages: SupportCaseMessageEntity[];

  /**
   * Internal support notes owned by the aggregate.
   */
  notes: SupportCaseNoteEntity[];

  /**
   * Evidence submitted against the case.
   */
  evidence: SupportCaseEvidenceEntity[];

  /**
   * Optional single resolution owned by the aggregate.
   */
  resolution?: SupportCaseResolutionEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

export class SupportCaseAggregate extends AggregateRoot<
  SupportCaseAggregateProps,
  SupportCasePublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: SupportCaseAggregateProps) {
    super(props, props.case.id, props.case.publicId);

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(
    supportCase: SupportCaseEntity,
    participants: SupportCaseParticipantEntity[] = [],
    messages: SupportCaseMessageEntity[] = [],
    notes: SupportCaseNoteEntity[] = [],
    evidence: SupportCaseEvidenceEntity[] = [],
    resolution?: SupportCaseResolutionEntity,
  ): SupportCaseAggregate {
    SupportCaseAggregate.ensureCase(supportCase);
    SupportCaseAggregate.ensureParticipants(participants);
    SupportCaseAggregate.ensureMessages(messages);
    SupportCaseAggregate.ensureNotes(notes);
    SupportCaseAggregate.ensureEvidence(evidence);
    SupportCaseAggregate.ensureOptionalResolution(resolution);

    return new SupportCaseAggregate({
      case: supportCase,
      participants: [...participants],
      messages: [...messages],
      notes: [...notes],
      evidence: [...evidence],
      ...(resolution !== undefined ? { resolution } : {}),
    });
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Reconstructs an aggregate from persisted state.
   *
   * Rehydration never records domain events.
   */
  public static rehydrate(
    supportCase: SupportCaseEntity,
    participants: SupportCaseParticipantEntity[] = [],
    messages: SupportCaseMessageEntity[] = [],
    notes: SupportCaseNoteEntity[] = [],
    evidence: SupportCaseEvidenceEntity[] = [],
    resolution?: SupportCaseResolutionEntity,
  ): SupportCaseAggregate {
    SupportCaseAggregate.ensureCase(supportCase);
    SupportCaseAggregate.ensureParticipants(participants);
    SupportCaseAggregate.ensureMessages(messages);
    SupportCaseAggregate.ensureNotes(notes);
    SupportCaseAggregate.ensureEvidence(evidence);
    SupportCaseAggregate.ensureOptionalResolution(resolution);

    return new SupportCaseAggregate({
      case: supportCase,
      participants: [...participants],
      messages: [...messages],
      notes: [...notes],
      evidence: [...evidence],
      ...(resolution !== undefined ? { resolution } : {}),
    });
  }

  // ===========================================================================
  // Support Case
  // ===========================================================================

  public get supportCase(): SupportCaseEntity {
    return this.props.case;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  public override get id(): UniqueEntityId {
    return this.supportCase.id;
  }

  public override get publicId(): SupportCasePublicId {
    return this.supportCase.publicId;
  }

  // ===========================================================================
  // State
  // ===========================================================================

  public get status(): SupportCaseStatus {
    return this.supportCase.status;
  }

  public get priority(): SupportCasePriority {
    return this.supportCase.priority;
  }

  public get category(): SupportCaseCategory {
    return this.supportCase.category;
  }

  public isOpen(): boolean {
    return this.supportCase.isOpen;
  }

  public isResolved(): boolean {
    return this.supportCase.isResolved;
  }

  public isClosed(): boolean {
    return this.supportCase.isClosed;
  }

  public isCancelled(): boolean {
    return this.supportCase.isCancelled;
  }

  public isAssigned(): boolean {
    return this.supportCase.isAssigned;
  }

  // ===========================================================================
  // Participants
  // ===========================================================================

  public get participants(): readonly SupportCaseParticipantEntity[] {
    return this.props.participants;
  }

  public get participantCount(): number {
    return this.props.participants.length;
  }

  public hasParticipants(): boolean {
    return this.props.participants.length > 0;
  }

  /**
   * Determines whether a participant exists by internal identity.
   *
   * Internal ID lookup remains available to the domain model and
   * infrastructure-facing logic.
   */
  public hasParticipantById(participantId: UniqueEntityId): boolean {
    SupportCaseAggregate.ensureInternalId(participantId);

    return this.props.participants.some((participant) =>
      participant.id.equals(participantId),
    );
  }

  /**
   * Returns a participant by internal identity.
   */
  public getParticipantById(
    participantId: UniqueEntityId,
  ): SupportCaseParticipantEntity | undefined {
    SupportCaseAggregate.ensureInternalId(participantId);

    return this.props.participants.find((participant) =>
      participant.id.equals(participantId),
    );
  }

  /**
   * Determines whether a participant exists by public identity.
   *
   * Public identity is the preferred identity for application commands.
   */
  public hasParticipant(
    participantPublicId: SupportCaseParticipantPublicId,
  ): boolean {
    return this.getParticipant(participantPublicId) !== undefined;
  }

  /**
   * Returns a participant by public identity.
   */
  public getParticipant(
    participantPublicId: SupportCaseParticipantPublicId,
  ): SupportCaseParticipantEntity | undefined {
    return this.props.participants.find(
      (participant) => participant.publicId.value === participantPublicId.value,
    );
  }

  public findParticipantByMemberPublicId(
    memberPublicId: string,
  ): SupportCaseParticipantEntity | undefined {
    SupportCaseAggregate.ensureNonEmptyString(
      memberPublicId,
      'Support Case participant member public ID',
    );

    const normalizedMemberPublicId = memberPublicId.trim();

    return this.props.participants.find(
      (participant) => participant.memberPublicId === normalizedMemberPublicId,
    );
  }

  public hasMember(memberPublicId: string): boolean {
    return this.findParticipantByMemberPublicId(memberPublicId) !== undefined;
  }

  // ===========================================================================
  // Add Participant
  // ===========================================================================

  public addParticipant(
    participant: SupportCaseParticipantEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureParticipant(participant);
    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);

    if (this.hasParticipant(participant.publicId)) {
      throw new SupportCaseParticipantAlreadyExistsException();
    }

    if (this.hasMember(participant.memberPublicId)) {
      throw new SupportCaseParticipantAlreadyExistsException();
    }

    if (!participant.isActive) {
      throw new SupportCaseException(
        'Only an active participant can be added to a Support Case.',
      );
    }

    if (participant.joinedAt.getTime() < this.supportCase.openedAt.getTime()) {
      throw new SupportCaseException(
        'Support Case participant cannot join before the case was opened.',
      );
    }

    this.props.participants.push(participant);

    this.addDomainEvent(
      new SupportCaseParticipantAddedEvent(
        this.id.value,
        this.publicId.value,
        participant.publicId.value,
        participant.memberPublicId,
        participant.role.value,
        participant.joinedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Remove Participant
  // ===========================================================================

  /**
   * Removes a participant from the Support Case.
   *
   * Removal is represented by transitioning the participant entity to an
   * inactive state and recording its leftAt timestamp.
   *
   * The participant entity is intentionally retained so membership history
   * remains available after removal.
   *
   * Application-facing operations identify the participant by public identity.
   */
  public removeParticipant(
    participantPublicId: SupportCaseParticipantPublicId,
    correlationId: string,
    causationId?: string,
    removedAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(removedAt, 'participant removal date');

    const participant = this.getParticipant(participantPublicId);

    if (participant === undefined) {
      throw new SupportCaseParticipantNotFoundException();
    }

    if (!participant.isActive) {
      throw new SupportCaseException(
        'Support Case participant is already inactive.',
      );
    }

    if (removedAt.getTime() < participant.joinedAt.getTime()) {
      throw new SupportCaseException(
        'Participant removal timestamp cannot precede participant join timestamp.',
      );
    }

    participant.leave(removedAt);

    const actualLeftAt = participant.leftAt;

    if (actualLeftAt === undefined) {
      throw new SupportCaseException(
        'Support Case participant was removed without a leave timestamp.',
      );
    }

    this.addDomainEvent(
      new SupportCaseParticipantRemovedEvent(
        this.id.value,
        this.publicId.value,
        participant.publicId.value,
        participant.memberPublicId,
        participant.role.value,
        actualLeftAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Messages
  // ===========================================================================

  public get messages(): readonly SupportCaseMessageEntity[] {
    return this.props.messages;
  }

  public get messageCount(): number {
    return this.props.messages.length;
  }

  public hasMessages(): boolean {
    return this.props.messages.length > 0;
  }

  /**
   * Determines whether a message exists by internal identity.
   */
  public hasMessageById(messageId: UniqueEntityId): boolean {
    SupportCaseAggregate.ensureInternalId(messageId);

    return this.props.messages.some((message) => message.id.equals(messageId));
  }

  /**
   * Returns a message by internal identity.
   */
  public getMessageById(
    messageId: UniqueEntityId,
  ): SupportCaseMessageEntity | undefined {
    SupportCaseAggregate.ensureInternalId(messageId);

    return this.props.messages.find((message) => message.id.equals(messageId));
  }

  /**
   * Determines whether a message exists by public identity.
   */
  public hasMessage(messagePublicId: SupportCaseMessagePublicId): boolean {
    return this.getMessage(messagePublicId) !== undefined;
  }

  /**
   * Returns a message by public identity.
   */
  public getMessage(
    messagePublicId: SupportCaseMessagePublicId,
  ): SupportCaseMessageEntity | undefined {
    return this.props.messages.find(
      (message) => message.publicId.value === messagePublicId.value,
    );
  }

  // ===========================================================================
  // Add Message
  // ===========================================================================

  public addMessage(
    message: SupportCaseMessageEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureMessage(message);
    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);

    if (this.hasMessage(message.publicId)) {
      throw new SupportCaseException(
        'Support Case cannot contain duplicate messages.',
      );
    }

    const participant = this.findParticipantByMemberPublicId(
      message.senderPublicId.value,
    );

    if (participant === undefined) {
      throw new SupportCaseException(
        'Support Case message sender must be a participant in the Support Case.',
      );
    }

    if (!participant.isActive) {
      throw new SupportCaseException(
        'Support Case message sender must be an active participant.',
      );
    }

    if (message.sentAt.getTime() < participant.joinedAt.getTime()) {
      throw new SupportCaseException(
        'Support Case message cannot be sent before the sender joined the case.',
      );
    }

    if (
      participant.leftAt !== undefined &&
      message.sentAt.getTime() > participant.leftAt.getTime()
    ) {
      throw new SupportCaseException(
        'Support Case message cannot be sent after the sender left the case.',
      );
    }

    if (message.sentAt.getTime() < this.supportCase.openedAt.getTime()) {
      throw new SupportCaseException(
        'Support Case message cannot be sent before the case was opened.',
      );
    }

    this.props.messages.push(message);

    this.addDomainEvent(
      new SupportCaseMessageAddedEvent(
        this.id.value,
        this.publicId.value,
        message.publicId.value,
        message.senderPublicId.value,
        message.type.value,
        message.content?.value,
        message.assetId?.value,
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
   * Edits a message identified by its public identity.
   */
  public editMessage(
    messagePublicId: SupportCaseMessagePublicId,
    content: SupportCaseMessageContent,
    correlationId: string,
    causationId?: string,
    editedAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureMessageContent(content);
    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(editedAt, 'message edit date');

    const message = this.getMessage(messagePublicId);

    if (message === undefined) {
      throw new SupportCaseMessageNotFoundException();
    }

    const previousContent = message.content?.value;

    message.changeContent(content);

    const actualEditedAt = message.editedAt;

    if (actualEditedAt === undefined) {
      throw new SupportCaseException(
        'Support Case message was edited without an edit timestamp.',
      );
    }

    if (actualEditedAt.getTime() < message.sentAt.getTime()) {
      throw new SupportCaseException(
        'Support Case message edit timestamp cannot precede message timestamp.',
      );
    }

    if (previousContent === message.content?.value) {
      return;
    }

    this.addDomainEvent(
      new SupportCaseMessageEditedEvent(
        this.id.value,
        this.publicId.value,
        message.publicId.value,
        message.content?.value,
        message.assetId?.value,
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
   * Deletes a message identified by its public identity.
   *
   * The message entity is retained so the deletion remains part of the
   * Support Case history.
   */
  public deleteMessage(
    messagePublicId: SupportCaseMessagePublicId,
    correlationId: string,
    causationId?: string,
    deletedAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(deletedAt, 'message deletion date');

    const message = this.getMessage(messagePublicId);

    if (message === undefined) {
      throw new SupportCaseMessageNotFoundException();
    }

    if (deletedAt.getTime() < message.sentAt.getTime()) {
      throw new SupportCaseException(
        'Support Case message deletion timestamp cannot precede message timestamp.',
      );
    }

    message.delete(deletedAt);

    const actualDeletedAt = message.deletedAt;

    if (actualDeletedAt === undefined) {
      throw new SupportCaseException(
        'Support Case message was deleted without a deletion timestamp.',
      );
    }

    this.addDomainEvent(
      new SupportCaseMessageDeletedEvent(
        this.id.value,
        this.publicId.value,
        message.publicId.value,
        actualDeletedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Notes
  // ===========================================================================

  public get notes(): readonly SupportCaseNoteEntity[] {
    return this.props.notes;
  }

  public get noteCount(): number {
    return this.props.notes.length;
  }

  public hasNotes(): boolean {
    return this.props.notes.length > 0;
  }

  public getNote(noteId: UniqueEntityId): SupportCaseNoteEntity | undefined {
    SupportCaseAggregate.ensureInternalId(noteId);

    return this.props.notes.find((note) => note.id.equals(noteId));
  }

  public hasNote(noteId: UniqueEntityId): boolean {
    SupportCaseAggregate.ensureInternalId(noteId);

    return this.props.notes.some((note) => note.id.equals(noteId));
  }

  // ===========================================================================
  // Add Note
  // ===========================================================================

  public addNote(
    note: SupportCaseNoteEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureNote(note);
    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);

    if (this.hasNote(note.id)) {
      throw new SupportCaseException(
        'Support Case cannot contain duplicate notes.',
      );
    }

    this.props.notes.push(note);

    this.addDomainEvent(
      new SupportCaseNoteAddedEvent(
        this.id.value,
        this.publicId.value,
        note.publicId.value,
        note.authorPublicId.value,
        note.content.value,
        note.createdAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Evidence
  // ===========================================================================

  public get evidence(): readonly SupportCaseEvidenceEntity[] {
    return this.props.evidence;
  }

  public get evidenceCount(): number {
    return this.props.evidence.length;
  }

  public hasEvidence(): boolean {
    return this.props.evidence.length > 0;
  }

  public getEvidence(
    evidenceId: UniqueEntityId,
  ): SupportCaseEvidenceEntity | undefined {
    SupportCaseAggregate.ensureInternalId(evidenceId);

    return this.props.evidence.find((evidence) =>
      evidence.id.equals(evidenceId),
    );
  }

  public hasEvidenceById(evidenceId: UniqueEntityId): boolean {
    SupportCaseAggregate.ensureInternalId(evidenceId);

    return this.props.evidence.some((evidence) =>
      evidence.id.equals(evidenceId),
    );
  }

  // ===========================================================================
  // Add Evidence
  // ===========================================================================

  public addEvidence(
    evidence: SupportCaseEvidenceEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureEvidenceEntity(evidence);
    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);

    if (this.hasEvidenceById(evidence.id)) {
      throw new SupportCaseException(
        'Support Case cannot contain duplicate evidence.',
      );
    }

    this.props.evidence.push(evidence);

    this.addDomainEvent(
      new SupportCaseEvidenceAddedEvent(
        this.id.value,
        this.publicId.value,
        evidence.publicId.value,
        evidence.submittedByPublicId.value,
        evidence.assetId.value,
        evidence.description?.value,
        evidence.createdAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Resolution
  // ===========================================================================

  public get resolution(): SupportCaseResolutionEntity | undefined {
    return this.props.resolution;
  }

  public hasResolution(): boolean {
    return this.props.resolution !== undefined;
  }

  // ===========================================================================
  // Create Resolution
  // ===========================================================================

  /**
   * Attaches the single resolution entity to the aggregate.
   *
   * Creating a resolution does NOT transition the Support Case to RESOLVED.
   *
   * The lifecycle transition is performed separately by resolve().
   */
  public createResolution(
    resolution: SupportCaseResolutionEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureResolution(resolution);
    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);

    if (this.hasResolution()) {
      throw new SupportCaseResolutionAlreadyExistsException();
    }

    if (resolution.resolvedAt.getTime() < this.supportCase.openedAt.getTime()) {
      throw new SupportCaseException(
        'Support Case resolution timestamp cannot precede case opening timestamp.',
      );
    }

    this.props.resolution = resolution;

    this.addDomainEvent(
      new SupportCaseResolutionCreatedEvent(
        this.id.value,
        this.publicId.value,
        resolution.publicId.value,
        resolution.type.value,
        resolution.summary.value,
        resolution.resolvedByPublicId.value,
        resolution.resolvedAt,
        resolution.createdAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Record Created
  // ===========================================================================

  public recordCreated(correlationId: string, causationId?: string): void {
    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);

    this.addDomainEvent(
      new SupportCaseCreatedEvent(
        this.id.value,
        this.publicId.value,
        this.supportCase.requesterPublicId.value,
        this.supportCase.status.value,
        this.supportCase.priority.value,
        this.supportCase.category.value,
        this.supportCase.subject.value,
        this.supportCase.description?.value,
        this.supportCase.referenceType?.value,
        this.supportCase.referencePublicId?.value,
        this.supportCase.assignedToPublicId?.value,
        this.supportCase.openedAt,
        this.supportCase.openedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Open
  // ===========================================================================

  /**
   * Records the explicit Support Case opened event.
   *
   * SupportCaseEntity is normally created in OPEN status, therefore this
   * operation intentionally does not mutate the case status.
   */
  public open(correlationId: string, causationId?: string): void {
    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);

    if (this.isCancelled()) {
      throw new SupportCaseAlreadyCancelledException();
    }

    if (this.isClosed()) {
      throw new SupportCaseAlreadyClosedException();
    }

    if (this.isResolved()) {
      throw new SupportCaseAlreadyResolvedException();
    }

    if (this.status.value !== 'OPEN') {
      throw new SupportCaseException(
        'Only a Support Case in OPEN status can be opened.',
      );
    }

    this.addDomainEvent(
      new SupportCaseOpenedEvent(
        this.id.value,
        this.publicId.value,
        this.supportCase.requesterPublicId.value,
        this.supportCase.category.value,
        this.supportCase.subject.value,
        this.supportCase.openedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Assignment
  // ===========================================================================

  public assignTo(
    assignedToPublicId: SupportCaseAssignedToPublicId,
    correlationId: string,
    causationId?: string,
    assignedAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(assignedAt, 'assignment date');

    if (assignedAt.getTime() < this.supportCase.openedAt.getTime()) {
      throw new SupportCaseException(
        'Support Case assignment timestamp cannot precede case opening timestamp.',
      );
    }

    this.supportCase.assignTo(assignedToPublicId);

    this.addDomainEvent(
      new SupportCaseAssignedEvent(
        this.id.value,
        this.publicId.value,
        assignedToPublicId.value,
        assignedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Unassignment
  // ===========================================================================

  public unassign(
    correlationId: string,
    causationId?: string,
    unassignedAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(unassignedAt, 'unassignment date');

    const assignedTo = this.supportCase.assignedToPublicId;

    if (assignedTo === undefined) {
      throw new SupportCaseException('Support Case is not assigned.');
    }

    if (unassignedAt.getTime() < this.supportCase.openedAt.getTime()) {
      throw new SupportCaseException(
        'Support Case unassignment timestamp cannot precede case opening timestamp.',
      );
    }

    this.supportCase.unassign();

    this.addDomainEvent(
      new SupportCaseUnassignedEvent(
        this.id.value,
        this.publicId.value,
        assignedTo.value,
        unassignedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Priority
  // ===========================================================================

  public changePriority(
    priority: SupportCasePriority,
    correlationId: string,
    causationId?: string,
    changedAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(changedAt, 'priority change date');

    const previousPriority = this.supportCase.priority;

    if (previousPriority.equals(priority)) {
      return;
    }

    this.supportCase.changePriority(priority);

    this.addDomainEvent(
      new SupportCasePriorityChangedEvent(
        this.id.value,
        this.publicId.value,
        previousPriority.value,
        priority.value,
        changedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Category
  // ===========================================================================

  public changeCategory(
    category: SupportCaseCategory,
    correlationId: string,
    causationId?: string,
    changedAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(changedAt, 'category change date');

    const previousCategory = this.supportCase.category;

    if (previousCategory.equals(category)) {
      return;
    }

    this.supportCase.changeCategory(category);

    this.addDomainEvent(
      new SupportCaseCategoryChangedEvent(
        this.id.value,
        this.publicId.value,
        previousCategory.value,
        category.value,
        changedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Start
  // ===========================================================================

  public start(
    correlationId: string,
    causationId?: string,
    startedAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(startedAt, 'start date');

    const previousStatus = this.status;

    if (
      previousStatus.value !== 'OPEN' &&
      previousStatus.value !== 'WAITING_FOR_MEMBER' &&
      previousStatus.value !== 'WAITING_FOR_INTERNAL_ACTION'
    ) {
      throw new SupportCaseException(
        'Support Case cannot be started from its current status.',
      );
    }

    this.supportCase.changeStatus(SupportCaseStatus.create('IN_PROGRESS'));

    this.addDomainEvent(
      new SupportCaseStartedEvent(
        this.id.value,
        this.publicId.value,
        startedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Waiting For Member
  // ===========================================================================

  public waitForMember(
    correlationId: string,
    causationId?: string,
    waitingAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(waitingAt, 'waiting-for-member date');

    if (this.status.value !== 'IN_PROGRESS') {
      throw new SupportCaseException(
        'Support Case must be IN_PROGRESS before it can wait for a member.',
      );
    }

    this.supportCase.changeStatus(
      SupportCaseStatus.create('WAITING_FOR_MEMBER'),
    );

    this.addDomainEvent(
      new SupportCaseWaitingForMemberEvent(
        this.id.value,
        this.publicId.value,
        waitingAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Waiting For Internal Action
  // ===========================================================================

  public waitForInternalAction(
    correlationId: string,
    causationId?: string,
    waitingAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(
      waitingAt,
      'waiting-for-internal-action date',
    );

    if (this.status.value !== 'IN_PROGRESS') {
      throw new SupportCaseException(
        'Support Case must be IN_PROGRESS before it can wait for internal action.',
      );
    }

    this.supportCase.changeStatus(
      SupportCaseStatus.create('WAITING_FOR_INTERNAL_ACTION'),
    );

    this.addDomainEvent(
      new SupportCaseWaitingForInternalActionEvent(
        this.id.value,
        this.publicId.value,
        waitingAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Resolve
  // ===========================================================================

  /**
   * Transitions the Support Case to RESOLVED.
   *
   * A resolution entity must already exist.
   */
  public resolve(
    correlationId: string,
    causationId?: string,
    resolvedAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(resolvedAt, 'resolution date');

    if (this.isResolved()) {
      throw new SupportCaseAlreadyResolvedException();
    }

    const resolution = this.resolution;

    if (resolution === undefined) {
      throw new SupportCaseException(
        'A Support Case must contain a resolution before it can be resolved.',
      );
    }

    if (
      this.status.value !== 'IN_PROGRESS' &&
      this.status.value !== 'WAITING_FOR_MEMBER' &&
      this.status.value !== 'WAITING_FOR_INTERNAL_ACTION'
    ) {
      throw new SupportCaseException(
        'Support Case cannot be resolved from its current status.',
      );
    }

    if (resolution.resolvedAt.getTime() !== resolvedAt.getTime()) {
      throw new SupportCaseException(
        'Support Case resolution timestamp must match the resolution operation timestamp.',
      );
    }

    if (resolvedAt.getTime() < this.supportCase.openedAt.getTime()) {
      throw new SupportCaseException(
        'Support Case resolution timestamp cannot precede opening timestamp.',
      );
    }

    this.supportCase.markResolved(resolvedAt);

    this.supportCase.changeStatus(SupportCaseStatus.create('RESOLVED'));

    this.addDomainEvent(
      new SupportCaseResolvedEvent(
        this.id.value,
        this.publicId.value,
        resolution.publicId.value,
        resolution.type.value,
        resolution.summary.value,
        resolution.resolvedByPublicId.value,
        resolvedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Close
  // ===========================================================================

  public close(
    correlationId: string,
    causationId?: string,
    closedAt: Date = new Date(),
  ): void {
    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(closedAt, 'closure date');

    if (this.isClosed()) {
      throw new SupportCaseAlreadyClosedException();
    }

    if (this.isCancelled()) {
      throw new SupportCaseAlreadyCancelledException();
    }

    if (!this.isResolved()) {
      throw new SupportCaseException(
        'Only a resolved Support Case can be closed.',
      );
    }

    const resolvedAt = this.supportCase.resolvedAt;

    if (resolvedAt !== undefined && closedAt.getTime() < resolvedAt.getTime()) {
      throw new SupportCaseException(
        'Support Case closure timestamp cannot precede resolution timestamp.',
      );
    }

    this.supportCase.markClosed(closedAt);

    this.supportCase.changeStatus(SupportCaseStatus.create('CLOSED'));

    this.addDomainEvent(
      new SupportCaseClosedEvent(
        this.id.value,
        this.publicId.value,
        closedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Cancel
  // ===========================================================================

  public cancel(
    correlationId: string,
    causationId?: string,
    cancelledAt: Date = new Date(),
  ): void {
    SupportCaseAggregate.ensureCorrelationId(correlationId);
    SupportCaseAggregate.ensureOptionalCausationId(causationId);
    SupportCaseAggregate.ensureValidDate(cancelledAt, 'cancellation date');

    if (this.isCancelled()) {
      throw new SupportCaseAlreadyCancelledException();
    }

    if (this.isClosed()) {
      throw new SupportCaseAlreadyClosedException();
    }

    if (this.isResolved()) {
      throw new SupportCaseAlreadyResolvedException();
    }

    if (
      this.status.value !== 'OPEN' &&
      this.status.value !== 'IN_PROGRESS' &&
      this.status.value !== 'WAITING_FOR_MEMBER' &&
      this.status.value !== 'WAITING_FOR_INTERNAL_ACTION'
    ) {
      throw new SupportCaseException(
        'Support Case cannot be cancelled from its current status.',
      );
    }

    if (cancelledAt.getTime() < this.supportCase.openedAt.getTime()) {
      throw new SupportCaseException(
        'Support Case cancellation timestamp cannot precede opening timestamp.',
      );
    }

    this.supportCase.markCancelled(cancelledAt);

    this.supportCase.changeStatus(SupportCaseStatus.create('CANCELLED'));

    this.addDomainEvent(
      new SupportCaseCancelledEvent(
        this.id.value,
        this.publicId.value,
        cancelledAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Aggregate Invariants
  // ===========================================================================

  private validateAggregateInvariants(): void {
    SupportCaseAggregate.ensureCase(this.supportCase);
    SupportCaseAggregate.ensureParticipants(this.participants);
    SupportCaseAggregate.ensureMessages(this.messages);
    SupportCaseAggregate.ensureNotes(this.notes);
    SupportCaseAggregate.ensureEvidence(this.evidence);
    SupportCaseAggregate.ensureOptionalResolution(this.resolution);

    this.ensureParticipantIdsAreUnique();
    this.ensureParticipantMembersAreUnique();

    this.ensureMessageIdsAreUnique();
    this.ensureMessageSendersAreParticipants();
    this.ensureMessageTemporalConsistency();

    this.ensureNoteIdsAreUnique();

    this.ensureEvidenceIdsAreUnique();

    this.ensureResolutionUniqueness();
    this.ensureResolutionLifecycleConsistency();

    this.ensureAggregateLifecycleConsistency();
  }

  // ===========================================================================
  // Participant Invariants
  // ===========================================================================

  private ensureParticipantIdsAreUnique(): void {
    const participantIds = new Set<string>();
    const participantPublicIds = new Set<string>();

    for (const participant of this.participants) {
      const participantId = participant.id.value;
      const participantPublicId = participant.publicId.value;

      if (participantIds.has(participantId)) {
        throw new SupportCaseException(
          'Support Case cannot contain duplicate participants.',
        );
      }

      if (participantPublicIds.has(participantPublicId)) {
        throw new SupportCaseException(
          'Support Case cannot contain duplicate participant public identities.',
        );
      }

      participantIds.add(participantId);
      participantPublicIds.add(participantPublicId);
    }
  }

  private ensureParticipantMembersAreUnique(): void {
    const memberPublicIds = new Set<string>();

    for (const participant of this.participants) {
      const memberPublicId = participant.memberPublicId;

      if (memberPublicIds.has(memberPublicId)) {
        throw new SupportCaseException(
          'Support Case cannot contain duplicate participant members.',
        );
      }

      memberPublicIds.add(memberPublicId);
    }
  }

  // ===========================================================================
  // Message Invariants
  // ===========================================================================

  private ensureMessageIdsAreUnique(): void {
    const messageIds = new Set<string>();
    const messagePublicIds = new Set<string>();

    for (const message of this.messages) {
      const messageId = message.id.value;
      const messagePublicId = message.publicId.value;

      if (messageIds.has(messageId)) {
        throw new SupportCaseException(
          'Support Case cannot contain duplicate messages.',
        );
      }

      if (messagePublicIds.has(messagePublicId)) {
        throw new SupportCaseException(
          'Support Case cannot contain duplicate message public identities.',
        );
      }

      messageIds.add(messageId);
      messagePublicIds.add(messagePublicId);
    }
  }

  private ensureMessageSendersAreParticipants(): void {
    for (const message of this.messages) {
      if (!this.hasMember(message.senderPublicId.value)) {
        throw new SupportCaseException(
          'Support Case contains a message whose sender is not a participant.',
        );
      }
    }
  }

  private ensureMessageTemporalConsistency(): void {
    for (const message of this.messages) {
      const participant = this.findParticipantByMemberPublicId(
        message.senderPublicId.value,
      );

      if (participant === undefined) {
        throw new SupportCaseException(
          'Support Case contains a message whose sender is not a participant.',
        );
      }

      if (message.sentAt.getTime() < this.supportCase.openedAt.getTime()) {
        throw new SupportCaseException(
          'Support Case contains a message sent before the case was opened.',
        );
      }

      if (message.sentAt.getTime() < participant.joinedAt.getTime()) {
        throw new SupportCaseException(
          'Support Case contains a message sent before the sender joined the case.',
        );
      }

      if (
        participant.leftAt !== undefined &&
        message.sentAt.getTime() > participant.leftAt.getTime()
      ) {
        throw new SupportCaseException(
          'Support Case contains a message sent after the sender left the case.',
        );
      }

      if (
        message.editedAt !== undefined &&
        message.editedAt.getTime() < message.sentAt.getTime()
      ) {
        throw new SupportCaseException(
          'Support Case contains a message edited before it was sent.',
        );
      }

      if (
        message.deletedAt !== undefined &&
        message.deletedAt.getTime() < message.sentAt.getTime()
      ) {
        throw new SupportCaseException(
          'Support Case contains a message deleted before it was sent.',
        );
      }
    }
  }

  // ===========================================================================
  // Note Invariants
  // ===========================================================================

  private ensureNoteIdsAreUnique(): void {
    const noteIds = new Set<string>();

    for (const note of this.notes) {
      const noteId = note.id.value;

      if (noteIds.has(noteId)) {
        throw new SupportCaseException(
          'Support Case cannot contain duplicate notes.',
        );
      }

      noteIds.add(noteId);
    }
  }

  // ===========================================================================
  // Evidence Invariants
  // ===========================================================================

  private ensureEvidenceIdsAreUnique(): void {
    const evidenceIds = new Set<string>();

    for (const evidence of this.evidence) {
      const evidenceId = evidence.id.value;

      if (evidenceIds.has(evidenceId)) {
        throw new SupportCaseException(
          'Support Case cannot contain duplicate evidence.',
        );
      }

      evidenceIds.add(evidenceId);
    }
  }

  // ===========================================================================
  // Resolution Invariants
  // ===========================================================================

  private ensureResolutionUniqueness(): void {
    if (this.resolution === undefined) {
      return;
    }

    if (!(this.resolution instanceof SupportCaseResolutionEntity)) {
      throw new SupportCaseException(
        'Support Case resolution must be a valid SupportCaseResolutionEntity.',
      );
    }
  }

  /**
   * A resolution may exist before the case becomes RESOLVED.
   *
   * Once the case is RESOLVED:
   *
   * - a resolution must exist;
   * - the resolution timestamp must equal case.resolvedAt.
   */
  private ensureResolutionLifecycleConsistency(): void {
    const resolution = this.resolution;

    if (resolution === undefined) {
      if (this.supportCase.isResolved) {
        throw new SupportCaseException(
          'A resolved Support Case must contain a resolution.',
        );
      }

      return;
    }

    if (resolution.resolvedAt.getTime() < this.supportCase.openedAt.getTime()) {
      throw new SupportCaseException(
        'Support Case resolution timestamp cannot precede case opening timestamp.',
      );
    }

    if (!this.supportCase.isResolved) {
      return;
    }

    const caseResolvedAt = this.supportCase.resolvedAt;

    if (caseResolvedAt === undefined) {
      throw new SupportCaseException(
        'A resolved Support Case must contain a resolution timestamp.',
      );
    }

    if (resolution.resolvedAt.getTime() !== caseResolvedAt.getTime()) {
      throw new SupportCaseException(
        'Support Case resolution timestamp must match the case resolution timestamp.',
      );
    }
  }

  // ===========================================================================
  // Lifecycle Invariants
  // ===========================================================================

  private ensureAggregateLifecycleConsistency(): void {
    const resolvedAt = this.supportCase.resolvedAt;
    const closedAt = this.supportCase.closedAt;
    const cancelledAt = this.supportCase.cancelledAt;

    // -------------------------------------------------------------------------
    // Resolved
    // -------------------------------------------------------------------------

    if (this.status.value === 'RESOLVED') {
      if (resolvedAt === undefined) {
        throw new SupportCaseException(
          'A resolved Support Case must contain a resolution timestamp.',
        );
      }

      if (this.resolution === undefined) {
        throw new SupportCaseException(
          'A resolved Support Case must contain a resolution.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Closed
    // -------------------------------------------------------------------------

    if (this.status.value === 'CLOSED' && closedAt === undefined) {
      throw new SupportCaseException(
        'A closed Support Case must contain a closure timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // Cancelled
    // -------------------------------------------------------------------------

    if (this.status.value === 'CANCELLED' && cancelledAt === undefined) {
      throw new SupportCaseException(
        'A cancelled Support Case must contain a cancellation timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // Temporal consistency
    // -------------------------------------------------------------------------

    if (
      closedAt !== undefined &&
      resolvedAt !== undefined &&
      closedAt.getTime() < resolvedAt.getTime()
    ) {
      throw new SupportCaseException(
        'Support Case closure timestamp cannot precede resolution timestamp.',
      );
    }

    if (
      resolvedAt !== undefined &&
      resolvedAt.getTime() < this.supportCase.openedAt.getTime()
    ) {
      throw new SupportCaseException(
        'Support Case resolution timestamp cannot precede opening timestamp.',
      );
    }

    if (
      closedAt !== undefined &&
      closedAt.getTime() < this.supportCase.openedAt.getTime()
    ) {
      throw new SupportCaseException(
        'Support Case closure timestamp cannot precede opening timestamp.',
      );
    }

    if (
      cancelledAt !== undefined &&
      cancelledAt.getTime() < this.supportCase.openedAt.getTime()
    ) {
      throw new SupportCaseException(
        'Support Case cancellation timestamp cannot precede opening timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // Mutually exclusive terminal timestamps
    // -------------------------------------------------------------------------

    if (cancelledAt !== undefined && resolvedAt !== undefined) {
      throw new SupportCaseException(
        'A Support Case cannot contain both resolution and cancellation timestamps.',
      );
    }

    if (cancelledAt !== undefined && closedAt !== undefined) {
      throw new SupportCaseException(
        'A Support Case cannot contain both cancellation and closure timestamps.',
      );
    }
  }

  // ===========================================================================
  // Operational State
  // ===========================================================================

  /**
   * Guards mutations against terminal Support Case states.
   *
   * RESOLVED, CLOSED and CANCELLED are non-operational.
   */
  private ensureOperational(): void {
    if (this.isClosed()) {
      throw new SupportCaseAlreadyClosedException();
    }

    if (this.isCancelled()) {
      throw new SupportCaseAlreadyCancelledException();
    }

    if (this.isResolved()) {
      throw new SupportCaseAlreadyResolvedException();
    }
  }

  // ===========================================================================
  // Entity Guards
  // ===========================================================================

  private static ensureCase(
    supportCase: unknown,
  ): asserts supportCase is SupportCaseEntity {
    if (!(supportCase instanceof SupportCaseEntity)) {
      throw new SupportCaseException(
        'Support Case aggregate requires a valid SupportCaseEntity.',
      );
    }
  }

  private static ensureParticipant(
    participant: unknown,
  ): asserts participant is SupportCaseParticipantEntity {
    if (!(participant instanceof SupportCaseParticipantEntity)) {
      throw new SupportCaseException(
        'Support Case participant must be a valid SupportCaseParticipantEntity.',
      );
    }
  }

  private static ensureParticipants(
    participants: unknown,
  ): asserts participants is SupportCaseParticipantEntity[] {
    if (!Array.isArray(participants)) {
      throw new SupportCaseException(
        'Support Case participants must be an array.',
      );
    }

    for (const participant of participants) {
      SupportCaseAggregate.ensureParticipant(participant);
    }
  }

  private static ensureMessage(
    message: unknown,
  ): asserts message is SupportCaseMessageEntity {
    if (!(message instanceof SupportCaseMessageEntity)) {
      throw new SupportCaseException(
        'Support Case message must be a valid SupportCaseMessageEntity.',
      );
    }
  }

  private static ensureMessages(
    messages: unknown,
  ): asserts messages is SupportCaseMessageEntity[] {
    if (!Array.isArray(messages)) {
      throw new SupportCaseException('Support Case messages must be an array.');
    }

    for (const message of messages) {
      SupportCaseAggregate.ensureMessage(message);
    }
  }

  private static ensureNote(
    note: unknown,
  ): asserts note is SupportCaseNoteEntity {
    if (!(note instanceof SupportCaseNoteEntity)) {
      throw new SupportCaseException(
        'Support Case note must be a valid SupportCaseNoteEntity.',
      );
    }
  }

  private static ensureNotes(
    notes: unknown,
  ): asserts notes is SupportCaseNoteEntity[] {
    if (!Array.isArray(notes)) {
      throw new SupportCaseException('Support Case notes must be an array.');
    }

    for (const note of notes) {
      SupportCaseAggregate.ensureNote(note);
    }
  }

  private static ensureEvidenceEntity(
    evidence: unknown,
  ): asserts evidence is SupportCaseEvidenceEntity {
    if (!(evidence instanceof SupportCaseEvidenceEntity)) {
      throw new SupportCaseException(
        'Support Case evidence must be a valid SupportCaseEvidenceEntity.',
      );
    }
  }

  private static ensureEvidence(
    evidence: unknown,
  ): asserts evidence is SupportCaseEvidenceEntity[] {
    if (!Array.isArray(evidence)) {
      throw new SupportCaseException('Support Case evidence must be an array.');
    }

    for (const item of evidence) {
      SupportCaseAggregate.ensureEvidenceEntity(item);
    }
  }

  private static ensureResolution(
    resolution: unknown,
  ): asserts resolution is SupportCaseResolutionEntity {
    if (!(resolution instanceof SupportCaseResolutionEntity)) {
      throw new SupportCaseException(
        'Support Case resolution must be a valid SupportCaseResolutionEntity.',
      );
    }
  }

  private static ensureOptionalResolution(
    resolution: unknown,
  ): asserts resolution is SupportCaseResolutionEntity | undefined {
    if (
      resolution !== undefined &&
      !(resolution instanceof SupportCaseResolutionEntity)
    ) {
      throw new SupportCaseException(
        'Support Case resolution must be a valid SupportCaseResolutionEntity.',
      );
    }
  }

  // ===========================================================================
  // Identity Guards
  // ===========================================================================

  private static ensureInternalId(id: unknown): asserts id is UniqueEntityId {
    if (!(id instanceof UniqueEntityId)) {
      throw new SupportCaseException(
        'Support Case internal identity must be a valid internal entity identity.',
      );
    }
  }

  // ===========================================================================
  // Value Object Guards
  // ===========================================================================

  private static ensureMessageContent(
    content: unknown,
  ): asserts content is SupportCaseMessageContent {
    if (!content || typeof content !== 'object' || !('value' in content)) {
      throw new SupportCaseException(
        'Support Case message content must be a valid value object.',
      );
    }
  }

  // ===========================================================================
  // Event Guards
  // ===========================================================================

  private static ensureCorrelationId(correlationId: string): void {
    SupportCaseAggregate.ensureNonEmptyString(
      correlationId,
      'Support Case correlation identity',
    );
  }

  private static ensureOptionalCausationId(
    causationId: string | undefined,
  ): void {
    if (causationId === undefined) {
      return;
    }

    SupportCaseAggregate.ensureNonEmptyString(
      causationId,
      'Support Case causation identity',
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
      throw new SupportCaseException(
        `${fieldName} must be a non-empty string.`,
      );
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
      throw new SupportCaseException(
        `Support Case ${fieldName} must be a valid date.`,
      );
    }
  }
}
