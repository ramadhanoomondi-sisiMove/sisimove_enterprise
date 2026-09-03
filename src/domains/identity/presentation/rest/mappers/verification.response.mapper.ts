// -----------------------------------------------------------------------------
// Verification — REST Response Mapper
// -----------------------------------------------------------------------------
//
// Maps Verification domain objects into REST response representations.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// IMPORTANT:
//
// VerificationRequestEntity is owned by VerificationEntity, which is the
// aggregate root of VerificationAggregate.
//
// Therefore:
//
// - VerificationEntity.requests is the canonical child collection;
// - requests cross the REST boundary through the Verification aggregate
//   representation;
// - internal persistence identifiers are never exposed.
//
// Domain entities, aggregate roots, Entity IDs, and Value Objects are never
// exposed directly through the REST boundary.
//
// Value Objects are converted to their primitive representations here.
//
// IMPORTANT DOMAIN DISTINCTION:
//
// VerificationRequest approval is NOT aggregate verification.
//
//     VerificationRequestEntity.approve()
//         = submitted evidence is accepted.
//
//     VerificationEntity.verifyProfilePhoto()
//         = profile-photo evidence is accepted.
//
//     VerificationEntity.verifyGovernmentId()
//         = government-ID evidence is accepted.
//
//     VerificationEntity.verifyDriverLicense()
//         = driver-license evidence is accepted.
//
//     VerificationEntity.verifyMember()
//         = MEMBER verification is granted.
//
//     VerificationEntity.verifyDriver()
//         = DRIVER verification is granted.
//
// Therefore, this mapper reports:
//
// - request-level status;
// - aggregate-level verification status;
// - verification level;
// - accepted evidence;
// - review/decision metadata;
//
// but never derives aggregate verification from an approved request.
//
// IMPORTANT:
//
// VerificationEntity does not expose a revokedAt property.
//
// When revoke() is executed:
//
// - status becomes REVOKED;
// - level becomes NONE;
// - reviewedByPublicId is retained;
// - rejectionReason stores the revocation reason;
// - lastReviewedAt stores the revocation decision timestamp.
//
// Therefore this mapper intentionally does NOT expose a fabricated
// revokedAt property.
//
// IMPORTANT:
//
// VerificationRequestEntity does not expose a request-level expiresAt
// property.
//
// Request expiration is therefore intentionally NOT exposed by this mapper.
//
// Separate aggregate concerns are intentionally NOT mapped here:
//
// - Identity;
// - Asset;
// - Authentication;
// - Sessions;
// - Devices;
// - Recovery;
// - OTP challenges;
// - Role;
// - Permission;
//
// Those concerns have independent aggregate and response boundaries.
//
// -----------------------------------------------------------------------------
//
// Preferred usage:
//
//     VerificationResponseMapper.toResponse(aggregate)
//
// For collection responses:
//
//     VerificationResponseMapper.fromAggregates(aggregates)
//
// For dedicated request queries:
//
//     VerificationResponseMapper.requestFromEntity(request)
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { VerificationAggregate } from '../../../domain/aggregates/verification.aggregate';

import type { VerificationEntity } from '../../../domain/entities/verification.entity';

import type { VerificationRequestEntity } from '../../../domain/entities/verification-request.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * REST representation of a Verification aggregate.
 *
 * VerificationEntity.requests is included because VerificationRequestEntity
 * instances are aggregate-owned children.
 */
export interface VerificationResponse {
  // ===========================================================================
  // Verification
  // ===========================================================================

  /**
   * Public identity of the Verification aggregate.
   */
  publicId: string;

  /**
   * Public identity of the Identity being verified.
   */
  identityPublicId: string;

  /**
   * Current aggregate-level verification status.
   */
  status: string;

  /**
   * Current aggregate-level verification level.
   *
   * This value comes directly from VerificationEntity and is never inferred
   * from individual request statuses.
   */
  level: string;

  // ===========================================================================
  // Verification Evidence
  // ===========================================================================

  /**
   * Whether accepted profile-photo evidence exists.
   */
  profilePhotoVerified: boolean;

  /**
   * Whether accepted government-ID evidence exists.
   */
  governmentIdVerified: boolean;

  /**
   * Whether accepted driver-license evidence exists.
   */
  driverLicenseVerified: boolean;

  // ===========================================================================
  // Verification Timestamps
  // ===========================================================================

  /**
   * Time at which the current aggregate verification was granted.
   *
   * Undefined while the aggregate has not been verified in the current
   * verification cycle.
   */
  verifiedAt: Date | undefined;

  /**
   * Time at which MEMBER verification was granted.
   *
   * Historical value retained by the domain where applicable.
   */
  memberVerifiedAt: Date | undefined;

  /**
   * Time at which DRIVER verification was granted.
   *
   * Historical value retained by the domain where applicable.
   */
  driverVerifiedAt: Date | undefined;

  /**
   * Time at which the current verification expires.
   */
  expiresAt: Date | undefined;

