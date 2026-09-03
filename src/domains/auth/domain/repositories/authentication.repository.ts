// -----------------------------------------------------------------------------
// Identity — Authentication Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Authentication aggregate.
//
// Aggregate ownership:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Authentication is an independent aggregate responsible for:
//
// - authentication identity;
// - opaque Identity public reference;
// - authentication lifecycle state;
// - password credential state;
// - password version;
// - password-change requirement;
// - authentication failure tracking;
// - authentication lock state;
// - authentication audit state.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist Authentication aggregates.
// - Retrieve Authentication aggregates.
// - Retrieve Authentication entities when required by infrastructure.
// - Support Authentication public-identity lookup.
// - Support Identity public-reference lookup.
// - Support lifecycle-status queries.
// - Support lock-state queries.
// - Support password-state queries.
// - Support password-version queries.
// - Support authentication-failure queries.
// - Support authentication-audit queries.
// - Support existence checks.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - Depend on Prisma.
// - Depend on ORM models.
// - Validate Identity domain state.
// - Load Identity aggregates.
// - Hash passwords.
// - Compare plaintext passwords.
// - Generate sessions.
// - Manage Session persistence.
// - Manage Device persistence.
// - Execute account recovery.
// - Generate OTP challenges.
// - Manage OTP persistence.
// - Perform authorization checks.
// - Decide authentication lock thresholds.
// - Decide authentication policy.
// - Send notifications.
// - Communicate with external systems.
//
// Session, Device, Recovery, and OtpChallenge are separate aggregate or
// relationship boundaries.
//
// Cross-aggregate coordination belongs to the appropriate application or
// domain service boundary.
//
// -----------------------------------------------------------------------------
//
// Identity reference:
//
// Authentication stores an opaque reference to the Identity aggregate:
//
//     AuthenticationIdentityPublicId
//
// The repository may use this reference for lookup, but must not validate,
// dereference, or load the Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// The persistence model should enforce uniqueness of:
//
//     UNIQUE(publicId)
//     UNIQUE(identityPublicId)
//
// The database remains the final persistence-level uniqueness guarantee.
//
// -----------------------------------------------------------------------------
//
// Repository design:
//
// The repository exposes persistence-oriented queries.
//
// It does NOT expose domain-policy predicates such as:
//
//     "may authenticate"
//     "should be locked"
//     "has exceeded the lock threshold"
//
// Those decisions belong to the Authentication aggregate, authentication
// policy, domain services, or application workflows as appropriate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { AuthenticationAggregate } from '../aggregates/authentication.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { AuthenticationEntity } from '../entities/authentication.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AuthenticationPublicId } from '../value-objects/authentication-public-id.vo';

import type { AuthenticationIdentityPublicId } from '../value-objects/authentication-identity-public-id.vo';

import type { AuthenticationStatus } from '../value-objects/authentication-status.vo';

import type { AuthenticationPasswordVersion } from '../value-objects/authentication-password-version.vo';

import type { AuthenticationFailureCount } from '../value-objects/authentication-failure-count.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

