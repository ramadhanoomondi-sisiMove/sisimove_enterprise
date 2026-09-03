// -----------------------------------------------------------------------------
// Verification Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Verification aggregate.
//
// Aggregate ownership:
//
// VerificationAggregate
// ├── VerificationEntity
// └── VerificationRequestEntity[]
//
// Persistence boundary:
//
// - VerificationAggregate is the unit of persistence.
// - VerificationRequestEntity is persisted only through VerificationAggregate.
// - Cross-aggregate references remain opaque public identifiers.
// - Repository implementations must preserve aggregate invariants.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Create Verification aggregates.
// - Persist existing Verification aggregates.
// - Retrieve complete Verification aggregates.
// - Support Identity-scoped verification queries.
// - Support Verification lifecycle queries.
// - Support Verification level queries.
// - Support VerificationRequest processing queries.
// - Support VerificationRequest type queries.
// - Support VerificationRequest asset queries.
// - Support existence checks.
// - Delete complete Verification aggregates.
//
// -----------------------------------------------------------------------------
//
// Verification lifecycle:
//
// PENDING
//   ├──> VERIFIED
//   └──> REJECTED
//
// VERIFIED
//   ├──> EXPIRED
//   └──> REVOKED
//
// REJECTED
//   └──> PENDING
//
// EXPIRED
//   └──> PENDING
//
// REVOKED
//   └── terminal
//
// -----------------------------------------------------------------------------
//
// VerificationRequest lifecycle:
//
// PENDING
//   ├──> APPROVED
//   ├──> REJECTED
//   └──> CANCELLED
//
// APPROVED
//   └── terminal
//
// REJECTED
//   └── terminal
//
// CANCELLED
//   └── terminal
//
// IMPORTANT:
//
// VerificationRequest does NOT have an EXPIRED status.
//
// Request expiration is intentionally not part of the domain model.
//
// Therefore this repository does NOT expose:
//
// - findExpiredRequests();
// - findByRequestExpiredAt();
// - expireRequest();
// - any request-level expiration operation.
//
// If a pending VerificationRequest is no longer valid for processing, it is
// cancelled through the VerificationAggregate:
//
//     cancelRequest()
//
// VerificationRequest persistence remains part of the Verification aggregate
// persistence boundary.
//
// -----------------------------------------------------------------------------
//
// This interface does NOT:
//
// - Depend on Prisma.
// - Depend on ORM/database models.
// - Persist VerificationRequestEntity independently.
// - Expose VerificationRequestRepository.
// - Execute external verification providers.
// - Perform asset storage.
// - Modify Identity state.
// - Modify Identity roles.
// - Determine platform-wide verification policy.
// - Expire VerificationRequestEntity instances.
//
// IMPORTANT:
//
// VerificationRequestEntity is owned by VerificationAggregate.
//
// Therefore there is intentionally no:
//
// - createRequest();
// - saveRequest();
// - updateRequest();
// - deleteRequest();
// - expireRequest();
//
// Request-level queries may exist for processing workflows, but request
// persistence remains inside the Verification aggregate boundary.
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate references:
//
// - IdentityPublicId
// - VerificationRequestAssetPublicId
//
// Persistence identifiers are deliberately excluded from this contract.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { VerificationAggregate } from '../aggregates/verification.aggregate';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { IdentityPublicId } from '../value-objects/identity-public-id.vo';

import type { VerificationLevel } from '../value-objects/verification-level.vo';

import type { VerificationPublicId } from '../value-objects/verification-public-id.vo';

import type { VerificationRequestAssetPublicId } from '../value-objects/verification-request-asset-public-id.vo';

import type { VerificationRequestStatus } from '../value-objects/verification-request-status.vo';

import type { VerificationRequestType } from '../value-objects/verification-request-type.vo';

import type { VerificationStatus } from '../value-objects/verification-status.vo';

// =============================================================================
// Repository
// =============================================================================

/**
 * Repository contract for the Verification aggregate.
 *
 * VerificationAggregate is the persistence unit.
 *
 * VerificationRequestEntity instances are aggregate-owned children and are
 * persisted atomically with their owning VerificationAggregate.
 */