  /**
   * Time at which accepted profile-photo evidence was recorded.
   */
  profilePhotoVerifiedAt: Date | undefined;

  /**
   * Time at which accepted government-ID evidence was recorded.
   */
  governmentIdVerifiedAt: Date | undefined;

  /**
   * Time at which accepted driver-license evidence was recorded.
   */
  driverLicenseVerifiedAt: Date | undefined;

  // ===========================================================================
  // Review
  // ===========================================================================

  /**
   * Public identity of the Identity that made the aggregate-level decision.
   */
  reviewedByPublicId: string | undefined;

  /**
   * Aggregate-level rejection or revocation reason.
   *
   * For REJECTED:
   *
   *   rejectionReason represents the rejection reason.
   *
   * For REVOKED:
   *
   *   rejectionReason stores the revocation reason according to the current
   *   VerificationEntity persistence model.
   */
  rejectionReason: string | undefined;

  /**
   * Time at which the aggregate-level review/decision occurred.
   *
   * For REVOKED this represents the revocation decision timestamp because
   * VerificationEntity stores that timestamp in lastReviewedAt.
   */
  lastReviewedAt: Date | undefined;

  // ===========================================================================
  // Requests
  // ===========================================================================

  /**
   * Verification requests owned by this Verification aggregate.
   */
  requests: VerificationRequestResponse[];

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

/**
 * REST representation of a VerificationRequest entity owned by
 * VerificationEntity.
 *
 * This represents submitted verification evidence and its request-level
 * review lifecycle.
 *
 * IMPORTANT:
 *
 * Approval of this request means the submitted evidence was accepted.
 *
 * It does NOT mean that the parent Verification aggregate has been verified.
 *
 * IMPORTANT:
 *
 * Request-level expiration is not part of the current
 * VerificationRequestEntity model and is therefore not exposed here.
 */
export interface VerificationRequestResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the verification request.
   */
  publicId: string;

  /**
   * Public identity of the owning Verification aggregate.
   */
  verificationPublicId: string;

  // ===========================================================================
  // Request
  // ===========================================================================

  /**
   * Type of verification evidence requested/submitted.
   */
  type: string;

  /**
   * Current request-level lifecycle status.
   */
  status: string;

  // ===========================================================================
  // Evidence
  // ===========================================================================

  /**
   * Public identity of the submitted evidence Asset.
   */
  assetPublicId: string;

  // ===========================================================================
  // Submission
  // ===========================================================================

  /**
   * Time at which the verification request was submitted.
   */
  submittedAt: Date;

  // ===========================================================================
  // Review
  // ===========================================================================

  /**
   * Time at which the request was reviewed.
   *
   * Undefined while the request remains pending or has not been reviewed.
   */
  reviewedAt: Date | undefined;

  /**
   * Public identity of the Identity that reviewed the request.
   */
  reviewedByPublicId: string | undefined;

  /**
   * Reason supplied when the request was rejected.
   */
  rejectionReason: string | undefined;

  // ===========================================================================
  // Metadata
  // ===========================================================================

  /**
   * Metadata supplied when the request was submitted.
   */
  metadata: Readonly<Record<string, unknown>> | undefined;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps Verification domain objects into REST response objects.
 *
 * The mapper performs only representation conversion.
 *
 * It does not:
 *
 * - calculate verification status;
 * - calculate verification level;
 * - infer aggregate verification from requests;
 * - mutate domain objects;
 * - expose persistence identifiers;
 * - perform authorization;
 * - perform business decisions.
 */
export class VerificationResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Verification aggregate.
   *
   * This is the preferred mapper for Verification detail responses.
   *
   * The aggregate root owns the VerificationEntity, while the entity exposes
   * its aggregate-owned VerificationRequestEntity collection through `requests`.
   */
  public static toResponse(
    aggregate: VerificationAggregate,
  ): VerificationResponse {
    return this.mapVerification(aggregate.verification);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps a Verification root entity.
   *
   * VerificationEntity.requests contains the aggregate-owned request entities.
   */
  public static fromEntity(
    verification: VerificationEntity,
  ): VerificationResponse {
    return this.mapVerification(verification);
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Verification aggregates.
   */
  public static fromAggregates(
    aggregates: readonly VerificationAggregate[],
  ): VerificationResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps a collection of Verification root entities.
   *
   * Each VerificationEntity already owns its request collection.
   */
  public static fromEntities(
    verifications: readonly VerificationEntity[],
  ): VerificationResponse[] {
    return verifications.map((verification) => this.fromEntity(verification));
  }

  // ===========================================================================
  // Request
  // ===========================================================================

  /**
   * Maps a request owned by the supplied VerificationEntity.
   *
   * The ownership check prevents an unrelated VerificationRequestEntity from
   * accidentally crossing the REST boundary as a child of another
   * Verification aggregate.
   */
  private static mapRequest(
    verification: VerificationEntity,
    request: VerificationRequestEntity,
  ): VerificationRequestResponse {
    // -------------------------------------------------------------------------
    // Aggregate Integrity
    // -------------------------------------------------------------------------

    if (!request.verificationPublicId.equals(verification.publicId)) {
      throw new Error(
        `Verification request ${request.publicId.value} does not belong to verification ${verification.publicId.value}.`,
      );
    }

    return this.mapRequestRepresentation(request);
  }

  // ===========================================================================
  // Request Representation
  // ===========================================================================

  /**
   * Maps the request representation without requiring its owning aggregate.
   *
   * This is shared by:
   *
   * - aggregate-owned request mapping;
   * - dedicated Verification Request queries.
   *
   * No aggregate-level verification state is inferred here.
   */
  private static mapRequestRepresentation(
    request: VerificationRequestEntity,
  ): VerificationRequestResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: request.publicId.value,

      verificationPublicId: request.verificationPublicId.value,

      // -----------------------------------------------------------------------
      // Request
      // -----------------------------------------------------------------------

      type: request.type.value,

      status: request.status.value,

      // -----------------------------------------------------------------------
      // Evidence
      // -----------------------------------------------------------------------

      assetPublicId: request.assetPublicId.value,

      // -----------------------------------------------------------------------
      // Submission
      // -----------------------------------------------------------------------

      submittedAt: request.submittedAt(),

      // -----------------------------------------------------------------------
      // Review
      // -----------------------------------------------------------------------

      reviewedAt: request.reviewedAt,

      reviewedByPublicId: request.reviewedByPublicId?.value,

      rejectionReason: request.rejectionReason,

      // -----------------------------------------------------------------------
      // Metadata
      // -----------------------------------------------------------------------

      metadata: request.metadata,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: request.createdAt,

      updatedAt: request.updatedAt,
    };
  }

