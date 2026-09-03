// -----------------------------------------------------------------------------
// Recovery — Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Recovery aggregate.
//
// Aggregate boundary:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// Recovery is an independent aggregate. The repository therefore persists and
// retrieves the RecoveryAggregate as a complete aggregate.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist Recovery aggregates.
// - Remove Recovery aggregates when explicitly required by an application
//   workflow.
// - Retrieve Recovery aggregates by internal identity.
// - Retrieve Recovery aggregates by public identity.
// - Retrieve Recovery aggregates by Identity public reference.
// - Retrieve Recovery aggregates by lifecycle status.
// - Retrieve pending Recovery workflows.
// - Retrieve Recovery aggregates by Recovery type.
// - Retrieve Recovery aggregates using supported composite criteria.
// - Determine aggregate existence.
// - Preserve aggregate identity and lifecycle state.
// - Hide persistence technology from domain and application layers.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - Contain Recovery business rules.
// - Generate recovery tokens.
// - Hash recovery tokens.
// - Compare raw recovery tokens.
// - Execute password resets.
// - Authenticate users.
// - Generate OTPs.
// - Send notifications.
// - Modify Identity.
// - Modify Authentication.
// - Navigate the Identity aggregate.
// - Expose persistence models.
// - Expose database-specific types.
// - Access Prisma from the domain/application contract.
//
// Concrete implementations belong to the infrastructure layer.
//
// Example:
//
// infrastructure/
// └── persistence/
//     └── repositories/
//         └── prisma-recovery.repository.ts
//
// -----------------------------------------------------------------------------
//
// Identity boundary:
//
// Recovery references Identity only through:
//
// - RecoveryIdentityPublicId
//
// The Identity reference is opaque.
//
// The repository MUST NOT:
//
// - load the Identity aggregate;
// - validate Identity state;
// - mutate Identity;
// - expose an Identity persistence relation.
//
// -----------------------------------------------------------------------------
//
// Repository boundary:
//
// Application
//     │
//     ▼
// RecoveryRepository
//     │
//     ▼
// Infrastructure implementation
//     │
//     ▼
// Persistence
//
// -----------------------------------------------------------------------------
//
// Aggregate persistence rule:
//
// The repository contract operates on RecoveryAggregate.
//
// RecoveryEntity persistence methods must not become the primary repository
// contract.
//
// -----------------------------------------------------------------------------
//
// Query semantics:
//
// - findPending() means persisted status = PENDING.
// - Dynamic expiration is a domain concern.
// - A pending Recovery may already be dynamically expired even though its
//   persisted status remains PENDING.
// - Application workflows may load the aggregate and call isExpired() or
//   expire() when appropriate.
//
// Ordering semantics:
//
// Methods returning multiple aggregates should have a deterministic ordering
// defined by the infrastructure implementation. Unless a specialized query
// contract states otherwise, the recommended ordering is newest first by
// requestedAt.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// Recovery token hashes are part of aggregate state and may be persisted by
// the infrastructure implementation.
//
// Raw recovery-token values MUST NOT appear in this repository contract.
//
// -----------------------------------------------------------------------------
//
// -----------------------------------------------------------------------------
//
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { RecoveryAggregate } from '../../domain/aggregates/recovery.aggregate';

// -----------------------------------------------------------------------------
// Domain Identity
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { RecoveryPublicId } from '../../domain/value-objects/recovery-public-id.vo';

import type { RecoveryIdentityPublicId } from '../../domain/value-objects/recovery-identity-public-id.vo';

import type { RecoveryType } from '../../domain/value-objects/recovery-type.vo';

import type { RecoveryStatus } from '../../domain/value-objects/recovery-status.vo';

// =============================================================================
// Repository
// =============================================================================

/**
 * Repository contract for the Recovery aggregate.
 *
 * This interface belongs to the domain/application boundary.
 *
 * Infrastructure implementations are responsible for translating between
 * persistence models and RecoveryAggregate instances.
 */
