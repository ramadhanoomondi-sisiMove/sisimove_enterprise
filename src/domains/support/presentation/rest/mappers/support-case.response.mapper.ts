// -----------------------------------------------------------------------------
// Support — Case Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the SupportCaseAggregate / SupportCaseEntity domain model into
// application-facing SupportCaseResponse objects.
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
// Mapping principles:
//
// - Expose Support Case-safe state.
// - Serialize value objects into primitives.
// - Expose the Support Case public identity.
// - Expose requester public identity.
// - Expose case status, priority, and category.
// - Expose case subject and description.
// - Expose optional reference metadata.
// - Expose optional assignment metadata.
// - Expose case lifecycle timestamps.
// - Expose case version.
// - Expose aggregate-owned participants.
// - Expose aggregate-owned messages.
// - Expose aggregate-owned notes.
// - Expose aggregate-owned evidence.
// - Expose optional resolution.
// - Return defensive Date instances.
// - Do not expose internal persistence identifiers.
// - Do not expose domain entities.
// - Do not expose value objects directly.
// - Do not access Prisma.
// - Do not access persistence models.
// - Do not resolve Identity references.
// - Do not resolve referenced domains.
// - Do not evaluate authorization.
// - Do not perform business validation.
// - Do not mutate the aggregate.
// - Do not emit domain events.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map SupportCaseAggregate -> SupportCaseResponse.
// - Map SupportCaseEntity -> SupportCaseResponse.
// - Map SupportCaseParticipantEntity ->
//   SupportCaseParticipantResponse.
// - Map SupportCaseMessageEntity ->
//   SupportCaseMessageResponse.
// - Map SupportCaseNoteEntity -> SupportCaseNoteResponse.
// - Map SupportCaseEvidenceEntity ->
//   SupportCaseEvidenceResponse.
// - Map SupportCaseResolutionEntity ->
//   SupportCaseResolutionResponse.
// - Provide one canonical Support Case mapping implementation.
// - Convert Support Case value objects into primitive response values.
// - Convert child value objects into primitive response values.
// - Expose aggregate-owned collection state.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the Support Case aggregate.
// - Persist the Support Case aggregate.
// - Access Prisma.
// - Access repositories.
// - Resolve Identity members.
// - Resolve Journey.
// - Resolve Booking.
// - Resolve Wallet.
// - Resolve Payment.
// - Resolve Trust.
// - Resolve Verification.
// - Resolve referenced domains.
// - Perform authorization.
// - Perform business validation.
// - Emit domain events.
// - Change Support Case lifecycle state.
// - Change child entity state.
//
// -----------------------------------------------------------------------------
//
// Identity:
//
// publicId is the externally safe Support Case identifier.
//
// The internal Support Case entity identity (`id`) is intentionally excluded.
//
// requesterPublicId is exposed as an opaque public reference to the requester
// owned by the Identity domain.
//
// assignedToPublicId is exposed as an opaque public reference when the case
// has been assigned.
//
// Child public identities are exposed.
//
// Internal child identities and foreign-key identifiers are intentionally
// excluded.
//
// -----------------------------------------------------------------------------
//
// References:
//
// referenceType and referencePublicId are exposed when the Support Case has
// an associated domain reference.
//
// These values remain opaque metadata.
//
// This mapper does not resolve the referenced domain object.
//
// -----------------------------------------------------------------------------
//
// Participants:
//
// SupportCaseAggregate owns SupportCaseParticipantEntity[].
//
// The mapper exposes:
//
// - participantCount;
// - hasParticipants;
// - participants.
//
// Participant internal identity and caseId are intentionally excluded.
//
// -----------------------------------------------------------------------------
//
// Messages:
//
// SupportCaseAggregate owns SupportCaseMessageEntity[].
//
// The mapper exposes:
//
// - messageCount;
// - hasMessages;
// - messages.
//
// Message internal identity and caseId are intentionally excluded.
//
// -----------------------------------------------------------------------------
//
// Notes:
//
// SupportCaseAggregate owns SupportCaseNoteEntity[].
//
// The mapper exposes:
//
// - noteCount;
// - hasNotes;
// - notes.
//
// Note internal identity and caseId are intentionally excluded.
//
// -----------------------------------------------------------------------------
//
// Evidence:
//
// SupportCaseAggregate owns SupportCaseEvidenceEntity[].
//
// The mapper exposes:
//
// - evidenceCount;
// - hasEvidence;
// - evidence.
//
// Evidence internal identity and caseId are intentionally excluded.
//
// -----------------------------------------------------------------------------
//
// Resolution:
//
// SupportCaseAggregate may contain one SupportCaseResolutionEntity.
//
// The mapper exposes:
//
// - hasResolution;
// - resolution.
//
// The resolution internal identity and caseId are intentionally excluded.
//
// -----------------------------------------------------------------------------
//
// Dates:
//
// Date values are returned as defensive copies so callers cannot mutate the
// domain entity's Date instances through the response object.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { SupportCaseAggregate } from '../../../domain/aggregates/support-case.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { SupportCaseEntity } from '../../../domain/entities/support-case.entity';

