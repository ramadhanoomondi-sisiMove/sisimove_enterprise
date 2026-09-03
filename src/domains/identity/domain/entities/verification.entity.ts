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
// VerificationEntity owns the verification lifecycle and all aggregate-level
// verification decisions.
//
// IMPORTANT:
//
// VerificationRequestEntity.approve()
// does NOT automatically verify the aggregate.
//
// Request approval means:
//
//     "The submitted evidence in this request has been accepted."
//
// Aggregate verification means:
//
//     "The Identity has been officially verified at a verification level."
//
// Therefore:
//
//     VerificationRequestEntity.approve()
//             ↓
//     accepted evidence
//             ↓
//     VerificationEntity.verifyMember()
//     VerificationEntity.verifyDriver()
//             ↓
//     official aggregate verification
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
// Request lifecycle:
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
// Evidence does NOT independently transition the aggregate to VERIFIED.
//
// -----------------------------------------------------------------------------
//
// Re-verification:
//
// REJECTED and EXPIRED may be reopened.
//
// Historical accepted evidence remains retained.
// Historical request entities remain retained.
// Historical verification timestamps remain retained.
//
// REVOKED is terminal.
//
// -----------------------------------------------------------------------------
//
// Persistence compatibility:
//
// rejectionReason is intentionally used for:
//
// REJECTED -> rejection reason
// REVOKED  -> revocation reason
//
// This preserves the existing persistence contract.
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
  // Current Verification State
  // ---------------------------------------------------------------------------

  status: VerificationStatus;

  level: VerificationLevel;

  // ---------------------------------------------------------------------------
  // Accepted Evidence
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

  // ---------------------------------------------------------------------------
  // Evidence Timestamps
  // ---------------------------------------------------------------------------

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
// Creation Properties
// -----------------------------------------------------------------------------

export interface CreateVerificationProps {
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
}