  // ===========================================================================
  // Internal Verification Mapping
  // ===========================================================================

  /**
   * Maps the VerificationEntity portion of the aggregate.
   *
   * This is the single canonical implementation used by both:
   *
   * - toResponse();
   * - fromEntity();
   *
   * Keeping this logic centralized prevents aggregate and entity mapping paths
   * from drifting apart.
   */
  private static mapVerification(
    verification: VerificationEntity,
  ): VerificationResponse {
    return {
      // -----------------------------------------------------------------------
      // Verification
      // -----------------------------------------------------------------------

      publicId: verification.publicId.value,

      identityPublicId: verification.identityPublicId.value,

      status: verification.status.value,

      level: verification.level.value,

      // -----------------------------------------------------------------------
      // Accepted Verification Evidence
      // -----------------------------------------------------------------------

      profilePhotoVerified: verification.profilePhotoVerified,

      governmentIdVerified: verification.governmentIdVerified,

      driverLicenseVerified: verification.driverLicenseVerified,

      // -----------------------------------------------------------------------
      // Verification Timestamps
      // -----------------------------------------------------------------------

      verifiedAt: verification.verifiedAt,

      memberVerifiedAt: verification.memberVerifiedAt,

      driverVerifiedAt: verification.driverVerifiedAt,

      expiresAt: verification.expiresAt,

      profilePhotoVerifiedAt: verification.profilePhotoVerifiedAt,

      governmentIdVerifiedAt: verification.governmentIdVerifiedAt,

      driverLicenseVerifiedAt: verification.driverLicenseVerifiedAt,

      // -----------------------------------------------------------------------
      // Review
      // -----------------------------------------------------------------------

      reviewedByPublicId: verification.reviewedByPublicId?.value,

      rejectionReason: verification.rejectionReason,

      lastReviewedAt: verification.lastReviewedAt,

      // -----------------------------------------------------------------------
      // Aggregate-Owned Requests
      // -----------------------------------------------------------------------

      requests: verification.requests.map((request) =>
        this.mapRequest(verification, request),
      ),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: verification.createdAt,

      updatedAt: verification.updatedAt,
    };
  }

  // ===========================================================================
  // Independent Request Mapping
  // ===========================================================================

  /**
   * Maps a VerificationRequestEntity independently.
   *
   * This method is intended for dedicated Verification Request query
   * projections where the request is intentionally returned without its
   * aggregate root.
   *
   * The request's semantic Verification public identifier remains available,
   * while no internal persistence identifier is exposed.
   */
  public static requestFromEntity(
    request: VerificationRequestEntity,
  ): VerificationRequestResponse {
    return this.mapRequestRepresentation(request);
  }

  // ===========================================================================
  // Request Collection
  // ===========================================================================

  /**
   * Maps a collection of VerificationRequestEntity instances.
   *
   * This method is intended for dedicated Verification Request queries.
   *
   * It does not establish or validate aggregate ownership because the owning
   * VerificationEntity is intentionally unavailable to this method.
   */
  public static requestsFromEntities(
    requests: readonly VerificationRequestEntity[],
  ): VerificationRequestResponse[] {
    return requests.map((request) => this.requestFromEntity(request));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default VerificationResponseMapper;