import type { SupportCaseParticipantEntity } from '../../../domain/entities/support-case-participant.entity';

import type { SupportCaseMessageEntity } from '../../../domain/entities/support-case-message.entity';

import type { SupportCaseNoteEntity } from '../../../domain/entities/support-case-note.entity';

import type { SupportCaseEvidenceEntity } from '../../../domain/entities/support-case-evidence.entity';

import type { SupportCaseResolutionEntity } from '../../../domain/entities/support-case-resolution.entity';

// =============================================================================
// Support Case Participant Response
// =============================================================================

export interface SupportCaseParticipantResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Support Case Participant.
   *
   * The internal participant identity is intentionally excluded.
   */
  publicId: string;

  /**
   * Public identifier of the member participating in the case.
   *
   * This is an opaque reference to the Identity domain.
   */
  memberPublicId: string;

  // ---------------------------------------------------------------------------
  // Participation
  // ---------------------------------------------------------------------------

  /**
   * Role of the participant in the Support Case.
   */
  role: string;

  /**
   * Timestamp at which the participant joined the case.
   */
  joinedAt: Date;

  /**
   * Timestamp at which the participant left the case.
   *
   * Undefined while the participant remains active.
   */
  leftAt: Date | undefined;

  /**
   * Indicates whether the participant is currently active.
   */
  isActive: boolean;

  /**
   * Indicates whether the participant has left the case.
   */
  hasLeft: boolean;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the participant was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the participant was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Support Case Message Response
// =============================================================================

export interface SupportCaseMessageResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Support Case Message.
   *
   * The internal message identity is intentionally excluded.
   */
  publicId: string;

  /**
   * Public identifier of the message sender.
   *
   * This is an opaque reference to the Identity domain.
   */
  senderPublicId: string;

  // ---------------------------------------------------------------------------
  // Message
  // ---------------------------------------------------------------------------

  /**
   * Type of Support Case message.
   */
  type: string;

  /**
   * Message content.
   *
   * Undefined for messages that do not contain textual content.
   */
  content: string | undefined;

  /**
   * Public/reference identifier of the attached asset.
   *
   * Undefined when no asset is attached.
   */
  assetId: string | undefined;

  // ---------------------------------------------------------------------------
  // Message Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the message was sent.
   */
  sentAt: Date;

  /**
   * Timestamp at which the message was edited.
   *
   * Undefined when the message has never been edited.
   */
  editedAt: Date | undefined;

  /**
   * Timestamp at which the message was deleted.
   *
   * Undefined when the message has not been deleted.
   */
  deletedAt: Date | undefined;

  /**
   * Indicates whether the message has been edited.
   */
  isEdited: boolean;

  /**
   * Indicates whether the message has been deleted.
   */
  isDeleted: boolean;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the message was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the message was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Support Case Note Response
// =============================================================================

export interface SupportCaseNoteResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Support Case Note.
   *
   * The internal note identity is intentionally excluded.
   */
  publicId: string;

  /**
   * Public identifier of the note author.
   *
   * This is an opaque reference to the Identity domain.
   */
  authorPublicId: string;

  // ---------------------------------------------------------------------------
  // Note
  // ---------------------------------------------------------------------------

  /**
   * Note content.
   */
  content: string;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the note was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the note was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Support Case Evidence Response
