// -----------------------------------------------------------------------------
// OTP Challenge — Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the OtpChallenge aggregate.
//
// Aggregate boundary:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// The repository persists and retrieves complete OtpChallenge aggregates.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist OtpChallenge aggregates.
// - Delete OtpChallenge aggregates when explicitly permitted.
// - Retrieve OtpChallenge aggregates by internal identity.
// - Retrieve OtpChallenge aggregates by public identity.
// - Retrieve OtpChallenge aggregates by Identity public reference.
// - Retrieve OtpChallenge aggregates by OTP Challenge purpose.
// - Retrieve OtpChallenge aggregates by lifecycle status.
// - Retrieve pending OTP Challenge workflows.
// - Retrieve OTP Challenges by Identity and purpose.
// - Retrieve OTP Challenges by Identity and status.
// - Retrieve OTP Challenges by purpose and status.
// - Retrieve OTP Challenges by Identity, purpose, and status.
// - Retrieve the latest matching OTP Challenge where required.
// - Determine whether an OTP Challenge exists.
// - Preserve aggregate identity and lifecycle state.
// - Hide persistence technology from the domain and application layers.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - Contain OTP business rules.
// - Generate OTP values.
// - Hash OTP values.
// - Compare raw OTP values.
// - Validate raw OTP values.
// - Send OTPs.
// - Send notifications.
// - Perform rate limiting.
// - Authenticate users.
// - Execute recovery workflows.
// - Modify Identity.
// - Modify Recovery.
// - Modify Authentication.
// - Manage Sessions.
// - Access Prisma directly from the domain/application contract.
// - Expose Prisma models.
// - Expose database-specific types.
// - Navigate the Identity aggregate.
//
// Concrete implementations belong to the infrastructure layer.
//
// Example:
//
// infrastructure/
// └── persistence/
//     └── repositories/
//         └── prisma-otp-challenge.repository.ts
//
// -----------------------------------------------------------------------------
//
// Important:
//
// OtpChallenge is an independent aggregate.
//
// Identity is referenced only through:
//
// - OtpChallengeIdentityPublicId
//
// The repository therefore treats the Identity reference as an opaque public
// identifier and must not navigate to or mutate the Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// Security boundary:
//
// The repository may persist the OTP hash because it is part of the
// OtpChallenge aggregate state.
//
// It must never expose or introduce operations for:
//
// - raw OTP values;
// - OTP generation;
// - OTP comparison;
// - plaintext OTP persistence.
//
// OTP verification is coordinated by the application/security layer before
// the aggregate's verify() operation is invoked.
//
// -----------------------------------------------------------------------------
//
// Aggregate persistence rule:
//
// The repository persists and retrieves OtpChallengeAggregate as a whole.
//
// It must not expose OtpChallengeEntity persistence operations as the primary
// repository contract.
//
// -----------------------------------------------------------------------------
//
// Repository boundary:
//
// Application
//     │
//     ▼
// OtpChallengeRepository
//     │
//     ▼
// Infrastructure implementation
//     │
//     ▼
// Persistence
//
// -----------------------------------------------------------------------------
//
// Query semantics:
//
// `findPending()` means persisted lifecycle status is PENDING.
//
// Dynamic expiration is not inferred from persistence status alone.
//
// An OTP Challenge whose expiration timestamp has passed may still be stored
// with PENDING status until the appropriate domain/application workflow
// evaluates and transitions it through the aggregate.
//
// -----------------------------------------------------------------------------
//
// Latest semantics:
//
// Methods named `findLatest...` must be implemented deterministically by
// ordering according to the persistence representation of the aggregate's
// creation timestamp, normally descending.
//
// The repository must not invent business meaning for "latest"; it only
// provides deterministic retrieval of the most recently created aggregate.
//
// -----------------------------------------------------------------------------
//
// Value-object boundary:
//
// Query methods accept domain value objects rather than primitive strings.
//
// Infrastructure implementations are responsible for translating these
// value objects into persistence-specific query values.
//
// The domain and application layers must remain independent of Prisma,
// TypeORM, SQL, MongoDB, or any other persistence technology.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { OtpChallengeAggregate } from '../../domain/aggregates/otp-challenge.aggregate';