// -----------------------------------------------------------------------------
// Validation Properties
// -----------------------------------------------------------------------------
//
// With:
//
//     exactOptionalPropertyTypes: true
//
// `foo?: Date` means the property may be omitted.
//
// The validation object deliberately contains the property even when its
// value is undefined, therefore the validation contract must explicitly use:
//
//     foo: Date | undefined
//
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

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Aggregate Root
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

  public static create(props: CreateVerificationProps): VerificationEntity {
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

    const createdAt = VerificationEntity.cloneDate(props.createdAt ?? now);

    const updatedAt = VerificationEntity.cloneDate(
      props.updatedAt ?? createdAt,
    );

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

    const reviewedByPublicId = props.reviewedByPublicId;

    const rejectionReason =
      props.rejectionReason !== undefined
        ? VerificationEntity.normalizeReason(props.rejectionReason)
        : undefined;

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

      reviewedByPublicId,
      rejectionReason,
      lastReviewedAt,

      createdAt,
      updatedAt,
    });

    const requests = [...(props.requests ?? [])];

    VerificationEntity.validateRequests(requests);

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

        ...(reviewedByPublicId !== undefined ? { reviewedByPublicId } : {}),

        ...(rejectionReason !== undefined ? { rejectionReason } : {}),

        ...(lastReviewedAt !== undefined ? { lastReviewedAt } : {}),

        requests,

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

    const reviewedByPublicId = props.reviewedByPublicId;

    const rejectionReason =
      props.rejectionReason !== undefined
        ? VerificationEntity.normalizeReason(props.rejectionReason)
        : undefined;

    const normalizedProps: VerificationValidationProps = {
      status: props.status,
      level: props.level,

      profilePhotoVerified: props.profilePhotoVerified,
      governmentIdVerified: props.governmentIdVerified,
      driverLicenseVerified: props.driverLicenseVerified,

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
    };

    VerificationEntity.validateState(normalizedProps);

    const requests = [...props.requests];

    VerificationEntity.validateRequests(requests);

    return new VerificationEntity(
      {
        publicId,

        identityPublicId: props.identityPublicId,

        status: props.status,
        level: props.level,

        profilePhotoVerified: props.profilePhotoVerified,
        governmentIdVerified: props.governmentIdVerified,
        driverLicenseVerified: props.driverLicenseVerified,

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

        ...(reviewedByPublicId !== undefined ? { reviewedByPublicId } : {}),

        ...(rejectionReason !== undefined ? { rejectionReason } : {}),

        ...(lastReviewedAt !== undefined ? { lastReviewedAt } : {}),

        requests,

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

  public isActive(at: Date = new Date()): boolean {
    const timestamp = VerificationEntity.requireValidTimestamp(
      at,
      'Verification active-state timestamp must be valid.',
    );

    return this.isVerified() && !this.hasExpired(timestamp);
  }

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

  public get requests(): readonly VerificationRequestEntity[] {
    return [...this.props.requests];
  }

  public addRequest(
    request: VerificationRequestEntity,
    at: Date = new Date(),
  ): void {
    if (request === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification request entity is required.',
      );
    }

    const timestamp = this.requireOperationTimestamp(
      at,
      'Verification request addition timestamp must be valid.',
    );

    this.ensurePendingForRequestMutation();

    if (!request.verificationPublicId.equals(this.publicId)) {
      throw new VerificationInvalidStatusException(
        `Verification request ${request.publicId.value} does not belong to verification ${this.publicId.value}.`,
      );
    }

    const alreadyExists = this.props.requests.some(
      (existingRequest: VerificationRequestEntity) =>
        existingRequest.publicId.equals(request.publicId),
    );

    if (alreadyExists) {
      return;
    }

    this.props.requests.push(request);

    this.touch(timestamp);
  }

  public findRequest(publicId: string): VerificationRequestEntity | undefined {
    if (typeof publicId !== 'string' || publicId.trim().length === 0) {
      return undefined;
    }

    const normalizedPublicId = publicId.trim();

    return this.props.requests.find(
      (request: VerificationRequestEntity) =>
        request.publicId.value === normalizedPublicId,
    );
  }

  public findRequestsByType(
    type: VerificationRequestEntity['type'],
  ): readonly VerificationRequestEntity[] {
    if (type === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification request type is required.',
      );
    }

    return this.props.requests.filter((request: VerificationRequestEntity) =>
      request.type.equals(type),
    );
  }

  public findPendingRequestByType(
    type: VerificationRequestEntity['type'],
  ): VerificationRequestEntity | undefined {
    if (type === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification request type is required.',
      );
    }

    return this.props.requests.find(
      (request: VerificationRequestEntity) =>
        request.type.equals(type) && request.isPending(),
    );
  }

  public hasPendingRequest(type: VerificationRequestEntity['type']): boolean {
    return this.findPendingRequestByType(type) !== undefined;
  }

  // ===========================================================================
  // Aggregate-Level Verification
  // ===========================================================================

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

    const timestamp = this.requireOperationTimestamp(
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

    const timestamp = this.requireOperationTimestamp(
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

  public verifyProfilePhoto(at: Date = new Date()): void {
    this.recordEvidence('PROFILE_PHOTO', at);
  }

  public verifyGovernmentId(at: Date = new Date()): void {
    this.recordEvidence('GOVERNMENT_ID', at);
  }

  public verifyDriverLicense(at: Date = new Date()): void {
    this.recordEvidence('DRIVER_LICENSE', at);
  }

  // ===========================================================================
  // Aggregate Rejection
  // ===========================================================================

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

    const timestamp = this.requireOperationTimestamp(
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
    const timestamp = VerificationEntity.requireValidTimestamp(
      at,
      'Verification expiration evaluation timestamp must be valid.',
    );

    if (this.props.expiresAt === undefined) {
      return false;
    }

    return timestamp.getTime() >= this.props.expiresAt.getTime();
  }

  public expire(at: Date = new Date()): void {
    const timestamp = this.requireOperationTimestamp(
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

    const timestamp = this.requireOperationTimestamp(
      at,
      'Verification revocation timestamp must be valid.',
    );

    this.props.status = VerificationStatus.create('REVOKED');

    this.props.level = VerificationLevel.create('NONE');

    this.props.reviewedByPublicId = reviewedByPublicId;

    // Persistence compatibility:
    // rejectionReason stores the revocation reason in REVOKED state.
    this.props.rejectionReason = normalizedReason;

    this.props.lastReviewedAt = timestamp;

    // The verification is no longer active after revocation.
    delete this.props.expiresAt;

    this.touch(timestamp);
  }

  // ===========================================================================
  // Re-verification
  // ===========================================================================

  public reopen(at: Date = new Date()): void {
    const timestamp = this.requireOperationTimestamp(
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

    this.ensureOperationNotBeforeCreation(at);

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
    // Required Audit Dates
    // -------------------------------------------------------------------------

    VerificationEntity.ensureValidDate(
      createdAt,
      'Verification createdAt timestamp must be valid.',
    );

    VerificationEntity.ensureValidDate(
      updatedAt,
      'Verification updatedAt timestamp must be valid.',
    );

    // -------------------------------------------------------------------------
    // Optional Timestamp Validity
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
    ];

    for (const [name, timestamp] of timestamps) {
      if (timestamp !== undefined) {
        VerificationEntity.ensureValidDate(
          timestamp,
          `Verification ${name} timestamp must be valid.`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // Audit Chronology
    // -------------------------------------------------------------------------

    if (updatedAt.getTime() < createdAt.getTime()) {
      throw new VerificationInvalidStatusException(
        'Verification updatedAt timestamp cannot occur before createdAt.',
      );
    }

    // -------------------------------------------------------------------------
    // Historical Timestamp Boundaries
    // -------------------------------------------------------------------------

    for (const [name, timestamp] of timestamps) {
      if (
        timestamp !== undefined &&
        timestamp.getTime() < createdAt.getTime()
      ) {
        throw new VerificationInvalidStatusException(
          `${name} cannot occur before verification creation.`,
        );
      }

      if (
        timestamp !== undefined &&
        timestamp.getTime() > updatedAt.getTime()
      ) {
        throw new VerificationInvalidStatusException(
          `${name} cannot occur after verification updatedAt.`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // Evidence / Timestamp Consistency
    // -------------------------------------------------------------------------

    VerificationEntity.validateEvidencePair(
      profilePhotoVerified,
      profilePhotoVerifiedAt,
      'profile photo',
      'profilePhotoVerifiedAt',
    );

    VerificationEntity.validateEvidencePair(
      governmentIdVerified,
      governmentIdVerifiedAt,
      'government ID',
      'governmentIdVerifiedAt',
    );

    VerificationEntity.validateEvidencePair(
      driverLicenseVerified,
      driverLicenseVerifiedAt,
      'driver license',
      'driverLicenseVerifiedAt',
    );

    // -------------------------------------------------------------------------
    // Historical Verification Timestamp Consistency
    // -------------------------------------------------------------------------

    if (memberVerifiedAt !== undefined) {
      if (!profilePhotoVerified && !governmentIdVerified) {
        throw new VerificationInvalidStatusException(
          'Member verification requires supporting accepted evidence.',
        );
      }

      const supportingEvidence: Date[] = [];

      if (profilePhotoVerifiedAt !== undefined) {
        supportingEvidence.push(profilePhotoVerifiedAt);
      }

      if (governmentIdVerifiedAt !== undefined) {
        supportingEvidence.push(governmentIdVerifiedAt);
      }

      const supported = supportingEvidence.some(
        (evidenceAt) => evidenceAt.getTime() <= memberVerifiedAt.getTime(),
      );

      if (!supported) {
        throw new VerificationInvalidStatusException(
          'Member verification requires at least one supporting evidence timestamp on or before member verification.',
        );
      }
    }

    if (driverVerifiedAt !== undefined) {
      if (!driverLicenseVerified || driverLicenseVerifiedAt === undefined) {
        throw new VerificationInvalidStatusException(
          'Driver verification requires accepted driver license evidence.',
        );
      }

      if (driverLicenseVerifiedAt.getTime() > driverVerifiedAt.getTime()) {
        throw new VerificationInvalidStatusException(
          'Driver license evidence acceptance cannot occur after driver verification.',
        );
      }
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

      if (level.isMember()) {
        if (memberVerifiedAt === undefined) {
          throw new VerificationInvalidStatusException(
            'A MEMBER verification must have memberVerifiedAt.',
          );
        }

        if (memberVerifiedAt.getTime() !== verifiedAt.getTime()) {
          throw new VerificationInvalidStatusException(
            'Current MEMBER verification must have memberVerifiedAt equal to verifiedAt.',
          );
        }
      }

      if (level.isDriver()) {
        if (driverVerifiedAt === undefined) {
          throw new VerificationInvalidStatusException(
            'A DRIVER verification must have driverVerifiedAt.',
          );
        }

        if (driverVerifiedAt.getTime() !== verifiedAt.getTime()) {
          throw new VerificationInvalidStatusException(
            'Current DRIVER verification must have driverVerifiedAt equal to verifiedAt.',
          );
        }
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
          'An EXPIRED verification must retain its expiresAt timestamp.',
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

      if (expiresAt !== undefined) {
        throw new VerificationInvalidStatusException(
          'A REVOKED verification cannot have an active expiration timestamp.',
        );
      }
    }
  }

  // ===========================================================================
  // Request Validation
  // ===========================================================================
  //
  // Request ownership validation is intentionally handled when a request is
  // added through addRequest().
  //
  // This method currently validates only the collection boundary. It does not
  // access members on VerificationRequestEntity, which prevents this aggregate
  // from masking an upstream type-resolution problem in that entity.
  //
  // The VerificationRequestEntity itself must still be strongly typed.
  // ===========================================================================

  private static validateRequests(
    requests: readonly VerificationRequestEntity[],
  ): void {
    if (!Array.isArray(requests)) {
      throw new VerificationInvalidStatusException(
        'Verification requests must be an array.',
      );
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

  private ensurePendingForRequestMutation(): void {
    if (!this.isPending()) {
      throw new VerificationInvalidStatusException(
        `Verification ${this.publicId.value} cannot accept verification requests from status ${this.props.status.value}.`,
      );
    }
  }

  private ensureReviewer(reviewedByPublicId: IdentityPublicId): void {
    if (reviewedByPublicId === undefined) {
      throw new VerificationInvalidStatusException(
        'Verification reviewer public ID is required.',
      );
    }
  }

  private ensureOperationNotBeforeCreation(at: Date): void {
    if (at.getTime() < this.props.createdAt.getTime()) {
      throw new VerificationInvalidStatusException(
        'Verification operation timestamp cannot occur before creation.',
      );
    }
  }

  private requireOperationTimestamp(at: Date, message: string): Date {
    const timestamp = VerificationEntity.requireValidTimestamp(at, message);

    this.ensureOperationNotBeforeCreation(timestamp);

    return timestamp;
  }

  // ===========================================================================
  // Evidence Recording
  // ===========================================================================

  private recordEvidence(
    type: 'PROFILE_PHOTO' | 'GOVERNMENT_ID' | 'DRIVER_LICENSE',
    at: Date,
  ): void {
    const timestamp = this.requireOperationTimestamp(
      at,
      'Verification evidence timestamp must be valid.',
    );

    if (!this.isPending()) {
      throw new VerificationInvalidStatusException(
        `Accepted evidence cannot be recorded while verification is ${this.props.status.value}.`,
      );
    }

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

      default: {
        const exhaustiveType: never = type;

        throw new VerificationInvalidStatusException(
          `Unsupported verification evidence type: ${String(exhaustiveType)}.`,
        );
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

    if (expiration.getTime() < this.props.createdAt.getTime()) {
      throw new VerificationInvalidStatusException(
        'Verification expiration cannot occur before verification creation.',
      );
    }

    return expiration;
  }

  // ===========================================================================
  // Validation Helpers
  // ===========================================================================

  private static validateEvidencePair(
    verified: boolean,
    verifiedAt: Date | undefined,
    label: string,
    timestampName: string,
  ): void {
    if (!verified && verifiedAt !== undefined) {
      throw new VerificationInvalidStatusException(
        `A verification cannot have ${timestampName} when ${label} verification is false.`,
      );
    }

    if (verified && verifiedAt === undefined) {
      throw new VerificationInvalidStatusException(
        `Accepted ${label} evidence must have a ${timestampName} timestamp.`,
      );
    }
  }

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