// =============================================================================

export interface SupportCaseEvidenceResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Support Case Evidence.
   *
   * The internal evidence identity is intentionally excluded.
   */
  publicId: string;

  /**
   * Public identifier of the member who submitted the evidence.
   *
   * This is an opaque reference to the Identity domain.
   */
  submittedByPublicId: string;

  // ---------------------------------------------------------------------------
  // Evidence
  // ---------------------------------------------------------------------------

  /**
   * Asset identifier associated with the evidence.
   */
  assetId: string;

  /**
   * Optional description of the evidence.
   */
  description: string | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the evidence was created.
   */
  createdAt: Date;
}

// =============================================================================
// Support Case Resolution Response
// =============================================================================

export interface SupportCaseResolutionResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Support Case Resolution.
   *
   * The internal resolution identity is intentionally excluded.
   */
  publicId: string;

  // ---------------------------------------------------------------------------
  // Resolution
  // ---------------------------------------------------------------------------

  /**
   * Type of resolution applied to the Support Case.
   */
  type: string;

  /**
   * Resolution summary.
   */
  summary: string;

  /**
   * Public identifier of the member who resolved the case.
   *
   * This is an opaque reference to the Identity domain.
   */
  resolvedByPublicId: string;

  // ---------------------------------------------------------------------------
  // Resolution Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the resolution was applied.
   */
  resolvedAt: Date;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the resolution was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the resolution was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Support Case Response
// =============================================================================

export interface SupportCaseResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Support Case aggregate.
   */
  publicId: string;

  /**
   * Public identifier of the Support Case requester.
   *
   * This is an opaque reference to the Identity domain.
   */
  requesterPublicId: string;

  // ---------------------------------------------------------------------------
  // Case
  // ---------------------------------------------------------------------------

  /**
   * Current Support Case lifecycle status.
   */
  status: string;

  /**
   * Current Support Case priority.
   */
  priority: string;

  /**
   * Support Case category.
   */
  category: string;

  /**
   * Support Case subject.
   */
  subject: string;

  /**
   * Optional Support Case description.
   */
  description: string | undefined;

  // ---------------------------------------------------------------------------
  // Reference
  // ---------------------------------------------------------------------------

  /**
   * Type of the domain object referenced by the Support Case.
   *
   * Undefined when no reference exists.
   */
  referenceType: string | undefined;

  /**
   * Public identifier of the domain object referenced by the Support Case.
   *
   * Undefined when no reference exists.
   */
  referencePublicId: string | undefined;

  // ---------------------------------------------------------------------------
  // Assignment
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the member or agent assigned to the Support Case.
   *
   * Undefined when the case is not assigned.
   */
  assignedToPublicId: string | undefined;

  /**
   * Indicates whether the Support Case is assigned.
   */
  isAssigned: boolean;

  // ---------------------------------------------------------------------------
  // Case Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Support Case was opened.
   */
  openedAt: Date;

  /**
   * Timestamp at which the Support Case was resolved.
   *
   * Undefined when the case has not been resolved.
   */
  resolvedAt: Date | undefined;

  /**
   * Timestamp at which the Support Case was closed.
   *
   * Undefined when the case has not been closed.
   */
  closedAt: Date | undefined;

  /**
   * Timestamp at which the Support Case was cancelled.
   *
   * Undefined when the case has not been cancelled.
   */
  cancelledAt: Date | undefined;

  /**
   * Indicates whether the Support Case is resolved.
   */
  isResolved: boolean;

  /**
   * Indicates whether the Support Case is closed.
   */
  isClosed: boolean;

  /**
   * Indicates whether the Support Case is cancelled.
   */
  isCancelled: boolean;

  /**
   * Indicates whether the Support Case is currently open.
   */
  isOpen: boolean;

  /**
   * Current aggregate version.
   */
  version: number;

  // ---------------------------------------------------------------------------
  // Participants
  // ---------------------------------------------------------------------------

  /**
   * Number of participants owned by the aggregate.
   */
  participantCount: number;

  /**
   * Indicates whether the aggregate contains participants.
   */
  hasParticipants: boolean;

  /**
   * Participants owned by the Support Case aggregate.
   */
  participants: SupportCaseParticipantResponse[];

  // ---------------------------------------------------------------------------
  // Messages
  // ---------------------------------------------------------------------------

  /**
   * Number of messages owned by the aggregate.
   */
  messageCount: number;

  /**
   * Indicates whether the aggregate contains messages.
   */
  hasMessages: boolean;

  /**
   * Messages owned by the Support Case aggregate.
   */
  messages: SupportCaseMessageResponse[];

  // ---------------------------------------------------------------------------
  // Notes
  // ---------------------------------------------------------------------------

  /**
   * Number of notes owned by the aggregate.
   */
  noteCount: number;

  /**
   * Indicates whether the aggregate contains notes.
   */
  hasNotes: boolean;

  /**
   * Notes owned by the Support Case aggregate.
   */
  notes: SupportCaseNoteResponse[];

  // ---------------------------------------------------------------------------
  // Evidence
  // ---------------------------------------------------------------------------

  /**
   * Number of evidence records owned by the aggregate.
   */
  evidenceCount: number;

  /**
   * Indicates whether the aggregate contains evidence.
   */
  hasEvidence: boolean;

  /**
   * Evidence records owned by the Support Case aggregate.
   */
  evidence: SupportCaseEvidenceResponse[];

  // ---------------------------------------------------------------------------
  // Resolution
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the Support Case has a resolution entity.
   */
  hasResolution: boolean;

  /**
   * Resolution associated with the Support Case.
   *
   * Undefined when no resolution has been created.
   */
  resolution: SupportCaseResolutionResponse | undefined;
}

