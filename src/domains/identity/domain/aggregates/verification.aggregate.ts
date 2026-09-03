// -----------------------------------------------------------------------------
// Verification Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// VerificationEntity is the aggregate root entity.
//
// VerificationAggregate is the authoritative mutation boundary for the
// complete Verification lifecycle and the lifecycle of its owned
// VerificationRequestEntity instances.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// Verification lifecycle:
//
// - create Verification;
// - grant MEMBER verification;
// - grant DRIVER verification;
// - reject Verification;
// - expire Verification;
// - reopen Verification;
// - revoke Verification.
//
// Verification-request lifecycle:
//
// - create and submit VerificationRequest;
// - approve VerificationRequest;
// - reject VerificationRequest;
// - cancel VerificationRequest.
//
// Aggregate coordination:
//
// - enforce request ownership;
// - enforce request identity uniqueness;
// - enforce one pending request per request type;
// - translate approved request evidence into Verification evidence;
// - evaluate whether approved evidence permits Verification;
// - emit aggregate and request domain events.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT DOMAIN DISTINCTION
//
// Request approval and Verification approval are different business actions.
//
// VerificationRequest approval:
//
//     approveRequest()
//
// means:
//
// - submitted evidence was reviewed;
// - the evidence was accepted;
// - the request became APPROVED.
//
// It does NOT by itself mean:
//
// - Verification is VERIFIED;
// - Verification level is MEMBER;
// - Verification level is DRIVER.
//
// Verification approval:
//
//     grantMemberVerification()
//     grantDriverVerification()
//
// means:
//
// - sufficient approved evidence exists;
// - Verification lifecycle advances to VERIFIED;
// - the corresponding VerificationLevel is granted.
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
// There is intentionally no EXPIRED request status.
//
// -----------------------------------------------------------------------------
//
// Evidence mapping:
//
// PROFILE_PHOTO
//     -> profilePhotoVerified
//
// GOVERNMENT_ID
//     -> governmentIdVerified
//
// DRIVER_LICENSE
//     -> driverLicenseVerified
//
// MEMBER verification:
//
//     profilePhotoVerified === true
//     OR
//     governmentIdVerified === true
//
// DRIVER verification:
//
//     driverLicenseVerified === true
//
// -----------------------------------------------------------------------------
//
// Progressive verification:
//
// The current VerificationEntity only permits:
//
//     PENDING -> VERIFIED
//
// Therefore:
//
//     MEMBER -> DRIVER
//
// is intentionally NOT supported.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// - IdentityPublicId
// - VerificationRequestAssetPublicId
// - VerificationRequestPublicId
//
// Persistence identifiers remain outside the aggregate contract.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import { VerificationEntity } from '../entities/verification.entity';

import { VerificationRequestEntity } from '../entities/verification-request.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import {
  VerificationApprovedEvent,
  VerificationCreatedEvent,
  VerificationExpiredEvent,
  VerificationRejectedEvent,
  VerificationRequestApprovedEvent,
  VerificationRequestCancelledEvent,
  VerificationRequestCreatedEvent,
  VerificationRequestRejectedEvent,
  VerificationRequestSubmittedEvent,
} from '../events';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { VerificationInvariantException } from '../exceptions/verification-invariant.exception';

import { VerificationRequestNotFoundException } from '../exceptions/verification-request-not-found.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { VerificationPublicId } from '../value-objects/verification-public-id.vo';

import type { IdentityPublicId } from '../value-objects/identity-public-id.vo';

import type { VerificationLevel } from '../value-objects/verification-level.vo';

import type { VerificationRequestAssetPublicId } from '../value-objects/verification-request-asset-public-id.vo';

import type { VerificationRequestType } from '../value-objects/verification-request-type.vo';

import type { VerificationStatus } from '../value-objects/verification-status.vo';

// =============================================================================
// Creation Properties
// =============================================================================

/**
 * Business inputs required to create a Verification aggregate.
 *
 * Persistence identifiers, timestamps, and generated public identifiers remain
 * inside the aggregate boundary.
 */
export interface CreateVerificationAggregateProps {
  /**
   * Identity that owns the Verification aggregate.
   */
  identityPublicId: IdentityPublicId;
}

// =============================================================================
// Verification Request Creation Properties
// =============================================================================

/**
 * Business inputs required to create and submit a VerificationRequest.
 */
export interface CreateVerificationRequestProps {
  /**
   * Type of verification evidence being submitted.
   */
  type: VerificationRequestType;

  /**
   * Asset containing the submitted verification evidence.
   */
  assetPublicId: VerificationRequestAssetPublicId;
}

// =============================================================================
// Aggregate Properties
// =============================================================================

