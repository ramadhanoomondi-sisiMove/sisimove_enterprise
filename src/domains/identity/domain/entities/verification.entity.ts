// -----------------------------------------------------------------------------
// Verification Aggregate Root Entity
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// VerificationEntity is the aggregate-root entity for the Verification
// aggregate.
//
// Aggregate ownership:
//
// - verification lifecycle;
// - current verification level;
// - accepted verification evidence;
// - aggregate-level verification decisions;
// - review and decision metadata;
// - expiration and revocation state;
// - VerificationRequest child entities.
//
// VerificationRequestEntity owns the lifecycle of an individual verification
// submission.
//
// IMPORTANT:
//
// Request approval and aggregate verification are separate business decisions:
//
//     VerificationRequestEntity.approve()
//         -> submitted evidence is accepted;
//
//     VerificationEntity.verifyProfilePhoto()
//     VerificationEntity.verifyGovernmentId()
//     VerificationEntity.verifyDriverLicense()
//         -> accepted evidence is recorded;
//
//     VerificationEntity.verifyMember()
//         -> Identity is officially verified at MEMBER level;
//
//     VerificationEntity.verifyDriver()
//         -> Identity is officially verified at DRIVER level.
//
// Approval of an individual request MUST NOT automatically transition the
// aggregate to VERIFIED.
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
// Verification request lifecycle:
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
// Request expiration is represented as:
//
// PENDING -> CANCELLED
//
// -----------------------------------------------------------------------------
//
// Evidence requirements:
//
// MEMBER
//   profilePhotoVerified === true
//   OR
//   governmentIdVerified === true
//
// DRIVER
//   driverLicenseVerified === true
//
// Evidence flags represent accepted evidence only.
//
// Evidence does NOT independently determine aggregate verification status.
//
// -----------------------------------------------------------------------------
//
// Re-verification:
//
// REJECTED and EXPIRED verification aggregates may be reopened into PENDING.
//
// Historical evidence timestamps and historical request records are retained.
//
// REVOKED is terminal and cannot be reopened.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { VerificationInvalidStatusException } from '../exceptions/verification-invalid-status.exception';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { VerificationRequestEntity } from './verification-request.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { VerificationPublicId } from '../value-objects/verification-public-id.vo';

import type { IdentityPublicId } from '../value-objects/identity-public-id.vo';

import { VerificationStatus } from '../value-objects/verification-status.vo';

import { VerificationLevel } from '../value-objects/verification-level.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

export interface VerificationProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: VerificationPublicId;

  identityPublicId: IdentityPublicId;

  // ---------------------------------------------------------------------------
  // Verification State
  // ---------------------------------------------------------------------------

  status: VerificationStatus;

  level: VerificationLevel;

  // ---------------------------------------------------------------------------
  // Accepted Verification Evidence
  // ---------------------------------------------------------------------------

  profilePhotoVerified: boolean;

  governmentIdVerified: boolean;

  driverLicenseVerified: boolean;

  // ---------------------------------------------------------------------------
  // Verification Timestamps
  // ---------------------------------------------------------------------------

  verifiedAt?: Date;

  expiresAt?: Date;

  memberVerifiedAt?: Date;

  driverVerifiedAt?: Date;

  profilePhotoVerifiedAt?: Date;

  governmentIdVerifiedAt?: Date;

  driverLicenseVerifiedAt?: Date;

  // ---------------------------------------------------------------------------
  // Review
  // ---------------------------------------------------------------------------

  reviewedByPublicId?: IdentityPublicId;

  rejectionReason?: string;

  lastReviewedAt?: Date;

  // ---------------------------------------------------------------------------
  // Aggregate-Owned Requests
  // ---------------------------------------------------------------------------

  requests: VerificationRequestEntity[];

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Validation Properties
// -----------------------------------------------------------------------------

interface VerificationValidationProps {
  status: VerificationStatus;

  level: VerificationLevel;

  profilePhotoVerified: boolean;

  governmentIdVerified: boolean;

  driverLicenseVerified: boolean;

  verifiedAt: Date | undefined;

  expiresAt: Date | undefined;

  memberVerifiedAt: Date | undefined;

  driverVerifiedAt: Date | undefined;

  profilePhotoVerifiedAt: Date | undefined;

  governmentIdVerifiedAt: Date | undefined;

  driverLicenseVerifiedAt: Date | undefined;

  reviewedByPublicId: IdentityPublicId | undefined;

  rejectionReason: string | undefined;

  lastReviewedAt: Date | undefined;

  createdAt?: Date;

  updatedAt?: Date;
}

// -----------------------------------------------------------------------------
// Aggregate Root Entity
// -----------------------------------------------------------------------------

