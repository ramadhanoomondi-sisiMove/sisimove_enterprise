// src/domains/identity/domain/aggregates/verification.aggregate.ts

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { VerificationRequestEntity } from '../entities/verification-request.entity';

import { VerificationStartedEvent } from '../events/verification-started.event';

import type { IdentityId } from '../value-objects/identity-id.vo';
import { VerificationId } from '../value-objects/verification-id.vo';

import { VerificationLevel } from '../enums/verification-level.enum';
import { VerificationStatus } from '../enums/verification-status.enum';
// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import { VerificationRequestAlreadyExistsException } from '../exceptions/verification-request-already-exists.exception';
import { VerificationRequestNotFoundException } from '../exceptions/verification-request-not-found.exception';

import { VerificationRequestSubmittedEvent } from '../events/verification-request-submitted.event';

import type { VerificationRequestId } from '../value-objects/verification-request-id.vo';
import { VerificationRequestStatus } from '../enums/verification-request-status.enum';
import { VerificationRequestType } from '../enums/verification-request-type.enum';
import { VerificationRequestApprovedEvent } from '../events/verification-request-approved.event';
import { VerificationRequestRejectedEvent } from '../events/verification-request-rejected.event';

import { VerificationApprovedEvent } from '../events/verification-approved.event';
import { VerificationLevelChangedEvent } from '../events/verification-level-changed.event';

import { VerificationAlreadyVerifiedException } from '../exceptions/verification-already-verified.exception';
import { VerificationAlreadyExpiredException } from '../exceptions/verification-already-expired.exception';

import { VerificationExpiredEvent } from '../events/verification-expired.event';
import { VerificationRenewedEvent } from '../events/verification-renewed.event';

import { VerificationRevokedEvent } from '../events/verification-revoked.event';
import { VerificationAlreadyRevokedException } from '../exceptions/verification-already-revoked.exception';

interface VerificationProps {
  identityId: IdentityId;

  status: VerificationStatus;
  level: VerificationLevel;

  profilePhotoVerified: boolean;
  governmentIdVerified: boolean;
  driverLicenseVerified: boolean;

  verifiedAt?: Date;
  expiresAt?: Date;

  reviewedById?: IdentityId;

  rejectionReason?: string;
  lastReviewedAt?: Date;

  requests: VerificationRequestEntity[];

  createdAt: Date;
  updatedAt: Date;
}

export class VerificationAggregate extends AggregateRoot<VerificationProps> {
  public constructor(
    props: VerificationProps,
    id?: UniqueEntityId,
    publicId?: VerificationId,
  ) {
    super(props, id, publicId);
  }

  static create(
    identityId: IdentityId,
    correlationId: string,
  ): VerificationAggregate {
    const now = new Date();

    const verification = new VerificationAggregate(
      {
        identityId,

        status: VerificationStatus.PENDING,
        level: VerificationLevel.NONE,

        profilePhotoVerified: false,
        governmentIdVerified: false,
        driverLicenseVerified: false,

        requests: [],

        createdAt: now,
        updatedAt: now,
      },
      new UniqueEntityId(),
      new VerificationId(),
    );

    verification.addDomainEvent(
      new VerificationStartedEvent(
        verification.id.value,
        verification.publicId.value,
        identityId.value,
        correlationId,
      ),
    );

    return verification;
  }

  get identityId(): IdentityId {
    return this.props.identityId;
  }

  get status(): VerificationStatus {
    return this.props.status;
  }

  get level(): VerificationLevel {
    return this.props.level;
  }

  get profilePhotoVerified(): boolean {
    return this.props.profilePhotoVerified;
  }

  get governmentIdVerified(): boolean {
    return this.props.governmentIdVerified;
  }

  get driverLicenseVerified(): boolean {
    return this.props.driverLicenseVerified;
  }

