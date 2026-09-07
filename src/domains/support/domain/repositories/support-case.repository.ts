// -----------------------------------------------------------------------------
// Support — Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the SupportCase aggregate.
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
// SupportCaseEntity is the aggregate root entity.
//
// All other SupportCase entities are child entities owned by the
// SupportCase aggregate.
//
// -----------------------------------------------------------------------------
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
// The repository persists and rehydrates the COMPLETE aggregate boundary.
//
// Child entities must never be persisted as independent aggregates.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - persist SupportCase aggregates;
// - retrieve SupportCase aggregates;
// - retrieve SupportCase entities;
// - query SupportCase aggregates by public identity;
// - query SupportCase aggregates by internal identity;
// - query SupportCase aggregates by requester;
// - query SupportCase aggregates by status;
// - query SupportCase aggregates by priority;
// - query SupportCase aggregates by category;
// - query SupportCase aggregates by assignee;
// - query SupportCase aggregates by reference;
// - query SupportCase aggregates by participant;
// - retrieve SupportCase root entities through entity queries;
// - support existence checks.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - depend on Prisma;
// - depend on ORM models;
// - expose Prisma-generated types;
// - load Identity aggregates;
// - validate requester Identity existence;
// - validate requester Identity state;
// - load Journey aggregates;
// - load Booking aggregates;
// - load Financial aggregates;
// - load Trust aggregates;
// - load Notification aggregates;
// - perform authorization;
// - determine support policy;
// - determine case priority policy;
// - determine case assignment policy;
// - determine case resolution policy;
// - send support messages;
// - upload assets;
// - validate Asset ownership;
// - validate Asset existence;
// - implement support lifecycle rules;
// - implement participant lifecycle rules;
// - implement message lifecycle rules;
// - implement resolution rules.
//
// Support behavior belongs to:
//
// SupportCaseAggregate
// SupportCaseEntity
// SupportCaseParticipantEntity
// SupportCaseMessageEntity
// SupportCaseNoteEntity
// SupportCaseEvidenceEntity
// SupportCaseResolutionEntity
//
// Cross-domain validation belongs to the appropriate application/domain
// workflow.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// SupportCaseEntity stores:
//
//     requesterPublicId
//     assignedToPublicId
//     referenceType
//     referencePublicId
//
// These are opaque public references to entities in other bounded contexts.
//
// The repository may use them for persistence filtering, but must NEVER
// dereference the referenced aggregates.
//
// There are intentionally no repository-level dependencies on:
//
//     Identity
//     Journey
//     Booking
//     Financial
//     Trust
//     Notification
//
// -----------------------------------------------------------------------------
//
// Internal aggregate relationships:
//
// SupportCaseParticipant
// SupportCaseMessage
// SupportCaseNote
// SupportCaseEvidence
// SupportCaseResolution
//
// all reference the SupportCase persistence identity.
//
// These relationships belong to the Support bounded context and must be
// preserved when saving and rehydrating the aggregate.
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// Aggregate queries return:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// The repository implementation is responsible for reconstructing the
// complete aggregate through:
//
//     SupportCaseAggregate.rehydrate(
//       supportCase,
//       participants,
//       messages,
//       notes,
//       evidence,
//       resolution,
//     )
//
// Rehydration must not emit domain events.
//
// -----------------------------------------------------------------------------
//
// Entity retrieval:
//
// Entity queries return:
//
//     SupportCaseEntity
//
// Entity-only retrieval intentionally does not construct a
// SupportCaseAggregate.
//
// This is useful for workflows that require only the SupportCase root.
//
// When aggregate-level invariants are required, the application layer should
// retrieve the complete aggregate.
//
// -----------------------------------------------------------------------------
//
// Child retrieval:
//
// Participants, messages, notes, evidence, and resolution are part of the
// SupportCase aggregate boundary.
//
// Therefore the primary retrieval mechanism is:
//
//     SupportCaseAggregate
//     ├── SupportCaseEntity
//     ├── SupportCaseParticipantEntity[]
//     ├── SupportCaseMessageEntity[]
//     ├── SupportCaseNoteEntity[]
//     ├── SupportCaseEvidenceEntity[]
//     └── SupportCaseResolutionEntity?
//
// The repository must not expose these child entities as independent
// aggregates.
//
// Child-specific infrastructure queries may be introduced separately only
// when an application use case genuinely requires them.
//
// -----------------------------------------------------------------------------
//
// Query semantics:
//
// Requester:
//
//     requesterPublicId
//
// Assignee:
//
//     assignedToPublicId
//
// Participant:
//
//     memberPublicId
//
// Status:
//
//     SupportCaseStatus
//
// Priority:
//
//     SupportCasePriority
//
// Category:
//
//     SupportCaseCategory
//
// Reference:
//
//     referenceType
//     referencePublicId
//
// These are persistence-oriented filters only.
//
// They do not represent business policy.
//
// -----------------------------------------------------------------------------
//
// Repository design:
//
// The repository exposes persistence-oriented queries.
//
// It does NOT expose policy predicates such as:
//
//     "may open case"
//     "may assign case"
//     "may resolve case"
//     "may close case"
//     "may cancel case"
//     "may participate"
//     "may send message"
//     "may add note"
//     "may submit evidence"
//     "may create resolution"
//     "requester is valid"
//     "support agent is authorized"
//     "asset belongs to member"
//
// Those decisions belong to:
//
//     SupportCaseAggregate
//     domain policy
//     application services
//     authorization boundaries
//     external workflows
//
// -----------------------------------------------------------------------------
//
// Persistence invariants:
//
// The repository implementation must preserve:
//
//     SupportCase.id
//     SupportCase.publicId
//
// and for every child entity:
//
//     SupportCaseParticipant.id
//     SupportCaseParticipant.publicId
//     SupportCaseParticipant.caseId
//
//     SupportCaseMessage.id
//     SupportCaseMessage.publicId
//     SupportCaseMessage.caseId
//
//     SupportCaseNote.id
//     SupportCaseNote.publicId
//     SupportCaseNote.caseId
//
//     SupportCaseEvidence.id
//     SupportCaseEvidence.publicId
//     SupportCaseEvidence.caseId
//
//     SupportCaseResolution.id
//     SupportCaseResolution.publicId
//     SupportCaseResolution.caseId
//
// The persistence model additionally enforces:
//
//     UNIQUE(SupportCase.publicId)
//
//     UNIQUE(SupportCaseParticipant.publicId)
//
//     UNIQUE(SupportCaseParticipant.caseId, memberPublicId, role)
//
//     UNIQUE(SupportCaseMessage.publicId)
//
//     UNIQUE(SupportCaseNote.publicId)
//
//     UNIQUE(SupportCaseEvidence.publicId)
//
//     UNIQUE(SupportCaseResolution.publicId)
//
//     UNIQUE(SupportCaseResolution.caseId)
//
// The aggregate independently enforces its domain invariants before
// persistence.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { SupportCaseAggregate } from '../aggregates/support-case.aggregate';