// =============================================================================
// Mapper
// =============================================================================

export class SupportCaseResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps a SupportCaseAggregate into a SupportCaseResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(
    aggregate: SupportCaseAggregate,
  ): SupportCaseResponse {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Support Case aggregate is required.');
    }

    return this.mapAggregate(aggregate);
  }

  // ===========================================================================
  // Entity -> Response
  // ===========================================================================

  /**
   * Maps a SupportCaseEntity directly into a SupportCaseResponse.
   *
   * Entity-level child collection state is not available from the
   * SupportCaseEntity alone.
   *
   * Therefore:
   *
   * - participants is an empty collection;
   * - participantCount is 0;
   * - hasParticipants is false;
   * - messages is an empty collection;
   * - messageCount is 0;
   * - hasMessages is false;
   * - notes is an empty collection;
   * - noteCount is 0;
   * - hasNotes is false;
   * - evidence is an empty collection;
   * - evidenceCount is 0;
   * - hasEvidence is false;
   * - hasResolution is false;
   * - resolution is undefined.
   *
   * Application workflows that have the complete aggregate should prefer
   * toResponse().
   */
  public static fromEntity(
    supportCase: SupportCaseEntity,
  ): SupportCaseResponse {
    if (supportCase === undefined || supportCase === null) {
      throw new Error('Support Case entity is required.');
    }

    return this.mapEntity(supportCase);
  }

  // ===========================================================================
  // Participant Entity -> Response
  // ===========================================================================

  /**
   * Maps a SupportCaseParticipantEntity into a safe response object.
   *
   * The participant entity is owned by SupportCaseAggregate and is therefore
   * mapped here rather than through an independent aggregate response mapper.
   */
  public static fromParticipantEntity(
    participant: SupportCaseParticipantEntity,
  ): SupportCaseParticipantResponse {
    if (participant === undefined || participant === null) {
      throw new Error('Support Case Participant entity is required.');
    }

    return this.mapParticipant(participant);
  }

  // ===========================================================================
  // Message Entity -> Response
  // ===========================================================================

  /**
   * Maps a SupportCaseMessageEntity into a safe response object.
   *
   * The message entity is owned by SupportCaseAggregate and is therefore
   * mapped here rather than through an independent aggregate response mapper.
   */
  public static fromMessageEntity(
    message: SupportCaseMessageEntity,
  ): SupportCaseMessageResponse {
    if (message === undefined || message === null) {
      throw new Error('Support Case Message entity is required.');
    }

    return this.mapMessage(message);
  }

  // ===========================================================================
  // Note Entity -> Response
  // ===========================================================================

  /**
   * Maps a SupportCaseNoteEntity into a safe response object.
   *
   * The note entity is owned by SupportCaseAggregate and is therefore mapped
   * here rather than through an independent aggregate response mapper.
   */
  public static fromNoteEntity(
    note: SupportCaseNoteEntity,
  ): SupportCaseNoteResponse {
    if (note === undefined || note === null) {
      throw new Error('Support Case Note entity is required.');
    }

    return this.mapNote(note);
  }

  // ===========================================================================
  // Evidence Entity -> Response
  // ===========================================================================

  /**
   * Maps a SupportCaseEvidenceEntity into a safe response object.
   *
   * The evidence entity is owned by SupportCaseAggregate and is therefore
   * mapped here rather than through an independent aggregate response mapper.
   */
  public static fromEvidenceEntity(
    evidence: SupportCaseEvidenceEntity,
  ): SupportCaseEvidenceResponse {
    if (evidence === undefined || evidence === null) {
      throw new Error('Support Case Evidence entity is required.');
    }

    return this.mapEvidence(evidence);
  }

  // ===========================================================================
  // Resolution Entity -> Response
  // ===========================================================================

  /**
   * Maps a SupportCaseResolutionEntity into a safe response object.
   *
   * The resolution entity is owned by SupportCaseAggregate and is therefore
   * mapped here rather than through an independent aggregate response mapper.
   */
  public static fromResolutionEntity(
    resolution: SupportCaseResolutionEntity,
  ): SupportCaseResolutionResponse {
    if (resolution === undefined || resolution === null) {
      throw new Error('Support Case Resolution entity is required.');
    }

    return this.mapResolution(resolution);
  }

  // ===========================================================================
  // Aggregate Mapping
  // ===========================================================================

  /**
   * Maps the complete Support Case aggregate.
   *
   * This mapping preserves all aggregate-owned child collection state.
   */
  private static mapAggregate(
    aggregate: SupportCaseAggregate,
  ): SupportCaseResponse {
    const supportCase = aggregate.supportCase;

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: supportCase.publicId.value,

      requesterPublicId: supportCase.requesterPublicId.value,

      // -----------------------------------------------------------------------
      // Case
      // -----------------------------------------------------------------------

      status: supportCase.status.value,

      priority: supportCase.priority.value,

      category: supportCase.category.value,

      subject: supportCase.subject.value,

      description: supportCase.description?.value,

      // -----------------------------------------------------------------------
      // Reference
      // -----------------------------------------------------------------------

      referenceType: supportCase.referenceType?.value,

      referencePublicId: supportCase.referencePublicId?.value,

      // -----------------------------------------------------------------------
      // Assignment
      // -----------------------------------------------------------------------

      assignedToPublicId: supportCase.assignedToPublicId?.value,

      isAssigned: supportCase.isAssigned,

      // -----------------------------------------------------------------------
      // Case Lifecycle
      // -----------------------------------------------------------------------

      openedAt: new Date(supportCase.openedAt.getTime()),

      resolvedAt:
        supportCase.resolvedAt !== undefined
          ? new Date(supportCase.resolvedAt.getTime())
          : undefined,

      closedAt:
        supportCase.closedAt !== undefined
          ? new Date(supportCase.closedAt.getTime())
          : undefined,

      cancelledAt:
        supportCase.cancelledAt !== undefined
          ? new Date(supportCase.cancelledAt.getTime())
          : undefined,

      isResolved: supportCase.isResolved,

      isClosed: supportCase.isClosed,

      isCancelled: supportCase.isCancelled,

      isOpen: supportCase.isOpen,

      version: supportCase.version,

      // -----------------------------------------------------------------------
      // Participants
      // -----------------------------------------------------------------------

      participantCount: aggregate.participants.length,

      hasParticipants: aggregate.participants.length > 0,

      participants: aggregate.participants.map((participant) =>
        this.mapParticipant(participant),
      ),

      // -----------------------------------------------------------------------
      // Messages
      // -----------------------------------------------------------------------

      messageCount: aggregate.messages.length,

      hasMessages: aggregate.messages.length > 0,

      messages: aggregate.messages.map((message) => this.mapMessage(message)),

      // -----------------------------------------------------------------------
      // Notes
      // -----------------------------------------------------------------------

      noteCount: aggregate.notes.length,

      hasNotes: aggregate.notes.length > 0,

      notes: aggregate.notes.map((note) => this.mapNote(note)),

      // -----------------------------------------------------------------------
      // Evidence
      // -----------------------------------------------------------------------

      evidenceCount: aggregate.evidence.length,

      hasEvidence: aggregate.evidence.length > 0,

      evidence: aggregate.evidence.map((evidence) =>
        this.mapEvidence(evidence),
      ),

      // -----------------------------------------------------------------------
      // Resolution
      // -----------------------------------------------------------------------

      hasResolution: aggregate.resolution !== undefined,

      resolution:
        aggregate.resolution !== undefined
          ? this.mapResolution(aggregate.resolution)
          : undefined,
    };
  }

  // ===========================================================================
  // Entity Mapping
  // ===========================================================================

  /**
   * Maps the SupportCaseEntity directly.
   *
   * Because child entities are aggregate-owned, an entity-only response
   * cannot infer their collection state.
   */
  private static mapEntity(
    supportCase: SupportCaseEntity,
  ): SupportCaseResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: supportCase.publicId.value,

      requesterPublicId: supportCase.requesterPublicId.value,

      // -----------------------------------------------------------------------
      // Case
      // -----------------------------------------------------------------------

      status: supportCase.status.value,

      priority: supportCase.priority.value,

      category: supportCase.category.value,

      subject: supportCase.subject.value,

      description: supportCase.description?.value,

      // -----------------------------------------------------------------------
      // Reference
      // -----------------------------------------------------------------------

      referenceType: supportCase.referenceType?.value,

      referencePublicId: supportCase.referencePublicId?.value,

      // -----------------------------------------------------------------------
      // Assignment
      // -----------------------------------------------------------------------

      assignedToPublicId: supportCase.assignedToPublicId?.value,

      isAssigned: supportCase.isAssigned,

      // -----------------------------------------------------------------------
      // Case Lifecycle
      // -----------------------------------------------------------------------

      openedAt: new Date(supportCase.openedAt.getTime()),

      resolvedAt:
        supportCase.resolvedAt !== undefined
          ? new Date(supportCase.resolvedAt.getTime())
          : undefined,

      closedAt:
        supportCase.closedAt !== undefined
          ? new Date(supportCase.closedAt.getTime())
          : undefined,

      cancelledAt:
        supportCase.cancelledAt !== undefined
          ? new Date(supportCase.cancelledAt.getTime())
          : undefined,

      isResolved: supportCase.isResolved,

      isClosed: supportCase.isClosed,

      isCancelled: supportCase.isCancelled,

      isOpen: supportCase.isOpen,

      version: supportCase.version,

      // -----------------------------------------------------------------------
      // Participants
      // -----------------------------------------------------------------------

      participants: [],

      participantCount: 0,

      hasParticipants: false,

      // -----------------------------------------------------------------------
      // Messages
      // -----------------------------------------------------------------------

      messages: [],

      messageCount: 0,

      hasMessages: false,

      // -----------------------------------------------------------------------
      // Notes
      // -----------------------------------------------------------------------

      notes: [],

      noteCount: 0,

      hasNotes: false,

      // -----------------------------------------------------------------------
      // Evidence
      // -----------------------------------------------------------------------

      evidence: [],

      evidenceCount: 0,

      hasEvidence: false,

      // -----------------------------------------------------------------------
      // Resolution
      // -----------------------------------------------------------------------

      hasResolution: false,

      resolution: undefined,
    };
  }

  // ===========================================================================
  // Participant Mapping
  // ===========================================================================

  /**
   * Maps a SupportCaseParticipantEntity into a safe response object.
   *
   * The participant's internal `id` and internal `caseId` are intentionally
   * excluded.
   */
  private static mapParticipant(
    participant: SupportCaseParticipantEntity,
  ): SupportCaseParticipantResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: participant.publicId.value,

      memberPublicId: participant.memberPublicId,

      // -----------------------------------------------------------------------
      // Participation
      // -----------------------------------------------------------------------

      role: participant.role.value,

      joinedAt: new Date(participant.joinedAt.getTime()),

      leftAt:
        participant.leftAt !== undefined
          ? new Date(participant.leftAt.getTime())
          : undefined,

      isActive: participant.isActive,

      hasLeft: participant.hasLeft,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(participant.createdAt.getTime()),

      updatedAt: new Date(participant.updatedAt.getTime()),
    };
  }

  // ===========================================================================
  // Message Mapping
  // ===========================================================================

  /**
   * Maps a SupportCaseMessageEntity into a safe response object.
   *
   * The message's internal `id` and internal `caseId` are intentionally
   * excluded.
   */
  private static mapMessage(
    message: SupportCaseMessageEntity,
  ): SupportCaseMessageResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: message.publicId.value,

      senderPublicId: message.senderPublicId.value,

      // -----------------------------------------------------------------------
      // Message
      // -----------------------------------------------------------------------

      type: message.type.value,

      content: message.content?.value,

      assetId: message.assetId?.value,

      // -----------------------------------------------------------------------
      // Message Lifecycle
      // -----------------------------------------------------------------------

      sentAt: new Date(message.sentAt.getTime()),

      editedAt:
        message.editedAt !== undefined
          ? new Date(message.editedAt.getTime())
          : undefined,

      deletedAt:
        message.deletedAt !== undefined
          ? new Date(message.deletedAt.getTime())
          : undefined,

      isEdited: message.isEdited,

      isDeleted: message.isDeleted,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(message.createdAt.getTime()),

      updatedAt: new Date(message.updatedAt.getTime()),
    };
  }

  // ===========================================================================
  // Note Mapping
  // ===========================================================================

  /**
   * Maps a SupportCaseNoteEntity into a safe response object.
   *
   * The note's internal `id` and internal `caseId` are intentionally excluded.
   */
  private static mapNote(note: SupportCaseNoteEntity): SupportCaseNoteResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: note.publicId.value,

      authorPublicId: note.authorPublicId.value,

      // -----------------------------------------------------------------------
      // Note
      // -----------------------------------------------------------------------

      content: note.content.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(note.createdAt.getTime()),

      updatedAt: new Date(note.updatedAt.getTime()),
    };
  }

  // ===========================================================================
  // Evidence Mapping
  // ===========================================================================

  /**
   * Maps a SupportCaseEvidenceEntity into a safe response object.
   *
   * The evidence's internal `id` and internal `caseId` are intentionally
   * excluded.
   */
  private static mapEvidence(
    evidence: SupportCaseEvidenceEntity,
  ): SupportCaseEvidenceResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: evidence.publicId.value,

      submittedByPublicId: evidence.submittedByPublicId.value,

      // -----------------------------------------------------------------------
      // Evidence
      // -----------------------------------------------------------------------

      assetId: evidence.assetId.value,

      description: evidence.description?.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(evidence.createdAt.getTime()),
    };
  }

  // ===========================================================================
  // Resolution Mapping
  // ===========================================================================

  /**
   * Maps a SupportCaseResolutionEntity into a safe response object.
   *
   * The resolution's internal `id` and internal `caseId` are intentionally
   * excluded.
   */
  private static mapResolution(
    resolution: SupportCaseResolutionEntity,
  ): SupportCaseResolutionResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: resolution.publicId.value,

      // -----------------------------------------------------------------------
      // Resolution
      // -----------------------------------------------------------------------

      type: resolution.type.value,

      summary: resolution.summary.value,

      resolvedByPublicId: resolution.resolvedByPublicId.value,

      // -----------------------------------------------------------------------
      // Resolution Lifecycle
      // -----------------------------------------------------------------------

      resolvedAt: new Date(resolution.resolvedAt.getTime()),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(resolution.createdAt.getTime()),

      updatedAt: new Date(resolution.updatedAt.getTime()),
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SupportCaseResponseMapper;