  get verifiedAt(): Date | undefined {
    return this.props.verifiedAt;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  get reviewedById(): IdentityId | undefined {
    return this.props.reviewedById;
  }

  get rejectionReason(): string | undefined {
    return this.props.rejectionReason;
  }

  get lastReviewedAt(): Date | undefined {
    return this.props.lastReviewedAt;
  }

  get requests(): readonly VerificationRequestEntity[] {
    return [...this.props.requests];
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }

  // -----------------------------------------------------------------------------
  // Request Management
  // -----------------------------------------------------------------------------

  public submitRequest(
    request: VerificationRequestEntity,
    correlationId: string,
  ): void {
    if (this.hasPendingRequest(request.type)) {
      throw new VerificationRequestAlreadyExistsException(request.type);
    }

    this.props.requests.push(request);

    this.touch();

    this.addDomainEvent(
      new VerificationRequestSubmittedEvent(
        this.id.value,
        this.publicId.value,
        request.publicId.value,
        request.type,
        request.assetId.value,
        correlationId,
      ),
    );
  }

  private findRequest(
    requestId: VerificationRequestId,
  ): VerificationRequestEntity {
    const request = this.props.requests.find((item) =>
      item.publicId.equals(requestId),
    );

    if (!request) {
      throw new VerificationRequestNotFoundException(requestId.value);
    }

    return request;
  }

  private hasPendingRequest(type: VerificationRequestType): boolean {
    return this.props.requests.some(
      (request) =>
        request.type === type &&
        request.status === VerificationRequestStatus.PENDING,
    );
  }

  // -----------------------------------------------------------------------------
  // Request Review
  // -----------------------------------------------------------------------------

  public approveRequest(
    requestId: VerificationRequestId,
    reviewerId: IdentityId,
    correlationId: string,
  ): void {
    const request = this.findRequest(requestId);

    request.approve(reviewerId);

    this.markReviewed(reviewerId);

    this.addDomainEvent(
      new VerificationRequestApprovedEvent(
        this.id.value,
        this.publicId.value,
        request.publicId.value,
        request.type,
        reviewerId.value,
        correlationId,
      ),
    );

    this.refreshVerificationFlags();

    this.evaluateLevel(correlationId);
  }

  public rejectRequest(
    requestId: VerificationRequestId,
    reviewerId: IdentityId,
    reason: string,
    correlationId: string,
  ): void {
    const request = this.findRequest(requestId);

    request.reject(reviewerId, reason);

    this.markReviewed(reviewerId, reason);

    this.addDomainEvent(
      new VerificationRequestRejectedEvent(
        this.id.value,
        this.publicId.value,
        request.publicId.value,
        request.type,
        reviewerId.value,
        reason,
        correlationId,
      ),
    );

    this.refreshVerificationFlags();

    this.evaluateLevel(correlationId);
  }

  private markReviewed(reviewerId: IdentityId, rejectionReason?: string): void {
    this.props.reviewedById = reviewerId;
    this.props.lastReviewedAt = new Date();

    if (rejectionReason !== undefined) {
      this.props.rejectionReason = rejectionReason;
    } else {
      delete this.props.rejectionReason;
    }

    this.touch();
  }

  // -----------------------------------------------------------------------------
  // Verification Evaluation
  // -----------------------------------------------------------------------------

  private refreshVerificationFlags(): void {
    this.props.profilePhotoVerified = this.hasApprovedRequest(
      VerificationRequestType.PROFILE_PHOTO,
    );

    this.props.governmentIdVerified = this.hasApprovedRequest(
      VerificationRequestType.GOVERNMENT_ID,
    );

    this.props.driverLicenseVerified = this.hasApprovedRequest(
      VerificationRequestType.DRIVER_LICENSE,
    );
  }

  private hasApprovedRequest(type: VerificationRequestType): boolean {
    return this.props.requests.some(
      (request) =>
        request.type === type &&
        request.status === VerificationRequestStatus.APPROVED,
    );
  }

  private evaluateLevel(correlationId: string): void {
    if (this.canBecomeDriver()) {
      this.setLevel(VerificationLevel.DRIVER, correlationId);
    } else if (this.canBecomeMember()) {
      this.setLevel(VerificationLevel.MEMBER, correlationId);
    } else {
      this.setLevel(VerificationLevel.NONE, correlationId);
    }

    if (
      this.props.status !== VerificationStatus.VERIFIED &&
      this.isEligibleForVerification()
    ) {
      this.approve(correlationId);
    }
  }

  private setLevel(level: VerificationLevel, correlationId: string): void {
    if (this.props.level === level) {
      return;
    }

    const previousLevel = this.props.level;

    this.props.level = level;

    this.touch();

    this.addDomainEvent(
      new VerificationLevelChangedEvent(
        this.id.value,
        this.publicId.value,
        previousLevel,
        level,
        correlationId,
      ),
    );
  }

  private approve(correlationId: string): void {
    if (this.props.status === VerificationStatus.VERIFIED) {
      throw new VerificationAlreadyVerifiedException();
    }

    const now = new Date();

    this.props.status = VerificationStatus.VERIFIED;
    this.props.verifiedAt = now;

    delete this.props.rejectionReason;

    this.touch();

    this.addDomainEvent(
      new VerificationApprovedEvent(
        this.id.value,
        this.publicId.value,
        this.props.level,
        now,
        this.props.expiresAt,
        correlationId,
      ),
    );
  }

  private isEligibleForVerification(): boolean {
    return this.canBecomeMember() || this.canBecomeDriver();
  }

  // -----------------------------------------------------------------------------
  // Aggregate Lifecycle
  // -----------------------------------------------------------------------------

  public expire(correlationId: string): void {
    if (this.props.status === VerificationStatus.EXPIRED) {
      throw new VerificationAlreadyExpiredException();
    }

    const now = new Date();

    this.props.status = VerificationStatus.EXPIRED;
    this.props.expiresAt = now;

    this.touch();

    this.addDomainEvent(
      new VerificationExpiredEvent(
        this.id.value,
        this.publicId.value,
        now,
        correlationId,
      ),
    );
  }

  public renew(correlationId: string): void {
    const now = new Date();

    this.props.status = VerificationStatus.PENDING;

    delete this.props.expiresAt;
    delete this.props.verifiedAt;
    delete this.props.rejectionReason;
    delete this.props.reviewedById;
    delete this.props.lastReviewedAt;

    this.touch();

    this.addDomainEvent(
      new VerificationRenewedEvent(
        this.id.value,
        this.publicId.value,
        now,
        correlationId,
      ),
    );
  }

  // -----------------------------------------------------------------------------
  // Aggregate Lifecycle
  // -----------------------------------------------------------------------------

  public revoke(
    reviewerId: IdentityId,
    revocationReason: string,
    correlationId: string,
  ): void {
    if (this.props.status === VerificationStatus.REVOKED) {
      throw new VerificationAlreadyRevokedException();
    }

    const now = new Date();

    this.props.status = VerificationStatus.REVOKED;
    this.props.level = VerificationLevel.NONE;

    this.props.reviewedById = reviewerId;
    this.props.rejectionReason = revocationReason;
    this.props.lastReviewedAt = now;

    delete this.props.verifiedAt;
    delete this.props.expiresAt;

    this.props.profilePhotoVerified = false;
    this.props.governmentIdVerified = false;
    this.props.driverLicenseVerified = false;

    this.touch();

    this.addDomainEvent(
      new VerificationRevokedEvent(
        this.id.value,
        this.publicId.value,
        reviewerId.value,
        revocationReason,
        now,
        correlationId,
      ),
    );
  }
  // -----------------------------------------------------------------------------
  // Domain Queries
  // -----------------------------------------------------------------------------

  public isVerified(): boolean {
    return this.props.status === VerificationStatus.VERIFIED;
  }

  public isPending(): boolean {
    return this.props.status === VerificationStatus.PENDING;
  }

  public isRejected(): boolean {
    return this.props.status === VerificationStatus.REJECTED;
  }

  public isExpired(): boolean {
    return this.props.status === VerificationStatus.EXPIRED;
  }

  public isMember(): boolean {
    return this.props.level === VerificationLevel.MEMBER;
  }

  public isDriver(): boolean {
    return this.props.level === VerificationLevel.DRIVER;
  }

  public isMemberVerified(): boolean {
    return this.isVerified() && this.isMember();
  }

  public isDriverVerified(): boolean {
    return this.isVerified() && this.isDriver();
  }

  public hasPendingRequests(): boolean {
    return this.props.requests.some(
      (request) => request.status === VerificationRequestStatus.PENDING,
    );
  }

  public hasRejectedRequests(): boolean {
    return this.props.requests.some(
      (request) => request.status === VerificationRequestStatus.REJECTED,
    );
  }

  public hasApprovedRequests(): boolean {
    return this.props.requests.some(
      (request) => request.status === VerificationRequestStatus.APPROVED,
    );
  }

  public requiresProfilePhoto(): boolean {
    return !this.props.profilePhotoVerified;
  }

  public requiresGovernmentId(): boolean {
    return !this.props.governmentIdVerified;
  }

  public requiresDriverLicense(): boolean {
    return this.isMember() && !this.props.driverLicenseVerified;
  }

  public canBecomeMember(): boolean {
    return this.props.profilePhotoVerified && this.props.governmentIdVerified;
  }

  public canBecomeDriver(): boolean {
    return this.canBecomeMember() && this.props.driverLicenseVerified;
  }
}
