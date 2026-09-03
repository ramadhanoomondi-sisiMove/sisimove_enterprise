// -----------------------------------------------------------------------------
// Session — Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Session aggregate.
//
// Aggregate ownership:
//
// SessionAggregate
// └── SessionEntity
//
// Session is an independent aggregate responsible for the lifecycle and
// security state of one authenticated Session.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist Session aggregates.
// - Retrieve Session aggregates.
// - Support Session public-identity lookup.
// - Support Identity public-reference lookup.
// - Support Device public-reference lookup.
// - Support token-family lookup.
// - Support Session status queries.
// - Support active/usability queries.
// - Support expiry queries.
// - Support revocation queries.
// - Support refresh-token-hash lookup.
// - Support token-rotation lineage queries.
// - Support Session context queries.
// - Support audit queries.
// - Support existence checks.
// - Support entity-level persistence lookups.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - Depend on Prisma.
// - Depend on ORM models.
// - Generate raw refresh tokens.
// - Hash refresh tokens.
// - Compare plaintext refresh tokens.
// - Sign JWTs.
// - Verify JWTs.
// - Validate Identity domain state.
// - Validate Device aggregate state.
// - Revoke other Sessions directly.
// - Revoke an entire token family directly.
// - Decide token-reuse security policy.
// - Generate token families.
// - Perform authorization checks.
// - Send notifications.
// - Communicate with external systems.
//
// Token generation, hashing, comparison, JWT handling, and security policy
// belong to the appropriate application/infrastructure security boundaries.
//
// Cross-aggregate orchestration belongs to the application layer.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundaries:
//
// SessionAggregate
// └── SessionEntity
//
// Cross-aggregate references:
//
// - SessionIdentityPublicId
// - SessionDevicePublicId
// - SessionTokenFamilyPublicId
// - SessionReplacedByPublicId
//
// These references are opaque. The Session repository may query by them but
// must never load or validate the referenced Identity or Device aggregate.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// The persisted refresh-token hash may be queried by the trusted application
// security workflow.
//
// Raw refresh-token material must never enter this repository contract.
//
// The repository does not compare a raw token against a persisted hash.
// Hash comparison belongs to the security infrastructure boundary.
//
// -----------------------------------------------------------------------------
//
// Token rotation:
//
// Session replacement is represented by:
//
//     replacedBySessionPublicId
//
// The replacement Session is a separate aggregate.
//
// The repository may identify Sessions by token family or replacement
// relationship, but it must not orchestrate rotation across aggregates.
//
// -----------------------------------------------------------------------------
//
// Persistence uniqueness:
//
// The persistence model should normally enforce:
//
//     UNIQUE(publicId)
//
// Where applicable, additional persistence constraints should protect the
// intended Session invariants.
//
// -----------------------------------------------------------------------------
//
// Domain events:
//
// Domain-event recording and publication are not repository responsibilities.
//
// The application/infrastructure event boundary is responsible for dispatching
// events after successful persistence according to the transaction strategy.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { SessionAggregate } from '../aggregates/session.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { SessionEntity } from '../entities/session.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SessionPublicId } from '../value-objects/session-public-id.vo';

import type { SessionIdentityPublicId } from '../value-objects/session-identity-public-id.vo';

import type { SessionDevicePublicId } from '../value-objects/session-device-public-id.vo';

import type { SessionStatus } from '../value-objects/session-status.vo';

import type { SessionRefreshTokenHash } from '../value-objects/session-refresh-token-hash.vo';

import type { SessionTokenFamilyPublicId } from '../value-objects/session-token-family-public-id.vo';

import type { SessionReplacedByPublicId } from '../value-objects/session-replaced-by-public-id.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