export interface VerificationRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a newly created Verification aggregate.
   *
   * The complete aggregate is persisted atomically:
   *
   * VerificationAggregate
   * ├── VerificationEntity
   * └── VerificationRequestEntity[]
   *
   * VerificationRequestEntity instances are never persisted independently.
   */
  create(aggregate: VerificationAggregate): Promise<void>;

  /**
   * Persists the complete current state of an existing Verification aggregate.
   *
   * The aggregate root and all aggregate-owned VerificationRequestEntity
   * instances are synchronized within the same persistence transaction.
   */
  save(aggregate: VerificationAggregate): Promise<void>;

  /**
   * Deletes the complete Verification aggregate.
   *
   * Aggregate-owned VerificationRequestEntity persistence records are deleted
   * as part of the aggregate deletion operation.
   *
   * VerificationRequestEntity instances are never deleted through an
   * independent repository operation.
   */
  delete(aggregate: VerificationAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Retrieval
  // ===========================================================================

  /**
   * Finds a complete Verification aggregate by internal persistence identity.
   *
   * Rehydration must include:
   *
   * - VerificationEntity;
   * - VerificationRequestEntity[].
   *
   * No domain events are emitted during rehydration.
   */
  findById(id: string): Promise<VerificationAggregate | null>;

  /**
   * Finds a complete Verification aggregate by public identity.
   */
  findByPublicId(
    publicId: VerificationPublicId,
  ): Promise<VerificationAggregate | null>;

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Finds the Verification aggregate belonging to an Identity.
   *
   * An Identity owns at most one Verification aggregate.
   */
  findByIdentityPublicId(
    identityPublicId: IdentityPublicId,
  ): Promise<VerificationAggregate | null>;

  /**
   * Determines whether an Identity owns a Verification aggregate.
   */
  existsByIdentityPublicId(
    identityPublicId: IdentityPublicId,
  ): Promise<boolean>;

  /**
   * Semantic alias for existsByIdentityPublicId().
   */
  existsByIdentity(identityPublicId: IdentityPublicId): Promise<boolean>;

  // ===========================================================================
  // Verification Lifecycle
  // ===========================================================================

  /**
   * Finds complete Verification aggregates by lifecycle status.
   *
   * Valid Verification statuses:
   *
   * - PENDING;
   * - VERIFIED;
   * - REJECTED;
   * - EXPIRED;
   * - REVOKED.
   *
   * EXPIRED applies exclusively to the Verification aggregate.
   *
   * VerificationRequestEntity does not have an EXPIRED status.
   */
  findByStatus(status: VerificationStatus): Promise<VerificationAggregate[]>;

  /**
   * Finds all PENDING Verification aggregates.
   */
  findPending(): Promise<VerificationAggregate[]>;

  /**
   * Finds all VERIFIED Verification aggregates.
   */
  findVerified(): Promise<VerificationAggregate[]>;

  /**
   * Finds all REJECTED Verification aggregates.
   */
  findRejected(): Promise<VerificationAggregate[]>;

  /**
   * Finds all EXPIRED Verification aggregates.
   *
   * This refers exclusively to Verification lifecycle expiration.
   */
  findExpired(): Promise<VerificationAggregate[]>;

  /**
   * Finds all REVOKED Verification aggregates.
   */
  findRevoked(): Promise<VerificationAggregate[]>;

  // ===========================================================================
  // Verification Level
  // ===========================================================================

  /**
   * Finds Verification aggregates by verification level.
   *
   * Valid levels:
   *
   * - NONE;
   * - MEMBER;
   * - DRIVER.
   */
  findByLevel(level: VerificationLevel): Promise<VerificationAggregate[]>;

  // ===========================================================================
  // Verification Request Processing
  // ===========================================================================

  /**
   * Finds complete Verification aggregates containing at least one
   * VerificationRequestEntity with the supplied lifecycle status.
   *
   * The request lifecycle is:
   *
   * PENDING
   *   ├──> APPROVED
   *   ├──> REJECTED
   *   └──> CANCELLED
   *
   * APPROVED
   *   └── terminal
   *
   * REJECTED
   *   └── terminal
   *
   * CANCELLED
   *   └── terminal
   *
   * There is intentionally no EXPIRED request status.
   */
  findByRequestStatus(
    status: VerificationRequestStatus,
  ): Promise<VerificationAggregate[]>;

  /**
   * Finds complete Verification aggregates containing at least one pending
   * VerificationRequestEntity.
   *
   * Pending requests are currently awaiting review or processing.
   */
  findWithPendingRequests(): Promise<VerificationAggregate[]>;

  /**
   * Finds complete Verification aggregates containing at least one
   * VerificationRequestEntity of the supplied type.
   */
  findByRequestType(
    type: VerificationRequestType,
  ): Promise<VerificationAggregate[]>;

  // ===========================================================================
  // Verification Request Asset
  // ===========================================================================

  /**
   * Finds the Verification aggregate containing a VerificationRequestEntity
   * that references the supplied Asset public identity.
   *
   * Asset identity remains an opaque cross-aggregate reference.
   */
  findByRequestAssetPublicId(
    assetPublicId: VerificationRequestAssetPublicId,
  ): Promise<VerificationAggregate | null>;

  /**
   * Determines whether any aggregate-owned VerificationRequestEntity references
   * the supplied Asset public identity.
   */
  existsByRequestAssetPublicId(
    assetPublicId: VerificationRequestAssetPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Determines whether a Verification aggregate exists by public identity.
   */
  existsByPublicId(publicId: VerificationPublicId): Promise<boolean>;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default VerificationRepository;