// -----------------------------------------------------------------------------
// Domain Identity
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { OtpChallengePublicId } from '../../domain/value-objects/otp-challenge-public-id.vo';

import type { OtpChallengeIdentityPublicId } from '../../domain/value-objects/otp-challenge-identity-public-id.vo';

import type { OtpChallengePurpose } from '../../domain/value-objects/otp-challenge-purpose.vo';

import type { OtpChallengeStatus } from '../../domain/value-objects/otp-challenge-status.vo';

// =============================================================================
// Repository
// =============================================================================

/**
 * OtpChallenge aggregate repository.
 *
 * Defines the persistence boundary for the OtpChallenge aggregate.
 *
 * Implementations belong to infrastructure.
 *
 * The repository deals exclusively with complete
 * OtpChallengeAggregate instances and domain value objects.
 */
export interface OtpChallengeRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists an OtpChallenge aggregate.
   *
   * Implementations may create or update the complete aggregate according
   * to the persistence strategy.
   *
   * The repository must preserve aggregate identity and lifecycle state.
   */
  save(otpChallenge: OtpChallengeAggregate): Promise<void>;

  /**
   * Removes an OtpChallenge aggregate from persistence.
   *
   * Deletion should only be performed by an application workflow that
   * explicitly permits OTP Challenge deletion.
   */
  delete(otpChallenge: OtpChallengeAggregate): Promise<void>;

  // ===========================================================================
  // Retrieval — Internal Identity
  // ===========================================================================

  /**
   * Finds an OtpChallenge aggregate by its internal persistence identity.
   *
   * Returns null when no OTP Challenge exists with the supplied identity.
   */
  findById(id: UniqueEntityId): Promise<OtpChallengeAggregate | null>;

  /**
   * Determines whether an OtpChallenge aggregate exists with the supplied
   * internal identity.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Retrieval — Public Identity
  // ===========================================================================

  /**
   * Finds an OtpChallenge aggregate by its public identity.
   *
   * The public identity is the externally safe identifier of the
   * OtpChallenge aggregate.
   */
  findByPublicId(
    publicId: OtpChallengePublicId,
  ): Promise<OtpChallengeAggregate | null>;

  /**
   * Determines whether an OtpChallenge aggregate exists with the supplied
   * public identity.
   */
  existsByPublicId(publicId: OtpChallengePublicId): Promise<boolean>;

  // ===========================================================================
  // Retrieval — Identity
  // ===========================================================================

  /**
   * Finds OTP Challenge aggregates belonging to the supplied Identity.
   *
   * The Identity reference is opaque to this repository.
   */
  findByIdentityPublicId(
    identityPublicId: OtpChallengeIdentityPublicId,
  ): Promise<OtpChallengeAggregate[]>;

  /**
   * Finds the most recently created OTP Challenge belonging to an Identity.
   *
   * Returns null when no OTP Challenge exists for the supplied Identity.
   */
  findLatestByIdentityPublicId(
    identityPublicId: OtpChallengeIdentityPublicId,
  ): Promise<OtpChallengeAggregate | null>;

  /**
   * Determines whether an Identity has at least one OTP Challenge.
   */
  existsByIdentityPublicId(
    identityPublicId: OtpChallengeIdentityPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Retrieval — Purpose
  // ===========================================================================

  /**
   * Finds OTP Challenge aggregates with the supplied purpose.
   */
  findByPurpose(purpose: OtpChallengePurpose): Promise<OtpChallengeAggregate[]>;

  /**
   * Determines whether at least one OTP Challenge exists with the supplied
   * purpose.
   */
  existsByPurpose(purpose: OtpChallengePurpose): Promise<boolean>;

  // ===========================================================================
  // Retrieval — Status
  // ===========================================================================

  /**
   * Finds OTP Challenge aggregates with the supplied lifecycle status.
   */
  findByStatus(status: OtpChallengeStatus): Promise<OtpChallengeAggregate[]>;

  /**
   * Finds OTP Challenge aggregates whose persisted lifecycle status is
   * PENDING.
   *
   * This method does not dynamically calculate expiry.
   *
   * A persisted PENDING Challenge may require application/domain evaluation
   * before it is transitioned to EXPIRED.
   */
  findPending(): Promise<OtpChallengeAggregate[]>;

  /**
   * Determines whether at least one OTP Challenge exists with the supplied
   * lifecycle status.
   */
  existsByStatus(status: OtpChallengeStatus): Promise<boolean>;

  // ===========================================================================
  // Retrieval — Identity + Purpose
  // ===========================================================================

  /**
   * Finds OTP Challenge aggregates belonging to an Identity and created for
   * the supplied purpose.
   */
  findByIdentityPublicIdAndPurpose(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
  ): Promise<OtpChallengeAggregate[]>;

  /**
   * Finds the most recently created OTP Challenge belonging to an Identity
   * and created for the supplied purpose.
   *
   * Returns null when no matching OTP Challenge exists.
   */
  findLatestByIdentityPublicIdAndPurpose(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
  ): Promise<OtpChallengeAggregate | null>;

  // ===========================================================================
  // Retrieval — Identity + Status
  // ===========================================================================

  /**
   * Finds OTP Challenge aggregates belonging to an Identity with the
   * supplied lifecycle status.
   */
  findByIdentityPublicIdAndStatus(
    identityPublicId: OtpChallengeIdentityPublicId,
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate[]>;

  /**
   * Finds the most recently created OTP Challenge belonging to an Identity
   * with the supplied lifecycle status.
   *
   * Returns null when no matching OTP Challenge exists.
   */
  findLatestByIdentityPublicIdAndStatus(
    identityPublicId: OtpChallengeIdentityPublicId,
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate | null>;

  // ===========================================================================
  // Retrieval — Purpose + Status
  // ===========================================================================

  /**
   * Finds OTP Challenge aggregates with the supplied purpose and lifecycle
   * status.
   */
  findByPurposeAndStatus(
    purpose: OtpChallengePurpose,
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate[]>;

  /**
   * Finds the most recently created OTP Challenge with the supplied purpose
   * and lifecycle status.
   *
   * Returns null when no matching OTP Challenge exists.
   */
  findLatestByPurposeAndStatus(
    purpose: OtpChallengePurpose,
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate | null>;

  // ===========================================================================
  // Retrieval — Identity + Purpose + Status
  // ===========================================================================

  /**
   * Finds OTP Challenge aggregates belonging to an Identity and restricted
   * by both purpose and lifecycle status.
   */
  findByIdentityPublicIdAndPurposeAndStatus(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate[]>;

  /**
   * Finds the most recently created OTP Challenge belonging to an Identity
   * and restricted by both purpose and lifecycle status.
   *
   * Returns null when no matching OTP Challenge exists.
   */
  findLatestByIdentityPublicIdAndPurposeAndStatus(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate | null>;

  // ===========================================================================
  // Retrieval — Pending Identity + Purpose
  // ===========================================================================

  /**
   * Finds pending OTP Challenges belonging to an Identity and created for
   * the supplied purpose.
   *
   * Pending means the persisted lifecycle status is PENDING.
   *
   * Dynamic expiration remains a domain concern.
   */
  findPendingByIdentityPublicIdAndPurpose(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
  ): Promise<OtpChallengeAggregate[]>;

  /**
   * Finds the most recently created pending OTP Challenge belonging to an
   * Identity and created for the supplied purpose.
   *
   * Returns null when no persisted PENDING Challenge matches.
   *
   * Dynamic expiration remains a domain concern.
   */
  findLatestPendingByIdentityPublicIdAndPurpose(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
  ): Promise<OtpChallengeAggregate | null>;
}