export interface RecoveryRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists the complete Recovery aggregate.
   *
   * Implementations are responsible for determining whether the aggregate
   * represents an insert or update.
   *
   * The aggregate must be persisted as a consistent aggregate state.
   */
  save(recovery: RecoveryAggregate): Promise<void>;

  /**
   * Removes the Recovery aggregate from persistence.
   *
   * Deletion is intentionally explicit because Recovery lifecycle normally
   * relies on terminal states rather than physical deletion.
   *
   * Application workflows should only invoke deletion where the domain policy
   * explicitly permits it.
   */
  delete(recovery: RecoveryAggregate): Promise<void>;

  // ===========================================================================
  // Retrieval — Internal Identity
  // ===========================================================================
  /**
   * Finds all Recovery aggregates.
   *
   * Results should use the repository's deterministic default ordering,
   * recommended as newest requested Recovery first.
   */
  findAll(): Promise<RecoveryAggregate[]>;
  /**
   * Finds a Recovery aggregate by its internal persistence identity.
   *
   * Returns null when no Recovery exists with the supplied identity.
   */
  findById(id: UniqueEntityId): Promise<RecoveryAggregate | null>;

  /**
   * Determines whether a Recovery aggregate exists with the supplied
   * internal identity.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Retrieval — Public Identity
  // ===========================================================================

  /**
   * Finds a Recovery aggregate by its externally safe public identity.
   *
   * Returns null when no Recovery exists with the supplied public identity.
   */
  findByPublicId(publicId: RecoveryPublicId): Promise<RecoveryAggregate | null>;

  /**
   * Determines whether a Recovery aggregate exists with the supplied public
   * identity.
   */
  existsByPublicId(publicId: RecoveryPublicId): Promise<boolean>;

  // ===========================================================================
  // Retrieval — Identity
  // ===========================================================================

  /**
   * Finds all Recovery aggregates associated with an Identity.
   *
   * The Identity reference is treated as an opaque public identifier.
   */
  findByIdentityPublicId(
    identityPublicId: RecoveryIdentityPublicId,
  ): Promise<RecoveryAggregate[]>;

  /**
   * Finds the most recently requested Recovery associated with an Identity.
   *
   * Returns null when the Identity has no Recovery aggregates.
   */
  findLatestByIdentityPublicId(
    identityPublicId: RecoveryIdentityPublicId,
  ): Promise<RecoveryAggregate | null>;

  /**
   * Determines whether an Identity has at least one Recovery aggregate.
   */
  existsByIdentityPublicId(
    identityPublicId: RecoveryIdentityPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Retrieval — Status
  // ===========================================================================

  /**
   * Finds Recovery aggregates with the supplied persisted lifecycle status.
   */
  findByStatus(status: RecoveryStatus): Promise<RecoveryAggregate[]>;

  /**
   * Finds Recovery aggregates whose persisted lifecycle status is PENDING.
   *
   * Important:
   *
   * PENDING is a persisted lifecycle state. A pending Recovery can still be
   * dynamically expired according to its expiresAt timestamp.
   *
   * Expiration evaluation remains a domain concern.
   */
  findPending(): Promise<RecoveryAggregate[]>;

  /**
   * Determines whether at least one Recovery aggregate exists with the
   * supplied lifecycle status.
   */
  existsByStatus(status: RecoveryStatus): Promise<boolean>;

  // ===========================================================================
  // Retrieval — Type
  // ===========================================================================

  /**
   * Finds Recovery aggregates with the supplied Recovery type.
   */
  findByType(type: RecoveryType): Promise<RecoveryAggregate[]>;

  // ===========================================================================
  // Retrieval — Identity + Type
  // ===========================================================================

  /**
   * Finds Recovery aggregates associated with an Identity and restricted to
   * the supplied Recovery type.
   */
  findByIdentityPublicIdAndType(
    identityPublicId: RecoveryIdentityPublicId,
    type: RecoveryType,
  ): Promise<RecoveryAggregate[]>;

  /**
   * Finds the most recently requested Recovery of the supplied type
   * associated with an Identity.
   *
   * Returns null when no matching Recovery exists.
   */
  findLatestByIdentityPublicIdAndType(
    identityPublicId: RecoveryIdentityPublicId,
    type: RecoveryType,
  ): Promise<RecoveryAggregate | null>;

  // ===========================================================================
  // Retrieval — Identity + Status
  // ===========================================================================

  /**
   * Finds Recovery aggregates associated with an Identity and restricted to
   * the supplied lifecycle status.
   */
  findByIdentityPublicIdAndStatus(
    identityPublicId: RecoveryIdentityPublicId,
    status: RecoveryStatus,
  ): Promise<RecoveryAggregate[]>;

  /**
   * Finds the most recently requested Recovery associated with an Identity
   * and restricted to the supplied lifecycle status.
   *
   * Returns null when no matching Recovery exists.
   */
  findLatestByIdentityPublicIdAndStatus(
    identityPublicId: RecoveryIdentityPublicId,
    status: RecoveryStatus,
  ): Promise<RecoveryAggregate | null>;

  // ===========================================================================
  // Retrieval — Identity + Type + Status
  // ===========================================================================

  /**
   * Finds Recovery aggregates associated with an Identity and restricted by
   * both Recovery type and lifecycle status.
   */
  findByIdentityPublicIdAndTypeAndStatus(
    identityPublicId: RecoveryIdentityPublicId,
    type: RecoveryType,
    status: RecoveryStatus,
  ): Promise<RecoveryAggregate[]>;

  /**
   * Finds the most recently requested Recovery associated with an Identity
   * and restricted by both Recovery type and lifecycle status.
   *
   * Returns null when no matching Recovery exists.
   */
  findLatestByIdentityPublicIdAndTypeAndStatus(
    identityPublicId: RecoveryIdentityPublicId,
    type: RecoveryType,
    status: RecoveryStatus,
  ): Promise<RecoveryAggregate | null>;
}