interface VerificationAggregateProps {
  verification: VerificationEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

/**
 * Verification aggregate.
 *
 * Owns:
 *
 * - VerificationEntity;
 * - VerificationRequestEntity[].
 *
 * VerificationEntity remains the aggregate root entity.
 *
 * VerificationAggregate is the authoritative mutation boundary for all
 * Verification and VerificationRequest state changes.
 */
export class VerificationAggregate extends AggregateRoot<VerificationAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: VerificationAggregateProps) {
    super(props, props.verification.id, props.verification.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new Verification aggregate.
   *
   * Initial state:
   *
   * - status = PENDING;
   * - level = NONE;
   * - no verification requests.
   *
   * Emits VerificationCreatedEvent.
   */
  public static create(
    props: CreateVerificationAggregateProps,
    correlationId: string,
    createdAt: Date = new Date(),
  ): VerificationAggregate {
    VerificationAggregate.ensureCorrelationIdValue(correlationId);

    if (props === undefined) {
      throw new VerificationInvariantException(
        'Verification creation properties are required.',
      );
    }

    if (props.identityPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification identity public ID is required.',
      );
    }

    VerificationAggregate.ensureValidDate(
      createdAt,
      'Verification creation timestamp must be valid.',
    );

    const verificationPublicId = new VerificationPublicId();

    const verification = VerificationEntity.create({
      publicId: verificationPublicId,
      identityPublicId: props.identityPublicId,
      createdAt,
      updatedAt: createdAt,
      requests: [],
    });

    const aggregate = new VerificationAggregate({
      verification,
    });

    aggregate.ensureAggregateConsistency();

    aggregate.addDomainEvent(
      new VerificationCreatedEvent(
        aggregate.id.value,
        aggregate.publicId,
        aggregate.identityPublicId,
        aggregate.status,
        aggregate.level,
        correlationId,
      ),
    );

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates an existing Verification aggregate.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    verification: VerificationEntity,
  ): VerificationAggregate {
    if (verification === undefined) {
      throw new VerificationInvariantException(
        'Verification aggregate root is required.',
      );
    }

    const aggregate = new VerificationAggregate({
      verification,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  public get verification(): VerificationEntity {
    return this.props.verification;
  }

  /**
   * Returns all requests owned by this aggregate.
   */
  public get requests(): readonly VerificationRequestEntity[] {
    return this.verification.requests;
  }

  // ===========================================================================
  // Aggregate Identity
  // ===========================================================================

  public override get id(): typeof this.verification.id {
    return this.verification.id;
  }

  public override get publicId(): typeof this.verification.publicId {
    return this.verification.publicId;
  }

  // ===========================================================================
  // Verification Identity
  // ===========================================================================

  public get identityPublicId(): IdentityPublicId {
    return this.verification.identityPublicId;
  }

  // ===========================================================================
  // Verification State
  // ===========================================================================

  public get status(): VerificationStatus {
    return this.verification.status;
  }

  public get level(): VerificationLevel {
    return this.verification.level;
  }

  // ===========================================================================
  // Verification Evidence
  // ===========================================================================

  public get profilePhotoVerified(): boolean {
    return this.verification.profilePhotoVerified;
  }

  public get governmentIdVerified(): boolean {
    return this.verification.governmentIdVerified;
  }

  public get driverLicenseVerified(): boolean {
    return this.verification.driverLicenseVerified;
  }

  // ===========================================================================
  // Verification Timestamps
  // ===========================================================================

  public get verifiedAt(): Date | undefined {
    return this.verification.verifiedAt;
  }

  public get expiresAt(): Date | undefined {
    return this.verification.expiresAt;
  }

  public get memberVerifiedAt(): Date | undefined {
    return this.verification.memberVerifiedAt;
  }

  public get driverVerifiedAt(): Date | undefined {
    return this.verification.driverVerifiedAt;
  }

  public get profilePhotoVerifiedAt(): Date | undefined {
    return this.verification.profilePhotoVerifiedAt;
  }

  public get governmentIdVerifiedAt(): Date | undefined {
    return this.verification.governmentIdVerifiedAt;
  }

  public get driverLicenseVerifiedAt(): Date | undefined {
    return this.verification.driverLicenseVerifiedAt;
  }

  // ===========================================================================
  // Verification Review
  // ===========================================================================

  public get reviewedByPublicId(): IdentityPublicId | undefined {
    return this.verification.reviewedByPublicId;
  }

  public get rejectionReason(): string | undefined {
    return this.verification.rejectionReason;
  }

  public get lastReviewedAt(): Date | undefined {
    return this.verification.lastReviewedAt;
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  public get createdAt(): Date {
    return this.verification.createdAt;
  }

  public get updatedAt(): Date {
    return this.verification.updatedAt;
  }

  // ===========================================================================
  // Verification Lifecycle Queries
  // ===========================================================================

  public isPending(): boolean {
    return this.verification.isPending();
  }

  public isVerified(): boolean {
    return this.verification.isVerified();
  }

  public isRejected(): boolean {
    return this.verification.isRejected();
  }

  public isExpired(): boolean {
    return this.verification.isExpired();
  }

  public isRevoked(): boolean {
    return this.verification.isRevoked();
  }

  public isTerminal(): boolean {
    return this.verification.isTerminal();
  }

  /**
   * Determines whether Verification is currently active.
   */
  public isActive(at: Date = new Date()): boolean {
    VerificationAggregate.ensureValidDate(
      at,
      'Verification active-state timestamp must be valid.',
    );

    return this.verification.isActive(at);
  }

  // ===========================================================================
  // Verification Level Queries
  // ===========================================================================

  public isNoneLevel(): boolean {
    return this.verification.isNoneLevel();
  }

  public isMemberLevel(): boolean {
    return this.verification.isMemberLevel();
  }

  public isDriverLevel(): boolean {
    return this.verification.isDriverLevel();
  }

  // ===========================================================================
  // Evidence Queries
  // ===========================================================================

  public hasProfilePhotoVerification(): boolean {
    return this.verification.hasProfilePhotoVerification();
  }

  public hasGovernmentIdVerification(): boolean {
    return this.verification.hasGovernmentIdVerification();
  }

  public hasDriverLicenseVerification(): boolean {
    return this.verification.hasDriverLicenseVerification();
  }

  /**
   * MEMBER verification requires either accepted profile-photo evidence
   * or accepted government-ID evidence.
   */
  public hasRequiredMemberVerification(): boolean {
    return (
      this.hasProfilePhotoVerification() || this.hasGovernmentIdVerification()
    );
  }

  /**
   * DRIVER verification requires accepted driver-license evidence.
   */
  public hasRequiredDriverVerification(): boolean {
    return this.hasDriverLicenseVerification();
  }

  /**
   * Determines whether MEMBER verification may currently be granted.
   *
   * Progressive promotion is intentionally unsupported.
   */
  public canGrantMemberVerification(): boolean {
    return this.isPending() && this.hasRequiredMemberVerification();
  }

  /**
   * Determines whether DRIVER verification may currently be granted.
   *
   * Progressive promotion is intentionally unsupported.
   */
  public canGrantDriverVerification(): boolean {
    return this.isPending() && this.hasRequiredDriverVerification();
  }
  // ===========================================================================
  // Verification Requests — Queries
  // ===========================================================================

  /**
   * Finds a VerificationRequest by public identifier.
   *
   * This is a pure aggregate query and does not mutate aggregate state.
   */
  public findRequest(
    requestPublicId: VerificationRequestEntity['publicId'],
  ): VerificationRequestEntity | undefined {
    if (requestPublicId === undefined) {
      return undefined;
    }

    return this.requests.find((request) =>
      request.publicId.equals(requestPublicId),
    );
  }

  /**
   * Resolves a VerificationRequest belonging to this Verification aggregate.
   *
   * Throws when the supplied request does not exist within this aggregate.
   */
  public getRequest(
    requestPublicId: VerificationRequestEntity['publicId'],
  ): VerificationRequestEntity {
    if (requestPublicId === undefined) {
      throw new VerificationRequestNotFoundException(
        `Verification request was not supplied for verification ${this.publicId.value}.`,
      );
    }

    const request = this.findRequest(requestPublicId);

    if (request === undefined) {
      throw new VerificationRequestNotFoundException(
        `Verification request ${requestPublicId.value} was not found in verification ${this.publicId.value}.`,
      );
    }

    return request;
  }

  /**
   * Returns all VerificationRequests of the supplied type.
   *
   * The returned collection is readonly from the aggregate API perspective.
   */
  public findRequestsByType(
    type: VerificationRequestType,
  ): readonly VerificationRequestEntity[] {
    if (type === undefined) {
      throw new VerificationInvariantException(
        'Verification request type is required.',
      );
    }

    return this.requests.filter((request) => request.type.equals(type));
  }

  /**
   * Finds the currently pending VerificationRequest of the supplied type.
   *
   * Aggregate consistency guarantees that at most one pending request exists
   * for a given verification request type.
   */
  public findPendingRequestByType(
    type: VerificationRequestType,
  ): VerificationRequestEntity | undefined {
    if (type === undefined) {
      throw new VerificationInvariantException(
        'Verification request type is required.',
      );
    }

    return this.requests.find(
      (request) => request.type.equals(type) && request.isPending(),
    );
  }

  /**
   * Determines whether a pending VerificationRequest of the supplied type
   * exists.
   */
  public hasPendingRequest(type: VerificationRequestType): boolean {
    if (type === undefined) {
      throw new VerificationInvariantException(
        'Verification request type is required.',
      );
    }

    return this.findPendingRequestByType(type) !== undefined;
  }

  /**
   * Returns all currently pending VerificationRequests.
   *
   * The returned collection is readonly from the aggregate API perspective.
   */
  public get pendingRequests(): readonly VerificationRequestEntity[] {
    return this.requests.filter((request) => request.isPending());
  }

  /**
   * Determines whether the Verification aggregate contains any pending
   * VerificationRequests.
   */
  public hasPendingRequests(): boolean {
    return this.pendingRequests.length > 0;
  }

  // ===========================================================================
  // Verification Requests — Create / Submit
  // ===========================================================================

  /**
   * Creates and submits a VerificationRequest.
   *
   * Request creation is synonymous with request submission.
   *
   * The arrow-function form intentionally preserves aggregate `this`
   * semantics if the operation is passed around as a callback.
   *
   * Lifecycle:
   *
   *     createRequest()
   *          │
   *          ├── create VerificationRequestEntity
   *          │
   *          ├── add request to Verification aggregate
   *          │
   *          ├── VerificationRequestCreatedEvent
   *          │
   *          └── VerificationRequestSubmittedEvent
   *
   * Emits:
   *
   * - VerificationRequestCreatedEvent;
   * - VerificationRequestSubmittedEvent.
   *
   * IMPORTANT:
   *
   * VerificationRequestEntity exposes submittedAt through its method:
   *
   *     request.submittedAt()
   *
   * The resolved Date is captured once and reused by both events so both events
   * carry the exact same submission timestamp.
   */
  public readonly createRequest = (
    props: CreateVerificationRequestProps,
    correlationId: string,
    submittedAt: Date = new Date(),
  ): VerificationRequestEntity => {
    // -------------------------------------------------------------------------
    // Validate operation metadata
    // -------------------------------------------------------------------------

    this.ensureCorrelationId(correlationId);

    // -------------------------------------------------------------------------
    // Validate creation properties
    // -------------------------------------------------------------------------

    if (props === undefined) {
      throw new VerificationInvariantException(
        'Verification request creation properties are required.',
      );
    }

    if (props.type === undefined) {
      throw new VerificationInvariantException(
        'Verification request type is required.',
      );
    }

    if (props.assetPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification request asset public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Validate submission timestamp
    // -------------------------------------------------------------------------

    VerificationAggregate.ensureValidDate(
      submittedAt,
      'Verification request submission timestamp must be valid.',
    );

    // -------------------------------------------------------------------------
    // Validate Verification lifecycle
    // -------------------------------------------------------------------------

    if (!this.isPending()) {
      throw new VerificationInvariantException(
        `Verification ${this.publicId.value} cannot create a request from status ${this.status.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // Enforce one pending request per request type
    // -------------------------------------------------------------------------

    if (this.hasPendingRequest(props.type)) {
      throw new VerificationInvariantException(
        `A pending ${props.type.value} verification request already exists for verification ${this.publicId.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // Create VerificationRequest entity
    // -------------------------------------------------------------------------

    const request = VerificationRequestEntity.create({
      verificationPublicId: this.publicId,
      type: props.type,
      assetPublicId: props.assetPublicId,
      submittedAt,
      createdAt: submittedAt,
      updatedAt: submittedAt,
    });

    // -------------------------------------------------------------------------
    // Establish aggregate ownership
    // -------------------------------------------------------------------------

    this.verification.addRequest(request);

    // -------------------------------------------------------------------------
    // Resolve request submission timestamp
    // -------------------------------------------------------------------------
    //
    // VerificationRequestEntity exposes submittedAt as:
    //
    //     submittedAt(): Date
    //
    // Resolve it once rather than passing the method itself.
    //
    // This prevents:
    //
    //     Argument of type '() => Date' is not assignable to parameter of type
    //     'Date'.
    //
    // It also guarantees both events receive the same Date value.
    //
    // -------------------------------------------------------------------------

    const requestSubmittedAt = request.submittedAt();

    // -------------------------------------------------------------------------
    // Record VerificationRequestCreatedEvent
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new VerificationRequestCreatedEvent(
        this.id.value,
        request.publicId,
        this.publicId,
        this.identityPublicId,
        request.assetPublicId,
        request.type,
        request.status,
        requestSubmittedAt,
        correlationId,
      ),
    );

    // -------------------------------------------------------------------------
    // Record VerificationRequestSubmittedEvent
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new VerificationRequestSubmittedEvent(
        this.id.value,
        request.publicId,
        this.publicId,
        this.identityPublicId,
        request.assetPublicId,
        request.type,
        request.status,
        requestSubmittedAt,
        correlationId,
      ),
    );

    // -------------------------------------------------------------------------
    // Update aggregate audit timestamp
    // -------------------------------------------------------------------------

    this.touchAggregate(submittedAt);

    // -------------------------------------------------------------------------
    // Validate complete aggregate boundary
    // -------------------------------------------------------------------------

    this.ensureAggregateConsistency();

    return request;
  };
  // ===========================================================================
  // Verification Requests — Rehydration
  // ===========================================================================

  /**
   * Adds a rehydrated request to the aggregate.
   *
   * No domain event is emitted.
   */
  public addRequestEntity(request: VerificationRequestEntity): void {
    if (request === undefined) {
      throw new VerificationInvariantException(
        'Verification request entity is required.',
      );
    }

    if (!request.verificationPublicId.equals(this.publicId)) {
      throw new VerificationInvariantException(
        `Verification request ${request.publicId.value} does not belong to verification ${this.publicId.value}.`,
      );
    }

    if (this.findRequest(request.publicId) !== undefined) {
      throw new VerificationInvariantException(
        `Verification ${this.publicId.value} already contains request ${request.publicId.value}.`,
      );
    }

    this.verification.addRequest(request);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Verification Requests — Approval
  // ===========================================================================

  /**
   * Approves a VerificationRequest.
   *
   * Approval accepts the submitted evidence at request level.
   *
   * Approval does not automatically grant aggregate Verification.
   */
  public approveRequest(
    requestPublicId: VerificationRequestEntity['publicId'],
    reviewedByPublicId: IdentityPublicId,
    correlationId: string,
    reviewedAt: Date = new Date(),
  ): void {
    this.ensureCorrelationId(correlationId);

    if (reviewedByPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification request reviewer public ID is required.',
      );
    }

    VerificationAggregate.ensureValidDate(
      reviewedAt,
      'Verification request review timestamp must be valid.',
    );

    const request = this.getRequest(requestPublicId);

    request.approve(reviewedByPublicId, reviewedAt);

    this.applyApprovedEvidence(request, reviewedAt);

    this.addDomainEvent(
      new VerificationRequestApprovedEvent(
        this.id.value,
        request.publicId,
        this.publicId,
        this.identityPublicId,
        request.type,
        request.status,
        reviewedByPublicId,
        reviewedAt,
        correlationId,
      ),
    );

    this.touchAggregate(reviewedAt);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Verification Requests — Rejection
  // ===========================================================================

  /**
   * Rejects a VerificationRequest.
   *
   * Request rejection does not reject the parent Verification aggregate.
   */
  public rejectRequest(
    requestPublicId: VerificationRequestEntity['publicId'],
    reviewedByPublicId: IdentityPublicId,
    reason: string,
    correlationId: string,
    reviewedAt: Date = new Date(),
  ): void {
    this.ensureCorrelationId(correlationId);

    if (reviewedByPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification request reviewer public ID is required.',
      );
    }

    if (typeof reason !== 'string' || reason.trim().length === 0) {
      throw new VerificationInvariantException(
        'Verification request rejection reason is required.',
      );
    }

    VerificationAggregate.ensureValidDate(
      reviewedAt,
      'Verification request review timestamp must be valid.',
    );

    const request = this.getRequest(requestPublicId);

    const normalizedReason = reason.trim();

    request.reject(reviewedByPublicId, normalizedReason, reviewedAt);

    this.addDomainEvent(
      new VerificationRequestRejectedEvent(
        this.id.value,
        request.publicId,
        this.publicId,
        this.identityPublicId,
        request.type,
        request.status,
        reviewedByPublicId,
        reviewedAt,
        normalizedReason,
        correlationId,
      ),
    );

    this.touchAggregate(reviewedAt);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Verification Requests — Cancellation
  // ===========================================================================

  /**
   * Cancels a pending VerificationRequest.
   */
  public cancelRequest(
    requestPublicId: VerificationRequestEntity['publicId'],
    correlationId: string,
    cancelledAt: Date = new Date(),
  ): void {
    this.ensureCorrelationId(correlationId);

    VerificationAggregate.ensureValidDate(
      cancelledAt,
      'Verification request cancellation timestamp must be valid.',
    );

    const request = this.getRequest(requestPublicId);

    request.cancel(cancelledAt);

    this.addDomainEvent(
      new VerificationRequestCancelledEvent(
        this.id.value,
        request.publicId,
        this.publicId,
        this.identityPublicId,
        request.type,
        request.status,
        cancelledAt,
        correlationId,
      ),
    );

    this.touchAggregate(cancelledAt);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Verification — Grant MEMBER
  // ===========================================================================

  /**
   * Grants MEMBER verification.
   *
   * The supplied request must:
   *
   * - belong to this aggregate;
   * - be APPROVED;
   * - contain MEMBER-eligible evidence.
   */
  public grantMemberVerification(
    requestPublicId: VerificationRequestEntity['publicId'],
    reviewedByPublicId: IdentityPublicId,
    correlationId: string,
    verifiedAt: Date = new Date(),
    expiresAt?: Date,
  ): void {
    this.ensureCorrelationId(correlationId);

    if (reviewedByPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification reviewer public ID is required.',
      );
    }

    VerificationAggregate.ensureValidDate(
      verifiedAt,
      'Verification timestamp must be valid.',
    );

    VerificationAggregate.ensureExpirationAfter(
      verifiedAt,
      expiresAt,
      'Verification expiration must occur after verification timestamp.',
    );

    if (!this.canGrantMemberVerification()) {
      throw new VerificationInvariantException(
        `Verification ${this.publicId.value} does not currently satisfy MEMBER verification requirements.`,
      );
    }

    const request = this.getRequest(requestPublicId);

    this.ensureApprovedMemberVerificationRequest(request);

    const previousStatus = this.status;
    const previousLevel = this.level;

    this.verification.verifyMember(reviewedByPublicId, verifiedAt, expiresAt);

    this.recordVerificationApprovalIfChanged(
      previousStatus,
      previousLevel,
      request,
      verifiedAt,
      reviewedByPublicId,
      correlationId,
    );

    this.touchAggregate(verifiedAt);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Verification — Grant DRIVER
  // ===========================================================================

  /**
   * Grants DRIVER verification.
   *
   * The supplied request must:
   *
   * - belong to this aggregate;
   * - be APPROVED;
   * - represent DRIVER_LICENSE evidence.
   */
  public grantDriverVerification(
    requestPublicId: VerificationRequestEntity['publicId'],
    reviewedByPublicId: IdentityPublicId,
    correlationId: string,
    verifiedAt: Date = new Date(),
    expiresAt?: Date,
  ): void {
    this.ensureCorrelationId(correlationId);

    if (reviewedByPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification reviewer public ID is required.',
      );
    }

    VerificationAggregate.ensureValidDate(
      verifiedAt,
      'Verification timestamp must be valid.',
    );

    VerificationAggregate.ensureExpirationAfter(
      verifiedAt,
      expiresAt,
      'Verification expiration must occur after verification timestamp.',
    );

    if (!this.canGrantDriverVerification()) {
      throw new VerificationInvariantException(
        `Verification ${this.publicId.value} does not currently satisfy DRIVER verification requirements.`,
      );
    }

    const request = this.getRequest(requestPublicId);

    this.ensureApprovedDriverVerificationRequest(request);

    const previousStatus = this.status;
    const previousLevel = this.level;

    this.verification.verifyDriver(reviewedByPublicId, verifiedAt, expiresAt);

    this.recordVerificationApprovalIfChanged(
      previousStatus,
      previousLevel,
      request,
      verifiedAt,
      reviewedByPublicId,
      correlationId,
    );

    this.touchAggregate(verifiedAt);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Verification — Rejection
  // ===========================================================================

  /**
   * Rejects the Verification aggregate.
   *
   * This is distinct from request rejection.
   */
  public reject(
    requestPublicId: VerificationRequestEntity['publicId'],
    reviewedByPublicId: IdentityPublicId,
    reason: string,
    correlationId: string,
    reviewedAt: Date = new Date(),
  ): void {
    this.ensureCorrelationId(correlationId);

    if (reviewedByPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification reviewer public ID is required.',
      );
    }

    if (typeof reason !== 'string' || reason.trim().length === 0) {
      throw new VerificationInvariantException(
        'Verification rejection reason is required.',
      );
    }

    VerificationAggregate.ensureValidDate(
      reviewedAt,
      'Verification rejection timestamp must be valid.',
    );

    const request = this.getRequest(requestPublicId);

    const normalizedReason = reason.trim();

    this.verification.reject(reviewedByPublicId, normalizedReason, reviewedAt);

    this.addDomainEvent(
      new VerificationRejectedEvent(
        this.id.value,
        this.publicId,
        this.identityPublicId,
        request.publicId,
        request.type,
        this.status,
        this.level,
        reviewedAt,
        normalizedReason,
        reviewedByPublicId,
        correlationId,
      ),
    );

    this.touchAggregate(reviewedAt);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Verification — Expiration
  // ===========================================================================

  /**
   * Expires a currently verified Verification.
   */
  public expire(correlationId: string, expiredAt: Date = new Date()): void {
    this.ensureCorrelationId(correlationId);

    VerificationAggregate.ensureValidDate(
      expiredAt,
      'Verification expiration timestamp must be valid.',
    );

    if (!this.isVerified()) {
      throw new VerificationInvariantException(
        `Only a VERIFIED verification can expire. Current status is ${this.status.value}.`,
      );
    }

    const verificationExpiresAt = this.expiresAt;

    if (verificationExpiresAt === undefined) {
      throw new VerificationInvariantException(
        `Verified verification ${this.publicId.value} does not have an expiration timestamp.`,
      );
    }

    if (expiredAt.getTime() < verificationExpiresAt.getTime()) {
      throw new VerificationInvariantException(
        `Verification ${this.publicId.value} has not reached its expiration timestamp.`,
      );
    }

    this.verification.expire(expiredAt);

    this.addDomainEvent(
      new VerificationExpiredEvent(
        this.id.value,
        this.publicId,
        this.identityPublicId,
        this.status,
        this.level,
        expiredAt,
        verificationExpiresAt,
        correlationId,
      ),
    );

    this.touchAggregate(expiredAt);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Verification — Reopen
  // ===========================================================================

  /**
   * Reopens a rejected or expired Verification.
   *
   * Supported transitions:
   *
   * REJECTED -> PENDING
   * EXPIRED  -> PENDING
   */
  public reopen(correlationId: string, reopenedAt: Date = new Date()): void {
    this.ensureCorrelationId(correlationId);

    VerificationAggregate.ensureValidDate(
      reopenedAt,
      'Verification reopening timestamp must be valid.',
    );

    if (!this.isRejected() && !this.isExpired()) {
      throw new VerificationInvariantException(
        `Only a REJECTED or EXPIRED verification can be reopened. Current status is ${this.status.value}.`,
      );
    }

    this.verification.reopen(reopenedAt);

    this.touchAggregate(reopenedAt);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Verification — Revocation
  // ===========================================================================

  /**
   * Revokes Verification.
   *
   * REVOKED is terminal.
   */
  public revoke(
    revokedByPublicId: IdentityPublicId,
    reason: string,
    correlationId: string,
    revokedAt: Date = new Date(),
  ): void {
    this.ensureCorrelationId(correlationId);

    if (revokedByPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification revoking identity public ID is required.',
      );
    }

    if (typeof reason !== 'string' || reason.trim().length === 0) {
      throw new VerificationInvariantException(
        'Verification revocation reason is required.',
      );
    }

    VerificationAggregate.ensureValidDate(
      revokedAt,
      'Verification revocation timestamp must be valid.',
    );

    const normalizedReason = reason.trim();

    this.verification.revoke(revokedByPublicId, normalizedReason, revokedAt);

    this.touchAggregate(revokedAt);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Validates aggregate-boundary invariants.
   *
   * Guarantees:
   *
   * - request collection integrity;
   * - request identity uniqueness;
   * - request ownership;
   * - one pending request per request type.
   */
  private ensureAggregateConsistency(): void {
    const verification = this.verification;

    if (verification === undefined) {
      throw new VerificationInvariantException(
        'Verification aggregate root is required.',
      );
    }

    if (verification.publicId === undefined) {
      throw new VerificationInvariantException(
        'Verification aggregate public identity is required.',
      );
    }

    if (verification.identityPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification identity public ID is required.',
      );
    }

    if (verification.requests === undefined) {
      throw new VerificationInvariantException(
        'Verification request collection is required.',
      );
    }

    const verificationPublicId = verification.publicId;

    const requestIds = new Set<string>();

    const pendingRequestTypes = new Set<string>();

    for (const request of verification.requests) {
      if (request === undefined) {
        throw new VerificationInvariantException(
          `Verification ${verificationPublicId.value} contains an invalid request entity.`,
        );
      }

      const requestPublicId = request.publicId.value;

      if (requestIds.has(requestPublicId)) {
        throw new VerificationInvariantException(
          `Verification ${verificationPublicId.value} contains duplicate request ${requestPublicId}.`,
        );
      }

      requestIds.add(requestPublicId);

      if (!request.verificationPublicId.equals(verificationPublicId)) {
        throw new VerificationInvariantException(
          `Verification request ${requestPublicId} does not belong to verification ${verificationPublicId.value}.`,
        );
      }

      if (!request.isPending()) {
        continue;
      }

      const requestType = request.type.value;

      if (pendingRequestTypes.has(requestType)) {
        throw new VerificationInvariantException(
          `Verification ${verificationPublicId.value} contains duplicate pending ${requestType} requests.`,
        );
      }

      pendingRequestTypes.add(requestType);
    }
  }

  // ===========================================================================
  // Approved Evidence
  // ===========================================================================

  /**
   * Applies evidence accepted by a VerificationRequest.
   *
   * This changes evidence state only.
   *
   * It does not grant Verification or change Verification level.
   */
  private applyApprovedEvidence(
    request: VerificationRequestEntity,
    approvedAt: Date,
  ): void {
    if (!request.isApproved()) {
      throw new VerificationInvariantException(
        `Only an APPROVED verification request can contribute verification evidence. Request ${request.publicId.value} has status ${request.status.value}.`,
      );
    }

    const type = request.type.value;

    switch (type) {
      case 'PROFILE_PHOTO':
        this.verification.verifyProfilePhoto(approvedAt);
        return;

      case 'GOVERNMENT_ID':
        this.verification.verifyGovernmentId(approvedAt);
        return;

      case 'DRIVER_LICENSE':
        this.verification.verifyDriverLicense(approvedAt);
        return;

      default:
        return this.assertNeverVerificationRequestType(type);
    }
  }

  // ===========================================================================
  // Verification Grant Guards
  // ===========================================================================

  private ensureApprovedMemberVerificationRequest(
    request: VerificationRequestEntity,
  ): void {
    if (!request.isApproved()) {
      throw new VerificationInvariantException(
        `Verification request ${request.publicId.value} must be APPROVED before MEMBER verification can be granted.`,
      );
    }

    const type = request.type.value;

    switch (type) {
      case 'PROFILE_PHOTO':
      case 'GOVERNMENT_ID':
        return;

      case 'DRIVER_LICENSE':
        throw new VerificationInvariantException(
          `Verification request ${request.publicId.value} of type DRIVER_LICENSE cannot be used to grant MEMBER verification.`,
        );

      default:
        return this.assertNeverVerificationRequestType(type);
    }
  }

  private ensureApprovedDriverVerificationRequest(
    request: VerificationRequestEntity,
  ): void {
    if (!request.isApproved()) {
      throw new VerificationInvariantException(
        `Verification request ${request.publicId.value} must be APPROVED before DRIVER verification can be granted.`,
      );
    }

    const type = request.type.value;

    switch (type) {
      case 'DRIVER_LICENSE':
        return;

      case 'PROFILE_PHOTO':
      case 'GOVERNMENT_ID':
        throw new VerificationInvariantException(
          `Verification request ${request.publicId.value} of type ${type} cannot be used to grant DRIVER verification.`,
        );

      default:
        return this.assertNeverVerificationRequestType(type);
    }
  }

  // ===========================================================================
  // Exhaustiveness Guard
  // ===========================================================================

  /**
   * Exhaustiveness guard for VerificationRequestType.
   */
  private assertNeverVerificationRequestType(type: never): never {
    throw new VerificationInvariantException(
      `Unsupported verification request type: ${String(type)}.`,
    );
  }

  // ===========================================================================
  // Verification Event Recording
  // ===========================================================================

  /**
   * Records VerificationApprovedEvent only when the aggregate actually
   * advances its Verification status or level.
   */
  private recordVerificationApprovalIfChanged(
    previousStatus: VerificationStatus,
    previousLevel: VerificationLevel,
    approvedRequest: VerificationRequestEntity,
    verifiedAt: Date,
    reviewedByPublicId: IdentityPublicId,
    correlationId: string,
  ): void {
    const statusChanged = !previousStatus.equals(this.status);

    const levelChanged = !previousLevel.equals(this.level);

    if (!statusChanged && !levelChanged) {
      return;
    }

    this.addDomainEvent(
      new VerificationApprovedEvent(
        this.id.value,
        this.publicId,
        this.identityPublicId,
        approvedRequest.publicId,
        approvedRequest.type,
        this.status,
        this.level,
        verifiedAt,
        reviewedByPublicId,
        correlationId,
      ),
    );
  }

  // ===========================================================================
  // Aggregate Audit
  // ===========================================================================

  private touchAggregate(at: Date): void {
    VerificationAggregate.ensureValidDate(
      at,
      'Verification aggregate audit timestamp must be valid.',
    );

    this.verification.setUpdatedAt(at);
  }

  // ===========================================================================
  // Correlation Guards
  // ===========================================================================

  /**
   * Instance wrapper retained for aggregate readability.
   *
   * The actual validation is static because it does not depend on `this`.
   */
  private ensureCorrelationId(correlationId: string): void {
    VerificationAggregate.ensureCorrelationIdValue(correlationId);
  }

  /**
   * Correlation validation has no instance state and therefore is static.
   *
   * This avoids unnecessary `this` binding semantics.
   */
  private static ensureCorrelationIdValue(correlationId: string): void {
    if (
      typeof correlationId !== 'string' ||
      correlationId.trim().length === 0
    ) {
      throw new VerificationInvariantException(
        'Verification domain operation correlation ID is required.',
      );
    }
  }

  // ===========================================================================
  // Date Guards
  // ===========================================================================

  /**
   * Validates a Date value.
   *
   * This method does not access aggregate state.
   */
  private static ensureValidDate(date: Date, message: string): void {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
      throw new VerificationInvariantException(message);
    }
  }

  /**
   * Validates an optional expiration timestamp.
   *
   * If no expiration is supplied, no validation is required.
   */
  private static ensureExpirationAfter(
    verifiedAt: Date,
    expiresAt: Date | undefined,
    message: string,
  ): void {
    if (expiresAt === undefined) {
      return;
    }

    VerificationAggregate.ensureValidDate(
      expiresAt,
      'Verification expiration timestamp must be valid.',
    );

    if (expiresAt.getTime() <= verifiedAt.getTime()) {
      throw new VerificationInvariantException(message);
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { VerificationAggregateProps };