// -----------------------------------------------------------------------------
// Entity — Support Case
// -----------------------------------------------------------------------------

import type { SupportCaseEntity } from '../entities/support-case.entity';

// -----------------------------------------------------------------------------
// Value Objects — Support Case
// -----------------------------------------------------------------------------

import type { SupportCasePublicId } from '../value-objects/support-case-public-id.vo';

import type { SupportCaseStatus } from '../value-objects/support-case-status.vo';

import type { SupportCasePriority } from '../value-objects/support-case-priority.vo';

import type { SupportCaseCategory } from '../value-objects/support-case-category.vo';

// -----------------------------------------------------------------------------
// Value Objects — Requester
// -----------------------------------------------------------------------------

import type { SupportCaseRequesterPublicId } from '../value-objects/support-case-requester-public-id.vo';

// -----------------------------------------------------------------------------
// Value Objects — Assignee
// -----------------------------------------------------------------------------

import type { SupportCaseAssignedToPublicId } from '../value-objects/support-case-assigned-to-public-id.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

export interface SupportCaseRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a complete SupportCase aggregate.
   *
   * The implementation is responsible for persisting:
   *
   *     SupportCaseEntity
   *
   * together with:
   *
   *     SupportCaseParticipantEntity[]
   *     SupportCaseMessageEntity[]
   *     SupportCaseNoteEntity[]
   *     SupportCaseEvidenceEntity[]
   *     SupportCaseResolutionEntity?
   *
   * as one aggregate persistence operation.
   *
   * The implementation must preserve the aggregate boundary and all internal
   * ownership relationships.
   *
   * Domain behavior remains inside the aggregate and entities.
   */
  save(aggregate: SupportCaseAggregate): Promise<void>;

  /**
   * Physically removes a SupportCase aggregate from persistence.
   *
   * Because SupportCase child records belong to the SupportCase through
   * Prisma cascade relationships, deleting the SupportCase persistence record
   * also removes its persisted participants, messages, notes, evidence, and
   * resolution.
   *
   * This is a persistence operation only.
   *
   * It must not be interpreted as:
   *
   *     cancel()
   *     close()
   *     resolve()
   *
   * or any other SupportCase lifecycle operation.
   */
  delete(aggregate: SupportCaseAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries — Public Identity
  // ===========================================================================

  /**
   * Finds a complete SupportCase aggregate by public identity.
   *
   * The returned aggregate contains:
   *
   *     SupportCaseEntity
   *     SupportCaseParticipantEntity[]
   *     SupportCaseMessageEntity[]
   *     SupportCaseNoteEntity[]
   *     SupportCaseEvidenceEntity[]
   *     SupportCaseResolutionEntity?
   *
   * or null when no matching SupportCase exists.
   */
  findByPublicId(
    publicId: SupportCasePublicId,
  ): Promise<SupportCaseAggregate | null>;

  /**
   * Finds a complete SupportCase aggregate by internal identity.
   *
   * The returned aggregate contains the SupportCase root and every persisted
   * child entity belonging to that aggregate.
   */
  findById(id: UniqueEntityId): Promise<SupportCaseAggregate | null>;

  // ===========================================================================
  // Aggregate Queries — Requester
  // ===========================================================================

  /**
   * Finds SupportCase aggregates belonging to the supplied requester.
   *
   * requesterPublicId is an opaque reference to an Identity public identity.
   *
   * The repository performs persistence filtering only.
   *
   * It does not load, validate, or dereference Identity.
   */
  findByRequesterPublicId(
    requesterPublicId: SupportCaseRequesterPublicId,
  ): Promise<SupportCaseAggregate[]>;

  /**
   * Finds SupportCase aggregates belonging to the supplied requester and
   * having the supplied SupportCase status.
   */
  findByRequesterPublicIdAndStatus(
    requesterPublicId: SupportCaseRequesterPublicId,
    status: SupportCaseStatus,
  ): Promise<SupportCaseAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Status
  // ===========================================================================

  /**
   * Finds all SupportCase aggregates with the supplied status.
   */
  findByStatus(status: SupportCaseStatus): Promise<SupportCaseAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Priority
  // ===========================================================================

  /**
   * Finds all SupportCase aggregates with the supplied priority.
   */
  findByPriority(
    priority: SupportCasePriority,
  ): Promise<SupportCaseAggregate[]>;

  /**
   * Finds SupportCase aggregates with the supplied status and priority.
   *
   * This is a persistence-oriented compound filter.
   */
  findByStatusAndPriority(
    status: SupportCaseStatus,
    priority: SupportCasePriority,
  ): Promise<SupportCaseAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Category
  // ===========================================================================

  /**
   * Finds all SupportCase aggregates with the supplied category.
   */
  findByCategory(
    category: SupportCaseCategory,
  ): Promise<SupportCaseAggregate[]>;

  /**
   * Finds SupportCase aggregates with the supplied status and category.
   *
   * This is a persistence-oriented compound filter.
   */
  findByStatusAndCategory(
    status: SupportCaseStatus,
    category: SupportCaseCategory,
  ): Promise<SupportCaseAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Assignee
  // ===========================================================================

  /**
   * Finds SupportCase aggregates assigned to the supplied support agent.
   *
   * assignedToPublicId is an opaque Identity-domain public reference.
   *
   * The repository does not validate or dereference the referenced Identity.
   */
  findByAssignedToPublicId(
    assignedToPublicId: SupportCaseAssignedToPublicId,
  ): Promise<SupportCaseAggregate[]>;

  /**
   * Finds SupportCase aggregates assigned to the supplied support agent and
   * having the supplied SupportCase status.
   */
  findByAssignedToPublicIdAndStatus(
    assignedToPublicId: SupportCaseAssignedToPublicId,
    status: SupportCaseStatus,
  ): Promise<SupportCaseAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Reference
  // ===========================================================================

  /**
   * Finds SupportCase aggregates referencing the supplied resource.
   *
   * referenceType identifies the referenced resource type.
   *
   * referencePublicId identifies the referenced resource public identity.
   *
   * These are opaque cross-domain references.
   *
   * The repository does not:
   *
   * - load the referenced aggregate;
   * - validate the referenced resource;
   * - dereference the referenced resource;
   * - apply support policy.
   */
  findByReferenceTypeAndReferencePublicId(
    referenceType: string,
    referencePublicId: string,
  ): Promise<SupportCaseAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Participant
  // ===========================================================================

  /**
   * Finds SupportCase aggregates containing the supplied member as a
   * participant.
   *
   * memberPublicId is an opaque Identity-domain public reference.
   *
   * The repository does not validate or dereference Identity.
   */
  findByParticipantPublicId(
    memberPublicId: string,
  ): Promise<SupportCaseAggregate[]>;

  /**
   * Finds SupportCase aggregates containing the supplied member as a
   * participant and having the supplied SupportCase status.
   */
  findByParticipantPublicIdAndStatus(
    memberPublicId: string,
    status: SupportCaseStatus,
  ): Promise<SupportCaseAggregate[]>;

  // ===========================================================================
  // Aggregate Retrieval
  // ===========================================================================

  /**
   * Finds all SupportCase aggregates.
   *
   * Every persisted SupportCase is reconstructed together with:
   *
   *     SupportCaseParticipantEntity[]
   *     SupportCaseMessageEntity[]
   *     SupportCaseNoteEntity[]
   *     SupportCaseEvidenceEntity[]
   *     SupportCaseResolutionEntity?
   *
   * through:
   *
   *     SupportCaseAggregate.rehydrate(
   *       supportCase,
   *       participants,
   *       messages,
   *       notes,
   *       evidence,
   *       resolution,
   *     )
   *
   * Rehydration must not emit domain events.
   */
  findAll(): Promise<SupportCaseAggregate[]>;

  // ===========================================================================
  // Entity Queries — Public Identity
  // ===========================================================================

  /**
   * Finds the SupportCase aggregate root entity by public identity.
   *
   * This query does not construct a SupportCaseAggregate.
   *
   * Child entities are not returned.
   */
  findEntityByPublicId(
    publicId: SupportCasePublicId,
  ): Promise<SupportCaseEntity | null>;

  /**
   * Finds the SupportCase aggregate root entity by internal identity.
   *
   * This query does not construct a SupportCaseAggregate.
   *
   * Child entities are not returned.
   */
  findEntityById(id: UniqueEntityId): Promise<SupportCaseEntity | null>;

  // ===========================================================================
  // Entity Queries — Requester
  // ===========================================================================

  /**
   * Finds SupportCase root entities belonging to the supplied requester.
   *
   * requesterPublicId is an opaque Identity-domain reference.
   *
   * The repository does not load or validate Identity.
   */
  findEntitiesByRequesterPublicId(
    requesterPublicId: SupportCaseRequesterPublicId,
  ): Promise<SupportCaseEntity[]>;

  /**
   * Finds SupportCase root entities belonging to the supplied requester and
   * having the supplied SupportCase status.
   */
  findEntitiesByRequesterPublicIdAndStatus(
    requesterPublicId: SupportCaseRequesterPublicId,
    status: SupportCaseStatus,
  ): Promise<SupportCaseEntity[]>;

  // ===========================================================================
  // Entity Queries — Status
  // ===========================================================================

  /**
   * Finds SupportCase root entities with the supplied status.
   *
   * Child entities are not loaded.
   */
  findEntitiesByStatus(status: SupportCaseStatus): Promise<SupportCaseEntity[]>;

  // ===========================================================================
  // Entity Queries — Priority
  // ===========================================================================

  /**
   * Finds SupportCase root entities with the supplied priority.
   *
   * Child entities are not loaded.
   */
  findEntitiesByPriority(
    priority: SupportCasePriority,
  ): Promise<SupportCaseEntity[]>;

  /**
   * Finds SupportCase root entities with the supplied status and priority.
   *
   * Child entities are not loaded.
   */
  findEntitiesByStatusAndPriority(
    status: SupportCaseStatus,
    priority: SupportCasePriority,
  ): Promise<SupportCaseEntity[]>;

  // ===========================================================================
  // Entity Queries — Category
  // ===========================================================================

  /**
   * Finds SupportCase root entities with the supplied category.
   *
   * Child entities are not loaded.
   */
  findEntitiesByCategory(
    category: SupportCaseCategory,
  ): Promise<SupportCaseEntity[]>;

  /**
   * Finds SupportCase root entities with the supplied status and category.
   *
   * Child entities are not loaded.
   */
  findEntitiesByStatusAndCategory(
    status: SupportCaseStatus,
    category: SupportCaseCategory,
  ): Promise<SupportCaseEntity[]>;

  // ===========================================================================
  // Entity Queries — Assignee
  // ===========================================================================

  /**
   * Finds SupportCase root entities assigned to the supplied support agent.
   *
   * assignedToPublicId is an opaque Identity-domain reference.
   *
   * Child entities are not loaded.
   */
  findEntitiesByAssignedToPublicId(
    assignedToPublicId: SupportCaseAssignedToPublicId,
  ): Promise<SupportCaseEntity[]>;

  /**
   * Finds SupportCase root entities assigned to the supplied support agent and
   * having the supplied SupportCase status.
   *
   * Child entities are not loaded.
   */
  findEntitiesByAssignedToPublicIdAndStatus(
    assignedToPublicId: SupportCaseAssignedToPublicId,
    status: SupportCaseStatus,
  ): Promise<SupportCaseEntity[]>;

  // ===========================================================================
  // Entity Retrieval
  // ===========================================================================

  /**
   * Finds all SupportCase root entities.
   *
   * This method does not construct SupportCase aggregates.
   *
   * Participants, messages, notes, evidence, and resolution are not included.
   */
  findAllEntities(): Promise<SupportCaseEntity[]>;

  // ===========================================================================
  // Existence — Public Identity
  // ===========================================================================

  /**
   * Determines whether a SupportCase exists by public identity.
   *
   * The aggregate is not loaded.
   */
  existsByPublicId(publicId: SupportCasePublicId): Promise<boolean>;

  /**
   * Determines whether a SupportCase exists by internal identity.
   *
   * The aggregate is not loaded.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Existence — Requester
  // ===========================================================================

  /**
   * Determines whether at least one SupportCase exists for the supplied
   * requester.
   *
   * The repository performs a persistence existence check only.
   *
   * It does not verify that the requester exists in Identity.
   */
  existsByRequesterPublicId(
    requesterPublicId: SupportCaseRequesterPublicId,
  ): Promise<boolean>;

  /**
   * Determines whether at least one SupportCase exists for the supplied
   * requester and status.
   */
  existsByRequesterPublicIdAndStatus(
    requesterPublicId: SupportCaseRequesterPublicId,
    status: SupportCaseStatus,
  ): Promise<boolean>;

  // ===========================================================================
  // Existence — Status
  // ===========================================================================

  /**
   * Determines whether at least one SupportCase exists with the supplied
   * status.
   */
  existsByStatus(status: SupportCaseStatus): Promise<boolean>;

  // ===========================================================================
  // Existence — Assignee
  // ===========================================================================

  /**
   * Determines whether at least one SupportCase is assigned to the supplied
   * support agent.
   */
  existsByAssignedToPublicId(
    assignedToPublicId: SupportCaseAssignedToPublicId,
  ): Promise<boolean>;

  /**
   * Determines whether at least one SupportCase is assigned to the supplied
   * support agent and has the supplied status.
   */
  existsByAssignedToPublicIdAndStatus(
    assignedToPublicId: SupportCaseAssignedToPublicId,
    status: SupportCaseStatus,
  ): Promise<boolean>;

  // ===========================================================================
  // Existence — Participant
  // ===========================================================================

  /**
   * Determines whether at least one SupportCase contains the supplied member
   * as a participant.
   *
   * This is a persistence existence check only.
   */
  existsByParticipantPublicId(memberPublicId: string): Promise<boolean>;

  /**
   * Determines whether at least one SupportCase contains the supplied member
   * as a participant and has the supplied status.
   */
  existsByParticipantPublicIdAndStatus(
    memberPublicId: string,
    status: SupportCaseStatus,
  ): Promise<boolean>;

  // ===========================================================================
  // Existence — Reference
  // ===========================================================================

  /**
   * Determines whether at least one SupportCase references the supplied
   * resource.
   *
   * referenceType and referencePublicId are opaque cross-domain references.
   */
  existsByReferenceTypeAndReferencePublicId(
    referenceType: string,
    referencePublicId: string,
  ): Promise<boolean>;
}