export interface SessionRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Session aggregate.
   */
  save(aggregate: SessionAggregate): Promise<void>;

  /**
   * Removes a Session aggregate.
   */
  delete(aggregate: SessionAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds a Session aggregate by its public identifier.
   */
  findByPublicId(publicId: SessionPublicId): Promise<SessionAggregate | null>;

  /**
   * Finds a Session aggregate by its internal identifier.
   */
  findById(id: UniqueEntityId): Promise<SessionAggregate | null>;

  /**
   * Finds all Session aggregates belonging to an Identity.
   *
   * This query does not impose an active/usable lifecycle condition.
   */
  findByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionAggregate[]>;

  /**
   * Finds all Session aggregates associated with a Device.
   */
  findByDevicePublicId(
    devicePublicId: SessionDevicePublicId,
  ): Promise<SessionAggregate[]>;

  /**
   * Finds a Session aggregate by its Identity and Session public identifier.
   */
  findByPublicIdAndIdentityPublicId(
    publicId: SessionPublicId,
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionAggregate | null>;

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds a Session entity by its public identifier.
   */
  findEntityByPublicId(
    publicId: SessionPublicId,
  ): Promise<SessionEntity | null>;

  /**
   * Finds a Session entity by its internal identifier.
   */
  findEntityById(id: UniqueEntityId): Promise<SessionEntity | null>;

  /**
   * Finds a Session entity by its Identity public identifier.
   */
  findEntityByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionEntity | null>;

  /**
   * Finds a Session entity by its public identifier and owning Identity.
   */
  findEntityByPublicIdAndIdentityPublicId(
    publicId: SessionPublicId,
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionEntity | null>;

  // ===========================================================================
  // Status Queries
  // ===========================================================================

  /**
   * Finds all Session aggregates with the supplied lifecycle status.
   */
  findByStatus(status: SessionStatus): Promise<SessionAggregate[]>;

  /**
   * Finds all active Sessions.
   *
   * Active status is determined by the persisted Session lifecycle state.
   */
  findActive(): Promise<SessionAggregate[]>;

  /**
   * Finds all active Sessions belonging to an Identity.
   *
   * This is the repository operation for the Identity-scoped
   * GetActiveSessions query.
   *
   * Active status is determined by the persisted Session lifecycle state.
   *
   * The repository does not perform authorization or validate the Identity
   * aggregate. The Identity public identifier is treated as an opaque
   * cross-aggregate reference.
   */
  findActiveByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionAggregate[]>;

  /**
   * Finds all expired Sessions by persisted lifecycle status.
   */
  findExpired(): Promise<SessionAggregate[]>;

  /**
   * Finds all revoked Sessions.
   */
  findRevoked(): Promise<SessionAggregate[]>;

  /**
   * Finds all Sessions that are not active.
   */
  findInactive(): Promise<SessionAggregate[]>;

  // ===========================================================================
  // Usability Queries
  // ===========================================================================

  /**
   * Finds Sessions that are currently eligible for use according to
   * persisted Session state and expiry timestamp.
   *
   * Implementations should account for:
   *
   * - ACTIVE status;
   * - expiry timestamp;
   * - revoked state.
   *
   * The repository does not perform authentication or authorization.
   */
  findUsable(referenceDate?: Date): Promise<SessionAggregate[]>;

  /**
   * Finds an active and currently usable Session belonging to an Identity.
   */
  findUsableByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
    referenceDate?: Date,
  ): Promise<SessionAggregate | null>;

  /**
   * Finds a currently usable Session by its public identifier.
   */
  findUsableByPublicId(
    publicId: SessionPublicId,
    referenceDate?: Date,
  ): Promise<SessionAggregate | null>;

  // ===========================================================================
  // Expiry Queries
  // ===========================================================================

  /**
   * Finds Sessions whose expiry timestamp has passed.
   */
  findExpiredByDate(referenceDate?: Date): Promise<SessionAggregate[]>;

  /**
   * Finds active Sessions whose expiry timestamp has passed.
   */
  findActiveExpired(referenceDate?: Date): Promise<SessionAggregate[]>;

  /**
   * Finds Sessions that will expire before the supplied timestamp.
   */
  findExpiringBefore(expiresBefore: Date): Promise<SessionAggregate[]>;

  // ===========================================================================
  // Revocation Queries
  // ===========================================================================

  /**
   * Finds all revoked Sessions belonging to an Identity.
   */
  findRevokedByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionAggregate[]>;

  /**
   * Finds all non-revoked Sessions belonging to an Identity.
   */
  findNonRevokedByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionAggregate[]>;

  /**
   * Finds all Sessions belonging to an Identity that are currently usable.
   */
  findUsableByIdentity(
    identityPublicId: SessionIdentityPublicId,
    referenceDate?: Date,
  ): Promise<SessionAggregate[]>;

  // ===========================================================================
  // Refresh Token
  // ===========================================================================

  /**
   * Finds a Session by its persisted refresh-token hash.
   */
  findByRefreshTokenHash(
    refreshTokenHash: SessionRefreshTokenHash,
  ): Promise<SessionAggregate | null>;

  /**
   * Finds a Session by refresh-token hash only when currently active and usable.
   */
  findUsableByRefreshTokenHash(
    refreshTokenHash: SessionRefreshTokenHash,
    referenceDate?: Date,
  ): Promise<SessionAggregate | null>;

  /**
   * Finds all Sessions using the supplied refresh-token hash.
   */
  findAllByRefreshTokenHash(
    refreshTokenHash: SessionRefreshTokenHash,
  ): Promise<SessionAggregate[]>;

  // ===========================================================================
  // Token Family
  // ===========================================================================

  /**
   * Finds all Sessions belonging to a refresh-token family.
   */
  findByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<SessionAggregate[]>;

  /**
   * Finds all active Sessions belonging to a refresh-token family.
   */
  findActiveByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<SessionAggregate[]>;

  /**
   * Finds all revoked Sessions belonging to a refresh-token family.
   */
  findRevokedByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<SessionAggregate[]>;

  /**
   * Finds all Sessions in a token family that have not been revoked.
   */
  findNonRevokedByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<SessionAggregate[]>;

  // ===========================================================================
  // Token Rotation Lineage
  // ===========================================================================

  /**
   * Finds the Session that was replaced by the supplied Session public
   * identifier.
   */
  findByReplacedBySessionPublicId(
    replacedBySessionPublicId: SessionReplacedByPublicId,
  ): Promise<SessionAggregate | null>;

  /**
   * Finds all Sessions that have been replaced.
   */
  findReplaced(): Promise<SessionAggregate[]>;

  /**
   * Finds all Sessions that have not been replaced.
   */
  findNotReplaced(): Promise<SessionAggregate[]>;

  /**
   * Finds all replaced Sessions belonging to a token family.
   */
  findReplacedByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<SessionAggregate[]>;

  // ===========================================================================
  // Device Queries
  // ===========================================================================

  /**
   * Finds all active Sessions associated with a Device.
   */
  findActiveByDevicePublicId(
    devicePublicId: SessionDevicePublicId,
  ): Promise<SessionAggregate[]>;

  /**
   * Finds all currently usable Sessions associated with a Device.
   */
  findUsableByDevicePublicId(
    devicePublicId: SessionDevicePublicId,
    referenceDate?: Date,
  ): Promise<SessionAggregate[]>;

  /**
   * Finds Sessions that do not have an associated Device.
   */
  findWithoutDevice(): Promise<SessionAggregate[]>;

  /**
   * Finds Sessions that have an associated Device.
   */
  findWithDevice(): Promise<SessionAggregate[]>;

  // ===========================================================================
  // Audit Queries
  // ===========================================================================

  /**
   * Finds all Sessions created after the supplied timestamp.
   */
  findCreatedAfter(createdAfter: Date): Promise<SessionAggregate[]>;

  /**
   * Finds all Sessions created before the supplied timestamp.
   */
  findCreatedBefore(createdBefore: Date): Promise<SessionAggregate[]>;

  /**
   * Finds all Sessions updated after the supplied timestamp.
   */
  findUpdatedAfter(updatedAfter: Date): Promise<SessionAggregate[]>;

  /**
   * Finds all Sessions updated before the supplied timestamp.
   */
  findUpdatedBefore(updatedBefore: Date): Promise<SessionAggregate[]>;

  /**
   * Finds all Sessions belonging to an Identity ordered by last activity.
   */
  findByIdentityPublicIdOrderedByLastActivity(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionAggregate[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true if a Session exists with the supplied public identifier.
   */
  existsByPublicId(publicId: SessionPublicId): Promise<boolean>;

  /**
   * Returns true if a Session exists with the supplied internal identifier.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if at least one Session exists for the supplied Identity.
   */
  existsByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if a Session exists with the supplied public identifier
   * and belongs to the supplied Identity.
   */
  existsByPublicIdAndIdentityPublicId(
    publicId: SessionPublicId,
    identityPublicId: SessionIdentityPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one Session exists for the supplied Device.
   */
  existsByDevicePublicId(
    devicePublicId: SessionDevicePublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one Session exists in the supplied token family.
   */
  existsByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if a Session exists with the supplied refresh-token hash.
   */
  existsByRefreshTokenHash(
    refreshTokenHash: SessionRefreshTokenHash,
  ): Promise<boolean>;

  /**
   * Returns true if at least one Session exists with the supplied status.
   */
  existsByStatus(status: SessionStatus): Promise<boolean>;

  /**
   * Returns true if at least one active Session exists.
   */
  existsActive(): Promise<boolean>;

  /**
   * Returns true if at least one revoked Session exists.
   */
  existsRevoked(): Promise<boolean>;

  /**
   * Returns true if at least one expired Session exists.
   */
  existsExpired(): Promise<boolean>;

  /**
   * Returns true if at least one Session currently requires expiry
   * reconciliation.
   */
  existsExpiredByDate(referenceDate?: Date): Promise<boolean>;

  /**
   * Returns true if at least one Session has been replaced.
   */
  existsReplaced(): Promise<boolean>;

  /**
   * Returns true if at least one active Session exists in the supplied
   * token family.
   */
  existsActiveByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one usable Session exists for the supplied
   * Identity.
   */
  existsUsableByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
    referenceDate?: Date,
  ): Promise<boolean>;
}