export interface AuthenticationRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists an Authentication aggregate.
   *
   * The repository implementation is responsible for translating the
   * aggregate into its persistence representation.
   *
   * Domain behavior remains inside the aggregate and entity.
   */
  save(aggregate: AuthenticationAggregate): Promise<void>;

  /**
   * Removes an Authentication aggregate.
   *
   * Deletion eligibility is determined by application/domain policy.
   * The repository only performs the persistence operation.
   */
  delete(aggregate: AuthenticationAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds an Authentication aggregate by its public identifier.
   *
   * AuthenticationPublicId is the public identity of the Authentication
   * aggregate.
   */
  findByPublicId(
    publicId: AuthenticationPublicId,
  ): Promise<AuthenticationAggregate | null>;

  /**
   * Finds the Authentication aggregate belonging to the supplied Identity.
   *
   * AuthenticationIdentityPublicId is treated as an opaque cross-aggregate
   * reference.
   *
   * The repository does not load or validate the Identity aggregate.
   */
  findByIdentityPublicId(
    identityPublicId: AuthenticationIdentityPublicId,
  ): Promise<AuthenticationAggregate | null>;

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds an Authentication entity by its public identifier.
   *
   * Returns the aggregate-root entity without wrapping it in an aggregate.
   */
  findEntityByPublicId(
    publicId: AuthenticationPublicId,
  ): Promise<AuthenticationEntity | null>;

  /**
   * Finds an Authentication entity by its internal identifier.
   *
   * Intended primarily for persistence-oriented infrastructure operations.
   */
  findEntityById(id: UniqueEntityId): Promise<AuthenticationEntity | null>;

  /**
   * Finds an Authentication entity by its owning Identity public identifier.
   *
   * The Identity reference remains opaque to the Authentication repository.
   */
  findEntityByIdentityPublicId(
    identityPublicId: AuthenticationIdentityPublicId,
  ): Promise<AuthenticationEntity | null>;

  // ===========================================================================
  // Status Queries
  // ===========================================================================

  /**
   * Finds all Authentication aggregates with the supplied lifecycle status.
   */
  findByStatus(
    status: AuthenticationStatus,
  ): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all pending Authentication aggregates.
   */
  findPending(): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all active Authentication aggregates.
   */
  findActive(): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all locked Authentication aggregates.
   */
  findLocked(): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all disabled Authentication aggregates.
   */
  findDisabled(): Promise<AuthenticationAggregate[]>;

  // ===========================================================================
  // Lock Queries
  // ===========================================================================

  /**
   * Finds all Authentication aggregates that are currently locked.
   *
   * Implementations should evaluate temporary-lock expiration against the
   * supplied reference time.
   *
   * Permanent locks remain locked until explicitly transitioned.
   */
  findCurrentlyLocked(referenceDate?: Date): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all Authentication aggregates whose temporary lock has expired.
   *
   * The repository only identifies expired-lock candidates.
   *
   * Unlock policy and the resulting state transition belong to the
   * application/domain workflow.
   */
  findWithExpiredLocks(
    referenceDate?: Date,
  ): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all Authentication aggregates with permanent locks.
   *
   * A permanent lock is represented by LOCKED status without a locked-until
   * timestamp.
   */
  findPermanentlyLocked(): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all Authentication aggregates with temporary locks.
   *
   * A temporary lock is represented by LOCKED status with a locked-until
   * timestamp.
   */
  findTemporarilyLocked(): Promise<AuthenticationAggregate[]>;

  // ===========================================================================
  // Password Queries
  // ===========================================================================

  /**
   * Finds all Authentication aggregates that have an established password.
   */
  findWithPassword(): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all Authentication aggregates that do not have an established
   * password.
   */
  findWithoutPassword(): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all Authentication aggregates requiring a password change.
   */
  findRequiringPasswordChange(): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all Authentication aggregates that do not require a password
   * change.
   */
  findNotRequiringPasswordChange(): Promise<AuthenticationAggregate[]>;

  // ===========================================================================
  // Password Version Queries
  // ===========================================================================

  /**
   * Finds all Authentication aggregates using the supplied password version.
   */
  findByPasswordVersion(
    passwordVersion: AuthenticationPasswordVersion,
  ): Promise<AuthenticationAggregate[]>;

  // ===========================================================================
  // Authentication Failure Queries
  // ===========================================================================

  /**
   * Finds all Authentication aggregates that have recorded one or more
   * authentication failures.
   */
  findWithAuthenticationFailures(): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all Authentication aggregates with no recorded authentication
   * failures.
   */
  findWithoutAuthenticationFailures(): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all Authentication aggregates whose failure count is greater than
   * or equal to the supplied count.
   *
   * The repository performs the persistence query only.
   *
   * Interpretation of the count as a security threshold belongs to the
   * authentication policy/application layer.
   */
  findWithFailureCountAtLeast(
    count: AuthenticationFailureCount,
  ): Promise<AuthenticationAggregate[]>;

  /**
   * Finds all Authentication aggregates whose failure count is below the
   * supplied count.
   */
  findWithFailureCountBelow(
    count: AuthenticationFailureCount,
  ): Promise<AuthenticationAggregate[]>;

  // ===========================================================================
  // Authentication Audit Queries
  // ===========================================================================

  /**
   * Finds Authentication aggregates that have successfully authenticated
   * before the supplied date.
   *
   * The date represents a persistence query boundary only.
   */
  findAuthenticatedBefore(date: Date): Promise<AuthenticationAggregate[]>;

  /**
   * Finds Authentication aggregates that have never successfully
   * authenticated.
   *
   * This corresponds to Authentication.lastAuthenticatedAt being absent.
   */
  findNeverAuthenticated(): Promise<AuthenticationAggregate[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true if an Authentication exists for the supplied public
   * identifier.
   */
  existsByPublicId(publicId: AuthenticationPublicId): Promise<boolean>;

  /**
   * Returns true if an Authentication exists for the supplied internal
   * identifier.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if an Authentication exists for the supplied Identity
   * public identifier.
   *
   * This corresponds to the expected one-to-one Authentication-to-Identity
   * persistence invariant.
   */
  existsByIdentityPublicId(
    identityPublicId: AuthenticationIdentityPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if an active Authentication exists for the supplied
   * Identity public identifier.
   */
  existsActiveByIdentityPublicId(
    identityPublicId: AuthenticationIdentityPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if an Authentication exists with the supplied lifecycle
   * status.
   */
  existsByStatus(status: AuthenticationStatus): Promise<boolean>;

  /**
   * Returns true if at least one pending Authentication exists.
   */
  existsPending(): Promise<boolean>;

  /**
   * Returns true if at least one active Authentication exists.
   */
  existsActive(): Promise<boolean>;

  /**
   * Returns true if at least one locked Authentication exists.
   */
  existsLocked(): Promise<boolean>;

  /**
   * Returns true if at least one disabled Authentication exists.
   */
  existsDisabled(): Promise<boolean>;

  /**
   * Returns true if at least one Authentication requires a password change.
   */
  existsRequiringPasswordChange(): Promise<boolean>;

  /**
   * Returns true if at least one Authentication has recorded one or more
   * authentication failures.
   */
  existsWithAuthenticationFailures(): Promise<boolean>;
}