export class VerificationEntity extends AggregateRoot<
  VerificationProps,
  VerificationPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(
    props: VerificationProps,
    id?: UniqueEntityId,
    publicId?: VerificationPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(props: {
    publicId?: VerificationPublicId;

    identityPublicId: IdentityPublicId;

    status?: VerificationStatus;

    level?: VerificationLevel;

    profilePhotoVerified?: boolean;

    governmentIdVerified?: boolean;

    driverLicenseVerified?: boolean;

    verifiedAt?: Date;

    expiresAt?: Date;

    memberVerifiedAt?: Date;

    driverVerifiedAt?: Date;

    profilePhotoVerifiedAt?: Date;

    governmentIdVerifiedAt?: Date;

    driverLicenseVerifiedAt?: Date;

    reviewedByPublicId?: IdentityPublicId;

    rejectionReason?: string;

    lastReviewedAt?: Date;

    requests?: VerificationRequestEntity[];

    createdAt?: Date;

    updatedAt?: Date;
  }): VerificationEntity {
    if (props === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification creation properties are required.',
      );
    }

    if (props.identityPublicId === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification identity public ID is required.',
      );
    }

    const now = new Date();

    const publicId = props.publicId ?? new VerificationPublicId();

    const status = props.status ?? VerificationStatus.create('PENDING');

    const level = props.level ?? VerificationLevel.create('NONE');

    const profilePhotoVerified = props.profilePhotoVerified ?? false;

    const governmentIdVerified = props.governmentIdVerified ?? false;

    const driverLicenseVerified = props.driverLicenseVerified ?? false;

    const verifiedAt = VerificationEntity.optionalDate(props.verifiedAt);

    const expiresAt = VerificationEntity.optionalDate(props.expiresAt);

    const memberVerifiedAt = VerificationEntity.optionalDate(
      props.memberVerifiedAt,
    );

    const driverVerifiedAt = VerificationEntity.optionalDate(
      props.driverVerifiedAt,
    );

    const profilePhotoVerifiedAt = VerificationEntity.optionalDate(
      props.profilePhotoVerifiedAt,
    );

    const governmentIdVerifiedAt = VerificationEntity.optionalDate(
      props.governmentIdVerifiedAt,
    );

    const driverLicenseVerifiedAt = VerificationEntity.optionalDate(
      props.driverLicenseVerifiedAt,
    );

    const lastReviewedAt = VerificationEntity.optionalDate(
      props.lastReviewedAt,
    );

    const rejectionReason =
      props.rejectionReason !== undefined
        ? VerificationEntity.normalizeReason(props.rejectionReason)
        : undefined;

    const createdAt = VerificationEntity.cloneDate(props.createdAt ?? now);

    const updatedAt = VerificationEntity.cloneDate(props.updatedAt ?? now);

    VerificationEntity.validateState({
      status,
      level,

      profilePhotoVerified,
      governmentIdVerified,
      driverLicenseVerified,

      verifiedAt,
      expiresAt,

      memberVerifiedAt,
      driverVerifiedAt,

      profilePhotoVerifiedAt,
      governmentIdVerifiedAt,
      driverLicenseVerifiedAt,

      reviewedByPublicId: props.reviewedByPublicId,
      rejectionReason,
      lastReviewedAt,

      createdAt,
      updatedAt,
    });

    VerificationEntity.validateRequests(props.requests ?? [], publicId);

    return new VerificationEntity(
      {
        publicId,
        identityPublicId: props.identityPublicId,

        status,
        level,

        profilePhotoVerified,
        governmentIdVerified,
        driverLicenseVerified,

        ...(verifiedAt !== undefined ? { verifiedAt } : {}),
        ...(expiresAt !== undefined ? { expiresAt } : {}),

        ...(memberVerifiedAt !== undefined ? { memberVerifiedAt } : {}),

        ...(driverVerifiedAt !== undefined ? { driverVerifiedAt } : {}),

        ...(profilePhotoVerifiedAt !== undefined
          ? { profilePhotoVerifiedAt }
          : {}),

        ...(governmentIdVerifiedAt !== undefined
          ? { governmentIdVerifiedAt }
          : {}),

        ...(driverLicenseVerifiedAt !== undefined
          ? { driverLicenseVerifiedAt }
          : {}),

        ...(props.reviewedByPublicId !== undefined
          ? { reviewedByPublicId: props.reviewedByPublicId }
          : {}),

        ...(rejectionReason !== undefined ? { rejectionReason } : {}),

        ...(lastReviewedAt !== undefined ? { lastReviewedAt } : {}),

        requests: [...(props.requests ?? [])],

        createdAt,
        updatedAt,
      },
      undefined,
      publicId,
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a Verification aggregate from persistence.
   *
   * Rehydration:
   *
   * - validates persisted aggregate invariants;
   * - validates request ownership and duplicate identities;
   * - does not create domain events.
   */
  public static rehydrate(
    props: VerificationProps,
    id: UniqueEntityId,
    publicId: VerificationPublicId,
  ): VerificationEntity {
    if (props === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification rehydration properties are required.',
      );
    }

    if (id === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification internal identity is required for rehydration.',
      );
    }

    if (publicId === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification public identity is required for rehydration.',
      );
    }

    if (props.identityPublicId === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification identity public ID is required for rehydration.',
      );
    }

    const createdAt = VerificationEntity.cloneDate(props.createdAt);

    const updatedAt = VerificationEntity.cloneDate(props.updatedAt);

    VerificationEntity.validateState({
      status: props.status,
      level: props.level,

      profilePhotoVerified: props.profilePhotoVerified,
      governmentIdVerified: props.governmentIdVerified,
      driverLicenseVerified: props.driverLicenseVerified,

      verifiedAt: props.verifiedAt,
      expiresAt: props.expiresAt,

      memberVerifiedAt: props.memberVerifiedAt,
      driverVerifiedAt: props.driverVerifiedAt,

      profilePhotoVerifiedAt: props.profilePhotoVerifiedAt,
      governmentIdVerifiedAt: props.governmentIdVerifiedAt,
      driverLicenseVerifiedAt: props.driverLicenseVerifiedAt,

      reviewedByPublicId: props.reviewedByPublicId,

      rejectionReason:
        props.rejectionReason !== undefined
          ? VerificationEntity.normalizeReason(props.rejectionReason)
          : undefined,

      lastReviewedAt: props.lastReviewedAt,

      createdAt,
      updatedAt,
    });

    VerificationEntity.validateRequests(props.requests, publicId);

    return new VerificationEntity(
      {
        publicId,

        identityPublicId: props.identityPublicId,

        status: props.status,
        level: props.level,

        profilePhotoVerified: props.profilePhotoVerified,
        governmentIdVerified: props.governmentIdVerified,
        driverLicenseVerified: props.driverLicenseVerified,

        ...(props.verifiedAt !== undefined
          ? {
              verifiedAt: VerificationEntity.cloneDate(props.verifiedAt),
            }
          : {}),

        ...(props.expiresAt !== undefined
          ? {
              expiresAt: VerificationEntity.cloneDate(props.expiresAt),
            }
          : {}),

        ...(props.memberVerifiedAt !== undefined
          ? {
              memberVerifiedAt: VerificationEntity.cloneDate(
                props.memberVerifiedAt,
              ),
            }
          : {}),

        ...(props.driverVerifiedAt !== undefined
          ? {
              driverVerifiedAt: VerificationEntity.cloneDate(
                props.driverVerifiedAt,
              ),
            }
          : {}),

        ...(props.profilePhotoVerifiedAt !== undefined
          ? {
              profilePhotoVerifiedAt: VerificationEntity.cloneDate(
                props.profilePhotoVerifiedAt,
              ),
            }
          : {}),

        ...(props.governmentIdVerifiedAt !== undefined
          ? {
              governmentIdVerifiedAt: VerificationEntity.cloneDate(
                props.governmentIdVerifiedAt,
              ),
            }
          : {}),

        ...(props.driverLicenseVerifiedAt !== undefined
          ? {
              driverLicenseVerifiedAt: VerificationEntity.cloneDate(
                props.driverLicenseVerifiedAt,
              ),
            }
          : {}),

        ...(props.reviewedByPublicId !== undefined
          ? {
              reviewedByPublicId: props.reviewedByPublicId,
            }
          : {}),

        ...(props.rejectionReason !== undefined
          ? {
              rejectionReason: VerificationEntity.normalizeReason(
                props.rejectionReason,
              ),
            }
          : {}),

        ...(props.lastReviewedAt !== undefined
          ? {
              lastReviewedAt: VerificationEntity.cloneDate(
                props.lastReviewedAt,
              ),
            }
          : {}),

        requests: [...props.requests],

        createdAt,
        updatedAt,
      },
      id,
      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  public override get publicId(): VerificationPublicId {
    return this.props.publicId;
  }

  public get identityPublicId(): IdentityPublicId {
    return this.props.identityPublicId;
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  public get status(): VerificationStatus {
    return this.props.status;
  }

  public isPending(): boolean {
    return this.props.status.isPending();
  }

  public isVerified(): boolean {
    return this.props.status.isVerified();
  }

  public isRejected(): boolean {
    return this.props.status.isRejected();
  }

  public isExpired(): boolean {
    return this.props.status.isExpired();
  }

  public isRevoked(): boolean {
    return this.props.status.isRevoked();
  }

  /**
   * Returns true only while the verification remains currently valid.
   *
   * A VERIFIED aggregate whose expiration timestamp has passed is no longer
   * active, even before an explicit EXPIRED transition is persisted.
   */
  public isActive(at: Date = new Date()): boolean {
    VerificationEntity.ensureValidDate(
      at,
      'Verification active-state timestamp must be valid.',
    );

    return this.isVerified() && !this.hasExpired(at);
  }

  /**
   * REVOKED is the only irreversible aggregate state.
   *
   * REJECTED and EXPIRED may enter a new verification cycle.
   */
  public isTerminal(): boolean {
    return this.isRevoked();
  }

  // ===========================================================================
  // Verification Level
  // ===========================================================================

  public get level(): VerificationLevel {
    return this.props.level;
  }

  public isNoneLevel(): boolean {
    return this.props.level.isNone();
  }

  public isMemberLevel(): boolean {
    return this.props.level.isMember();
  }

  public isDriverLevel(): boolean {
    return this.props.level.isDriver();
  }

  // ===========================================================================
  // Accepted Evidence
  // ===========================================================================

  public get profilePhotoVerified(): boolean {
    return this.props.profilePhotoVerified;
  }

  public get governmentIdVerified(): boolean {
    return this.props.governmentIdVerified;
  }

  public get driverLicenseVerified(): boolean {
    return this.props.driverLicenseVerified;
  }

  public hasProfilePhotoVerification(): boolean {
    return this.props.profilePhotoVerified;
  }

  public hasGovernmentIdVerification(): boolean {
    return this.props.governmentIdVerified;
  }

  public hasDriverLicenseVerification(): boolean {
    return this.props.driverLicenseVerified;
  }

  public hasRequiredMemberVerification(): boolean {
    return this.props.profilePhotoVerified || this.props.governmentIdVerified;
  }

  public hasRequiredDriverVerification(): boolean {
    return this.props.driverLicenseVerified;
  }

  public canVerifyMember(): boolean {
    return this.isPending() && this.hasRequiredMemberVerification();
  }

  public canVerifyDriver(): boolean {
    return this.isPending() && this.hasRequiredDriverVerification();
  }

  // ===========================================================================
  // Verification Timestamps
  // ===========================================================================

  public get verifiedAt(): Date | undefined {
    return VerificationEntity.optionalDate(this.props.verifiedAt);
  }

  public get expiresAt(): Date | undefined {
    return VerificationEntity.optionalDate(this.props.expiresAt);
  }

  public get memberVerifiedAt(): Date | undefined {
    return VerificationEntity.optionalDate(this.props.memberVerifiedAt);
  }

  public get driverVerifiedAt(): Date | undefined {
    return VerificationEntity.optionalDate(this.props.driverVerifiedAt);
  }

  public get profilePhotoVerifiedAt(): Date | undefined {
    return VerificationEntity.optionalDate(this.props.profilePhotoVerifiedAt);
  }

  public get governmentIdVerifiedAt(): Date | undefined {
    return VerificationEntity.optionalDate(this.props.governmentIdVerifiedAt);
  }

  public get driverLicenseVerifiedAt(): Date | undefined {
    return VerificationEntity.optionalDate(this.props.driverLicenseVerifiedAt);
  }

  // ===========================================================================
  // Review
  // ===========================================================================

  public get reviewedByPublicId(): IdentityPublicId | undefined {
    return this.props.reviewedByPublicId;
  }

  public get rejectionReason(): string | undefined {
    return this.props.rejectionReason;
  }

  public get lastReviewedAt(): Date | undefined {
    return VerificationEntity.optionalDate(this.props.lastReviewedAt);
  }

  // ===========================================================================
  // Aggregate-Owned Requests
  // ===========================================================================

  /**
   * Returns a defensive copy of the aggregate-owned request collection.
   *
   * The collection itself cannot be structurally mutated by the caller.
   */
  public get requests(): readonly VerificationRequestEntity[] {
    return [...this.props.requests];
  }

  /**
   * Adds an already materialized child request.
   *
   * The request must belong to this Verification aggregate.
   *
   * Duplicate request public IDs are treated as idempotent insertion.
   */
  public addRequest(
    request: VerificationRequestEntity,
    at: Date = new Date(),
  ): void {
    if (request === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification request entity is required.',
      );
    }

    VerificationEntity.ensureValidDate(
      at,
      'Verification request addition timestamp must be valid.',
    );

    this.ensureNotRevoked(
      'Verification requests cannot be added to a revoked verification.',
    );

    if (!request.verificationPublicId.equals(this.publicId)) {
      throw new VerificationInvalidStatusException(
        `Verification request ${request.publicId.value} does not belong to verification ${this.publicId.value}.`,
      );
    }

    const alreadyExists = this.props.requests.some((existingRequest) =>
      existingRequest.publicId.equals(request.publicId),
    );

    if (alreadyExists) {
      return;
    }

    this.props.requests.push(request);

    this.touch(at);
  }

  /**
   * Finds a request by public identifier.
   */
  public findRequest(publicId: string): VerificationRequestEntity | undefined {
    if (typeof publicId !== 'string' || publicId.trim().length === 0) {
      return undefined;
    }

    const normalizedPublicId = publicId.trim();

    return this.props.requests.find(
      (request) => request.publicId.value === normalizedPublicId,
    );
  }

  /**
   * Returns all requests of the specified type.
   */
  public findRequestsByType(
    type: VerificationRequestEntity['type'],
  ): readonly VerificationRequestEntity[] {
    if (type === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification request type is required.',
      );
    }

    return this.props.requests.filter((request) => request.type.equals(type));
  }

  /**
   * Finds the currently pending request for the specified type.
   */
  public findPendingRequestByType(
    type: VerificationRequestEntity['type'],
  ): VerificationRequestEntity | undefined {
    if (type === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification request type is required.',
      );
    }

    return this.props.requests.find(
      (request) => request.type.equals(type) && request.isPending(),
    );
  }

  public hasPendingRequest(type: VerificationRequestEntity['type']): boolean {
    return this.findPendingRequestByType(type) !== undefined;
  }

  // ===========================================================================
  // Aggregate-Level Verification Decisions
  // ===========================================================================

  /**
   * Grants MEMBER verification.
   *
   * Required accepted evidence:
   *
   * - profile photo; OR
   * - government ID.
   */
  public verifyMember(
    reviewedByPublicId: IdentityPublicId,
    at: Date = new Date(),
    expiresAt?: Date,
  ): void {
    this.ensureReviewer(reviewedByPublicId);

    this.ensurePendingForVerification();

    if (!this.hasRequiredMemberVerification()) {
      throw new VerificationInvalidStatusException(
        'Member verification requires accepted profile photo or government ID evidence.',
      );
    }

    const timestamp = VerificationEntity.requireValidTimestamp(
      at,
      'Member verification timestamp must be valid.',
    );

    const expiration = this.resolveExpiration(timestamp, expiresAt);

    this.props.status = VerificationStatus.create('VERIFIED');

    this.props.level = VerificationLevel.create('MEMBER');

    this.props.verifiedAt = timestamp;

    this.props.memberVerifiedAt = timestamp;

    this.props.reviewedByPublicId = reviewedByPublicId;

    this.props.lastReviewedAt = timestamp;

    delete this.props.rejectionReason;

    if (expiration !== undefined) {
      this.props.expiresAt = expiration;
    } else {
      delete this.props.expiresAt;
    }

    this.touch(timestamp);
  }

  /**
   * Grants DRIVER verification.
   *
   * Required accepted evidence:
   *
   * - driver license.
   */
  public verifyDriver(
    reviewedByPublicId: IdentityPublicId,
    at: Date = new Date(),
    expiresAt?: Date,
  ): void {
    this.ensureReviewer(reviewedByPublicId);

    this.ensurePendingForVerification();

    if (!this.hasRequiredDriverVerification()) {
      throw new VerificationInvalidStatusException(
        'Driver verification requires accepted driver license evidence.',
      );
    }

    const timestamp = VerificationEntity.requireValidTimestamp(
      at,
      'Driver verification timestamp must be valid.',
    );

    const expiration = this.resolveExpiration(timestamp, expiresAt);

    this.props.status = VerificationStatus.create('VERIFIED');

    this.props.level = VerificationLevel.create('DRIVER');

    this.props.verifiedAt = timestamp;

    this.props.driverVerifiedAt = timestamp;

    this.props.reviewedByPublicId = reviewedByPublicId;

    this.props.lastReviewedAt = timestamp;

    delete this.props.rejectionReason;

    if (expiration !== undefined) {
      this.props.expiresAt = expiration;
    } else {
      delete this.props.expiresAt;
    }

    this.touch(timestamp);
  }

  // ===========================================================================
  // Accepted Evidence Recording
  // ===========================================================================

  /**
   * Records accepted profile-photo evidence.
   *
   * This does not change aggregate verification status or level.
   */
  public verifyProfilePhoto(at: Date = new Date()): void {
    this.recordEvidence('PROFILE_PHOTO', at);
  }

  /**
   * Records accepted government-ID evidence.
   *
   * This does not change aggregate verification status or level.
   */
  public verifyGovernmentId(at: Date = new Date()): void {
    this.recordEvidence('GOVERNMENT_ID', at);
  }

  /**
   * Records accepted driver-license evidence.
   *
   * This does not change aggregate verification status or level.
   */
  public verifyDriverLicense(at: Date = new Date()): void {
    this.recordEvidence('DRIVER_LICENSE', at);
  }

  // ===========================================================================
  // Aggregate Rejection
  // ===========================================================================

  /**
   * Rejects the current aggregate verification cycle.
   *
   * This is distinct from rejecting an individual VerificationRequest.
   */
  public reject(
    reviewedByPublicId: IdentityPublicId,
    rejectionReason: string,
    at: Date = new Date(),
  ): void {
    this.ensureReviewer(reviewedByPublicId);

    this.ensurePendingForReview();

    const reason = VerificationEntity.normalizeReason(rejectionReason);

    if (reason.length === 0) {
      throw new VerificationInvalidStatusException(
        'A rejected verification must have a rejection reason.',
      );
    }

    const timestamp = VerificationEntity.requireValidTimestamp(
      at,
      'Verification rejection timestamp must be valid.',
    );

    this.props.status = VerificationStatus.create('REJECTED');

    this.props.level = VerificationLevel.create('NONE');

    this.props.reviewedByPublicId = reviewedByPublicId;

    this.props.rejectionReason = reason;

    this.props.lastReviewedAt = timestamp;

    delete this.props.verifiedAt;
    delete this.props.expiresAt;

    this.touch(timestamp);
  }

  // ===========================================================================
  // Expiration
  // ===========================================================================

  public hasExpired(at: Date = new Date()): boolean {
    VerificationEntity.ensureValidDate(
      at,
      'Verification expiration evaluation timestamp must be valid.',
    );

    if (this.props.expiresAt === undefined) {
      return false;
    }

    return at.getTime() >= this.props.expiresAt.getTime();
  }

  /**
   * Moves VERIFIED -> EXPIRED.
   *
   * Historical verification and evidence timestamps remain intact.
   */
  public expire(at: Date = new Date()): void {
    const timestamp = VerificationEntity.requireValidTimestamp(
      at,
      'Verification expiration timestamp must be valid.',
    );

    if (!this.isVerified()) {
      throw new VerificationInvalidStatusException(
        `Verification ${this.publicId.value} cannot expire from status ${this.props.status.value}.`,
      );
    }

    if (this.props.expiresAt === undefined) {
      throw new VerificationInvalidStatusException(
        `Verification ${this.publicId.value} does not have an expiration timestamp.`,
      );
    }

    if (!this.hasExpired(timestamp)) {
      throw new VerificationInvalidStatusException(
        `Verification ${this.publicId.value} has not reached its expiration time.`,
      );
    }

    this.props.status = VerificationStatus.create('EXPIRED');

    this.props.level = VerificationLevel.create('NONE');

    this.touch(timestamp);
  }

  // ===========================================================================
  // Revocation
  // ===========================================================================

  /**
   * Revokes the current verification.
   *
   * REVOKED is terminal.
   */
  public revoke(
    reviewedByPublicId: IdentityPublicId,
    reason: string,
    at: Date = new Date(),
  ): void {
    this.ensureReviewer(reviewedByPublicId);

    if (!this.isVerified()) {
      throw new VerificationInvalidStatusException(
        `Verification ${this.publicId.value} cannot be revoked from status ${this.props.status.value}.`,
      );
    }

    const normalizedReason = VerificationEntity.normalizeReason(reason);

    if (normalizedReason.length === 0) {
      throw new VerificationInvalidStatusException(
        'A revoked verification must have a revocation reason.',
      );
    }

    const timestamp = VerificationEntity.requireValidTimestamp(
      at,
      'Verification revocation timestamp must be valid.',
    );

    this.props.status = VerificationStatus.create('REVOKED');

    this.props.level = VerificationLevel.create('NONE');

    this.props.reviewedByPublicId = reviewedByPublicId;

    // Retained persistence field. In the REVOKED state it represents the
    // revocation reason.
    this.props.rejectionReason = normalizedReason;

    this.props.lastReviewedAt = timestamp;

    this.touch(timestamp);
  }

  // ===========================================================================
  // Re-verification
  // ===========================================================================

  /**
   * Opens a new verification cycle.
   *
   * Only REJECTED and EXPIRED may be reopened.
   *
   * Historical evidence timestamps and request records remain intact.
   */
  public reopen(at: Date = new Date()): void {
    const timestamp = VerificationEntity.requireValidTimestamp(
      at,
      'Verification reopening timestamp must be valid.',
    );

    if (!this.isRejected() && !this.isExpired()) {
      throw new VerificationInvalidStatusException(
        `Verification ${this.publicId.value} cannot be reopened from status ${this.props.status.value}.`,
      );
    }

    this.props.status = VerificationStatus.create('PENDING');

    this.props.level = VerificationLevel.create('NONE');

    delete this.props.verifiedAt;
    delete this.props.expiresAt;

    delete this.props.reviewedByPublicId;
    delete this.props.rejectionReason;
    delete this.props.lastReviewedAt;

    this.touch(timestamp);
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  public get createdAt(): Date {
    return VerificationEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return VerificationEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    VerificationEntity.ensureValidDate(
      updatedAt,
      'Verification updatedAt timestamp must be valid.',
    );

    if (updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new VerificationInvalidStatusException(
        'Verification updatedAt timestamp cannot occur before createdAt.',
      );
    }

    this.props.updatedAt = VerificationEntity.cloneDate(updatedAt);
  }

  public override touch(at: Date = new Date()): void {
    VerificationEntity.ensureValidDate(
      at,
      'Verification audit timestamp must be valid.',
    );

    if (at.getTime() < this.props.createdAt.getTime()) {
      throw new VerificationInvalidStatusException(
        'Verification update timestamp cannot occur before creation.',
      );
    }

    this.props.updatedAt = VerificationEntity.cloneDate(at);
  }

  // ===========================================================================
  // Equality
  // ===========================================================================

  public override equals(other?: VerificationEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ===========================================================================
  // State Validation
  // ===========================================================================

  private static validateState(props: VerificationValidationProps): void {
    const {
      status,
      level,

      profilePhotoVerified,
      governmentIdVerified,
      driverLicenseVerified,

      verifiedAt,
      expiresAt,

      memberVerifiedAt,
      driverVerifiedAt,

      profilePhotoVerifiedAt,
      governmentIdVerifiedAt,
      driverLicenseVerifiedAt,

      reviewedByPublicId,
      rejectionReason,
      lastReviewedAt,

      createdAt,
      updatedAt,
    } = props;

    // -------------------------------------------------------------------------
    // Required Value Objects
    // -------------------------------------------------------------------------

    if (status === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification status is required.',
      );
    }

    if (level === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification level is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Evidence Flags
    // -------------------------------------------------------------------------

    if (
      typeof profilePhotoVerified !== 'boolean' ||
      typeof governmentIdVerified !== 'boolean' ||
      typeof driverLicenseVerified !== 'boolean'
    ) {
      throw new VerificationInvalidStatusException(
        'Verification evidence flags must be boolean values.',
      );
    }

    // -------------------------------------------------------------------------
    // Timestamp Validity
    // -------------------------------------------------------------------------

    const timestamps: Array<[string, Date | undefined]> = [
      ['verifiedAt', verifiedAt],
      ['expiresAt', expiresAt],
      ['memberVerifiedAt', memberVerifiedAt],
      ['driverVerifiedAt', driverVerifiedAt],
      ['profilePhotoVerifiedAt', profilePhotoVerifiedAt],
      ['governmentIdVerifiedAt', governmentIdVerifiedAt],
      ['driverLicenseVerifiedAt', driverLicenseVerifiedAt],
      ['lastReviewedAt', lastReviewedAt],
      ['createdAt', createdAt],
      ['updatedAt', updatedAt],
    ];

    for (const [name, timestamp] of timestamps) {
      if (
        timestamp !== undefined &&
        (!(timestamp instanceof Date) || !Number.isFinite(timestamp.getTime()))
      ) {
        throw new VerificationInvalidStatusException(
          `Verification must have a valid ${name} timestamp.`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // Audit Chronology
    // -------------------------------------------------------------------------

    if (
      createdAt !== undefined &&
      updatedAt !== undefined &&
      updatedAt.getTime() < createdAt.getTime()
    ) {
      throw new VerificationInvalidStatusException(
        'Verification updatedAt timestamp cannot occur before createdAt.',
      );
    }

    // -------------------------------------------------------------------------
    // Evidence / Timestamp Consistency
    // -------------------------------------------------------------------------

    if (!profilePhotoVerified && profilePhotoVerifiedAt !== undefined) {
      throw new VerificationInvalidStatusException(
        'A verification cannot have profilePhotoVerifiedAt when profile photo verification is false.',
      );
    }

    if (!governmentIdVerified && governmentIdVerifiedAt !== undefined) {
      throw new VerificationInvalidStatusException(
        'A verification cannot have governmentIdVerifiedAt when government ID verification is false.',
      );
    }

    if (!driverLicenseVerified && driverLicenseVerifiedAt !== undefined) {
      throw new VerificationInvalidStatusException(
        'A verification cannot have driverLicenseVerifiedAt when driver license verification is false.',
      );
    }

    if (profilePhotoVerified && profilePhotoVerifiedAt === undefined) {
      throw new VerificationInvalidStatusException(
        'Accepted profile photo evidence must have a profilePhotoVerifiedAt timestamp.',
      );
    }

    if (governmentIdVerified && governmentIdVerifiedAt === undefined) {
      throw new VerificationInvalidStatusException(
        'Accepted government ID evidence must have a governmentIdVerifiedAt timestamp.',
      );
    }

    if (driverLicenseVerified && driverLicenseVerifiedAt === undefined) {
      throw new VerificationInvalidStatusException(
        'Accepted driver license evidence must have a driverLicenseVerifiedAt timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // Level / Evidence Consistency
    // -------------------------------------------------------------------------

    if (level.isMember() && !profilePhotoVerified && !governmentIdVerified) {
      throw new VerificationInvalidStatusException(
        'MEMBER verification level requires accepted profile photo or government ID evidence.',
      );
    }

    if (level.isDriver() && !driverLicenseVerified) {
      throw new VerificationInvalidStatusException(
        'DRIVER verification level requires accepted driver license evidence.',
      );
    }

    // -------------------------------------------------------------------------
    // VERIFIED
    // -------------------------------------------------------------------------

    if (status.isVerified()) {
      if (level.isNone()) {
        throw new VerificationInvalidStatusException(
          'A VERIFIED verification cannot have NONE verification level.',
        );
      }

      if (verifiedAt === undefined) {
        throw new VerificationInvalidStatusException(
          'A VERIFIED verification must have a verifiedAt timestamp.',
        );
      }

      if (reviewedByPublicId === undefined) {
        throw new VerificationInvalidStatusException(
          'A VERIFIED verification must have a reviewer.',
        );
      }

      if (lastReviewedAt === undefined) {
        throw new VerificationInvalidStatusException(
          'A VERIFIED verification must have a lastReviewedAt timestamp.',
        );
      }

      if (rejectionReason !== undefined) {
        throw new VerificationInvalidStatusException(
          'A VERIFIED verification cannot have a rejection reason.',
        );
      }

      if (level.isMember() && memberVerifiedAt === undefined) {
        throw new VerificationInvalidStatusException(
          'A MEMBER verification must retain memberVerifiedAt.',
        );
      }

      if (level.isDriver() && driverVerifiedAt === undefined) {
        throw new VerificationInvalidStatusException(
          'A DRIVER verification must retain driverVerifiedAt.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // PENDING
    // -------------------------------------------------------------------------

    if (status.isPending()) {
      if (!level.isNone()) {
        throw new VerificationInvalidStatusException(
          'A PENDING verification must have NONE verification level.',
        );
      }

      if (verifiedAt !== undefined) {
        throw new VerificationInvalidStatusException(
          'A PENDING verification cannot have a verifiedAt timestamp.',
        );
      }

      if (expiresAt !== undefined) {
        throw new VerificationInvalidStatusException(
          'A PENDING verification cannot have an expiresAt timestamp.',
        );
      }

      if (reviewedByPublicId !== undefined) {
        throw new VerificationInvalidStatusException(
          'A PENDING verification cannot have a reviewer.',
        );
      }

      if (rejectionReason !== undefined) {
        throw new VerificationInvalidStatusException(
          'A PENDING verification cannot have a rejection reason.',
        );
      }

      if (lastReviewedAt !== undefined) {
        throw new VerificationInvalidStatusException(
          'A PENDING verification cannot have a lastReviewedAt timestamp.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // REJECTED
    // -------------------------------------------------------------------------

    if (status.isRejected()) {
      if (!level.isNone()) {
        throw new VerificationInvalidStatusException(
          'A REJECTED verification must have NONE verification level.',
        );
      }

      if (
        rejectionReason === undefined ||
        rejectionReason.trim().length === 0
      ) {
        throw new VerificationInvalidStatusException(
          'A REJECTED verification must have a rejection reason.',
        );
      }

      if (reviewedByPublicId === undefined) {
        throw new VerificationInvalidStatusException(
          'A REJECTED verification must have a reviewer.',
        );
      }

      if (lastReviewedAt === undefined) {
        throw new VerificationInvalidStatusException(
          'A REJECTED verification must have a lastReviewedAt timestamp.',
        );
      }

      if (verifiedAt !== undefined) {
        throw new VerificationInvalidStatusException(
          'A REJECTED verification cannot have a verifiedAt timestamp.',
        );
      }

      if (expiresAt !== undefined) {
        throw new VerificationInvalidStatusException(
          'A REJECTED verification cannot have an expiresAt timestamp.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // EXPIRED
    // -------------------------------------------------------------------------

    if (status.isExpired()) {
      if (!level.isNone()) {
        throw new VerificationInvalidStatusException(
          'An EXPIRED verification must have NONE verification level.',
        );
      }

      if (verifiedAt === undefined) {
        throw new VerificationInvalidStatusException(
          'An EXPIRED verification must retain its verifiedAt timestamp.',
        );
      }

      if (expiresAt === undefined) {
        throw new VerificationInvalidStatusException(
          'An EXPIRED verification must have an expiresAt timestamp.',
        );
      }

      if (expiresAt.getTime() <= verifiedAt.getTime()) {
        throw new VerificationInvalidStatusException(
          'An EXPIRED verification must have an expiration after verification.',
        );
      }

      if (reviewedByPublicId === undefined) {
        throw new VerificationInvalidStatusException(
          'An EXPIRED verification must retain its reviewer.',
        );
      }

      if (lastReviewedAt === undefined) {
        throw new VerificationInvalidStatusException(
          'An EXPIRED verification must retain its lastReviewedAt timestamp.',
        );
      }

      if (rejectionReason !== undefined) {
        throw new VerificationInvalidStatusException(
          'An EXPIRED verification cannot have a rejection reason.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // REVOKED
    // -------------------------------------------------------------------------

    if (status.isRevoked()) {
      if (!level.isNone()) {
        throw new VerificationInvalidStatusException(
          'A REVOKED verification must have NONE verification level.',
        );
      }

      if (verifiedAt === undefined) {
        throw new VerificationInvalidStatusException(
          'A REVOKED verification must retain its verifiedAt timestamp.',
        );
      }

      if (reviewedByPublicId === undefined) {
        throw new VerificationInvalidStatusException(
          'A REVOKED verification must have a reviewer.',
        );
      }

      if (
        rejectionReason === undefined ||
        rejectionReason.trim().length === 0
      ) {
        throw new VerificationInvalidStatusException(
          'A REVOKED verification must have a revocation reason.',
        );
      }

      if (lastReviewedAt === undefined) {
        throw new VerificationInvalidStatusException(
          'A REVOKED verification must have a lastReviewedAt timestamp.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Verification Chronology
    // -------------------------------------------------------------------------

    if (
      verifiedAt !== undefined &&
      expiresAt !== undefined &&
      expiresAt.getTime() <= verifiedAt.getTime()
    ) {
      throw new VerificationInvalidStatusException(
        'Verification expiration must occur after verification.',
      );
    }

    if (
      verifiedAt !== undefined &&
      lastReviewedAt !== undefined &&
      lastReviewedAt.getTime() < verifiedAt.getTime()
    ) {
      throw new VerificationInvalidStatusException(
        'Verification review cannot occur before verification.',
      );
    }

    // -------------------------------------------------------------------------
    // Evidence Chronology
    // -------------------------------------------------------------------------

    if (
      memberVerifiedAt !== undefined &&
      profilePhotoVerifiedAt !== undefined &&
      profilePhotoVerifiedAt.getTime() > memberVerifiedAt.getTime() &&
      governmentIdVerifiedAt === undefined
    ) {
      throw new VerificationInvalidStatusException(
        'Member verification cannot occur before the accepted evidence supporting it.',
      );
    }

    if (
      memberVerifiedAt !== undefined &&
      governmentIdVerifiedAt !== undefined &&
      governmentIdVerifiedAt.getTime() > memberVerifiedAt.getTime() &&
      profilePhotoVerifiedAt === undefined
    ) {
      throw new VerificationInvalidStatusException(
        'Member verification cannot occur before the accepted evidence supporting it.',
      );
    }

    if (
      memberVerifiedAt !== undefined &&
      profilePhotoVerifiedAt !== undefined &&
      governmentIdVerifiedAt !== undefined &&
      profilePhotoVerifiedAt.getTime() > memberVerifiedAt.getTime() &&
      governmentIdVerifiedAt.getTime() > memberVerifiedAt.getTime()
    ) {
      throw new VerificationInvalidStatusException(
        'Member verification requires at least one accepted evidence timestamp on or before member verification.',
      );
    }

    if (
      driverVerifiedAt !== undefined &&
      driverLicenseVerifiedAt !== undefined &&
      driverLicenseVerifiedAt.getTime() > driverVerifiedAt.getTime()
    ) {
      throw new VerificationInvalidStatusException(
        'Driver license evidence acceptance cannot occur after driver verification.',
      );
    }

    // -------------------------------------------------------------------------
    // Aggregate Verification Timestamp Consistency
    // -------------------------------------------------------------------------

    if (
      status.isVerified() &&
      level.isMember() &&
      memberVerifiedAt !== undefined &&
      verifiedAt !== undefined &&
      memberVerifiedAt.getTime() !== verifiedAt.getTime()
    ) {
      throw new VerificationInvalidStatusException(
        'Current MEMBER verification must have memberVerifiedAt equal to verifiedAt.',
      );
    }

    if (
      status.isVerified() &&
      level.isDriver() &&
      driverVerifiedAt !== undefined &&
      verifiedAt !== undefined &&
      driverVerifiedAt.getTime() !== verifiedAt.getTime()
    ) {
      throw new VerificationInvalidStatusException(
        'Current DRIVER verification must have driverVerifiedAt equal to verifiedAt.',
      );
    }
  }

  // ===========================================================================
  // Request Validation
  // ===========================================================================

  private static validateRequests(
    requests: readonly VerificationRequestEntity[],
    verificationPublicId: VerificationPublicId,
  ): void {
    if (!Array.isArray(requests)) {
      throw new VerificationInvalidStatusException(
        'Verification requests must be an array.',
      );
    }

    const requestPublicIds = new Set<string>();

    for (const request of requests) {
      if (request === undefined) {
        throw new VerificationInvalidStatusException(
          'Verification request collection cannot contain undefined entries.',
        );
      }

      if (!request.verificationPublicId.equals(verificationPublicId)) {
        throw new VerificationInvalidStatusException(
          `Verification request ${request.publicId.value} does not belong to verification ${verificationPublicId.value}.`,
        );
      }

      const requestPublicId = request.publicId.value;

      if (requestPublicIds.has(requestPublicId)) {
        throw new VerificationInvalidStatusException(
          `Duplicate verification request ${requestPublicId} is not allowed.`,
        );
      }

      requestPublicIds.add(requestPublicId);
    }
  }

  // ===========================================================================
  // Internal Guards
  // ===========================================================================

  private ensurePendingForVerification(): void {
    if (!this.isPending()) {
      throw new VerificationInvalidStatusException(
        `Verification ${this.publicId.value} cannot be verified from status ${this.props.status.value}.`,
      );
    }
  }

  private ensurePendingForReview(): void {
    if (!this.isPending()) {
      throw new VerificationInvalidStatusException(
        `Verification ${this.publicId.value} cannot be reviewed from status ${this.props.status.value}.`,
      );
    }
  }

  private ensureNotRevoked(message: string): void {
    if (this.isRevoked()) {
      throw new VerificationInvalidStatusException(message);
    }
  }

  private ensureReviewer(reviewedByPublicId: IdentityPublicId): void {
    if (reviewedByPublicId === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification reviewer public ID is required.',
      );
    }
  }

  // ===========================================================================
  // Evidence Recording
  // ===========================================================================

  private recordEvidence(
    type: 'PROFILE_PHOTO' | 'GOVERNMENT_ID' | 'DRIVER_LICENSE',
    at: Date,
  ): void {
    this.ensureNotRevoked(
      'Accepted evidence cannot be recorded for a revoked verification.',
    );

    const timestamp = VerificationEntity.requireValidTimestamp(
      at,
      'Verification evidence timestamp must be valid.',
    );

    switch (type) {
      case 'PROFILE_PHOTO': {
        if (this.props.profilePhotoVerified) {
          return;
        }

        this.props.profilePhotoVerified = true;

        this.props.profilePhotoVerifiedAt = timestamp;

        break;
      }

      case 'GOVERNMENT_ID': {
        if (this.props.governmentIdVerified) {
          return;
        }

        this.props.governmentIdVerified = true;

        this.props.governmentIdVerifiedAt = timestamp;

        break;
      }

      case 'DRIVER_LICENSE': {
        if (this.props.driverLicenseVerified) {
          return;
        }

        this.props.driverLicenseVerified = true;

        this.props.driverLicenseVerifiedAt = timestamp;

        break;
      }
    }

    this.touch(timestamp);
  }

  // ===========================================================================
  // Expiration Helper
  // ===========================================================================

  private resolveExpiration(
    verifiedAt: Date,
    expiresAt?: Date,
  ): Date | undefined {
    if (expiresAt === undefined) {
      return undefined;
    }

    const expiration = VerificationEntity.cloneDate(expiresAt);

    VerificationEntity.ensureValidDate(
      expiration,
      'Verification expiration must be a valid timestamp.',
    );

    if (expiration.getTime() <= verifiedAt.getTime()) {
      throw new VerificationInvalidStatusException(
        'Verification expiration must occur after verification.',
      );
    }

    return expiration;
  }

  // ===========================================================================
  // Validation Helpers
  // ===========================================================================

  private static requireValidTimestamp(date: Date, message: string): Date {
    VerificationEntity.ensureValidDate(date, message);

    return VerificationEntity.cloneDate(date);
  }

  private static ensureValidDate(date: Date, message: string): void {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
      throw new VerificationInvalidStatusException(message);
    }
  }

  private static optionalDate(date: Date | undefined): Date | undefined {
    return date !== undefined ? VerificationEntity.cloneDate(date) : undefined;
  }

  private static normalizeReason(reason: string): string {
    if (typeof reason !== 'string') {
      return '';
    }

    return reason.trim();
  }

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}
