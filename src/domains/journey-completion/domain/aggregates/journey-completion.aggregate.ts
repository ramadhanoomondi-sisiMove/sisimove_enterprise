// -----------------------------------------------------------------------------
// Journey Completion Aggregate
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyCompletionEntity } from '../entities/journey-completion.entity';

import type { JourneyCompletionConfirmationEntity } from '../entities/journey-completion-confirmation.entity';

import type { JourneyCompletionDisputeEntity } from '../entities/journey-completion-dispute.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyCompletionDisputeResolutionSummary,
  type JourneyCompletionStatus,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import {
  JourneyCompletionCreatedEvent,
  JourneyCompletionRequestedEvent,
  JourneyCompletionConfirmedEvent,
  JourneyCompletionCancelledEvent,
  JourneyCompletionConfirmationAddedEvent,
  JourneyCompletionConfirmationWithdrawnEvent,
  JourneyCompletionDisputedEvent,
  JourneyCompletionDisputeOpenedEvent,
  JourneyCompletionDisputeUnderReviewEvent,
  JourneyCompletionDisputeResolvedEvent,
  JourneyCompletionDisputeRejectedEvent,
  JourneyCompletionDisputeWithdrawnEvent,
} from '../events';

import type { JourneyCompletionDomainEvent } from '../events';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import {
  JourneyCompletionInvariantException,
  JourneyCompletionInvalidStatusTransitionException,
  JourneyCompletionAlreadyRequestedException,
  JourneyCompletionAlreadyConfirmedException,
  JourneyCompletionAlreadyDisputedException,
  JourneyCompletionAlreadyCancelledException,
  JourneyCompletionNotConfirmationRequiredException,
  JourneyCompletionCannotModifyConfirmedException,
  JourneyCompletionCannotModifyCancelledException,
  JourneyCompletionCannotConfirmException,
  JourneyCompletionCannotDisputeException,
  JourneyCompletionConfirmationNotFoundException,
  JourneyCompletionConfirmationAlreadyConfirmedException,
  JourneyCompletionConfirmationAlreadyWithdrawnException,
  JourneyCompletionConfirmationNotAuthorizedException,
  JourneyCompletionConfirmationAlreadyExistsException,
  JourneyCompletionDisputeNotFoundException,
  JourneyCompletionDisputeAlreadyResolvedException,
  JourneyCompletionDisputeAlreadyRejectedException,
  JourneyCompletionDisputeAlreadyWithdrawnException,
  JourneyCompletionDisputeNotOpenException,
  JourneyCompletionDisputeNotAuthorizedException,
} from '../exceptions';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

/**
 * Aggregate root for the Journey Completion lifecycle.
 *
 * Aggregate boundary:
 *
 * JourneyCompletionAggregate
 * ├── JourneyCompletionEntity
 * ├── JourneyCompletionConfirmationEntity[]
 * └── JourneyCompletionDisputeEntity[]
 *
 * Journey Settlement is intentionally NOT owned by this aggregate.
 *
 * JourneySettlement is a separate aggregate whose lifecycle is triggered
 * after Journey Completion reaches the appropriate business state.
 *
 * Cross-domain references are represented exclusively through public
 * identifier value objects.
 *
 * The aggregate owns:
 *
 * - completion lifecycle;
 * - completion confirmation workflow;
 * - confirmation collection;
 * - confirmation withdrawal;
 * - dispute workflow;
 * - dispute resolution;
 * - dispute rejection;
 * - dispute withdrawal.
 *
 * The aggregate does NOT:
 *
 * - mutate Journey;
 * - mutate Journey Booking;
 * - mutate Identity;
 * - mutate Financial;
 * - create or mutate Journey Settlement.
 */
export class JourneyCompletionAggregate extends AggregateRoot<JourneyCompletionEntity> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(
    completion: JourneyCompletionEntity,
    id?: UniqueEntityId,
  ) {
    super(completion, id);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Journey Completion aggregate.
   *
   * A newly created completion must begin in PENDING state.
   *
   * Confirmations and disputes are not created implicitly.
   */
  public static create(
    completion: JourneyCompletionEntity,
    correlationId: string,
    causationId?: string,
  ): JourneyCompletionAggregate {
    const aggregate = new JourneyCompletionAggregate(completion, completion.id);

    aggregate.assertCreationInvariant();

    aggregate.recordCreated(correlationId, causationId);

    return aggregate;
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    completion: JourneyCompletionEntity,
  ): JourneyCompletionAggregate {
    const aggregate = new JourneyCompletionAggregate(completion, completion.id);

    aggregate.assertAggregateInvariant();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate Identity
  // ===========================================================================

  public get journeyCompletion(): JourneyCompletionEntity {
    return this.props;
  }

  /**
   * Alias retained for callers that prefer `completion`.
   */
  public get completion(): JourneyCompletionEntity {
    return this.props;
  }

  public get aggregateId(): UniqueEntityId {
    return this.id;
  }

  public override get publicId(): JourneyCompletionEntity['publicId'] {
    return this.journeyCompletion.publicId;
  }

  // ===========================================================================
  // Journey Reference
  // ===========================================================================

  public get journeyPublicId(): JourneyCompletionEntity['journeyPublicId'] {
    return this.journeyCompletion.journeyPublicId;
  }

  public belongsToJourney(
    journeyPublicId: JourneyCompletionEntity['journeyPublicId'],
  ): boolean {
    return this.journeyPublicId.equals(journeyPublicId);
  }

  // ===========================================================================
  // Provider Reference
  // ===========================================================================

  public get providerPublicId(): JourneyCompletionEntity['providerPublicId'] {
    return this.journeyCompletion.providerPublicId;
  }

  public belongsToProvider(
    providerPublicId: JourneyCompletionEntity['providerPublicId'],
  ): boolean {
    return this.providerPublicId.equals(providerPublicId);
  }

  // ===========================================================================
  // Lifecycle State
  // ===========================================================================

  public get status(): JourneyCompletionStatus {
    return this.journeyCompletion.status;
  }

  public get completionRequestedAt(): Date | undefined {
    return this.journeyCompletion.completionRequestedAt;
  }

  public get confirmedAt(): Date | undefined {
    return this.journeyCompletion.confirmedAt;
  }

  public get disputedAt(): Date | undefined {
    return this.journeyCompletion.disputedAt;
  }

  public get cancelledAt(): Date | undefined {
    return this.journeyCompletion.cancelledAt;
  }

  // ===========================================================================
  // Confirmation Tracking
  // ===========================================================================

  public get requiredConfirmations(): number {
    return this.journeyCompletion.requiredConfirmations;
  }

  public get confirmedCount(): number {
    return this.journeyCompletion.confirmedCount;
  }

  public get confirmations(): readonly JourneyCompletionConfirmationEntity[] {
    return this.journeyCompletion.confirmations;
  }

  public get activeConfirmations(): readonly JourneyCompletionConfirmationEntity[] {
    return this.confirmations.filter((confirmation) =>
      confirmation.status.isConfirmed(),
    );
  }

  public get withdrawnConfirmations(): readonly JourneyCompletionConfirmationEntity[] {
    return this.confirmations.filter((confirmation) =>
      confirmation.status.isWithdrawn(),
    );
  }

  // ===========================================================================
  // Disputes
  // ===========================================================================

  public get disputes(): readonly JourneyCompletionDisputeEntity[] {
    return this.journeyCompletion.disputes;
  }

  public get openDisputes(): readonly JourneyCompletionDisputeEntity[] {
    return this.disputes.filter((dispute) => dispute.status.isOpen());
  }

  public get activeDispute(): JourneyCompletionDisputeEntity | undefined {
    return this.disputes.find(
      (dispute) => dispute.status.isOpen() || dispute.status.isUnderReview(),
    );
  }

  // ===========================================================================
  // Version
  // ===========================================================================

  public get version(): number {
    return this.journeyCompletion.version;
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isPending(): boolean {
    return this.status.isPending();
  }

  public isConfirmationRequired(): boolean {
    return this.status.isConfirmationRequired();
  }

  public isConfirmed(): boolean {
    return this.status.isConfirmed();
  }

  public isDisputed(): boolean {
    return this.status.isDisputed();
  }

  public isCancelled(): boolean {
    return this.status.isCancelled();
  }

  public isTerminal(): boolean {
    return this.isConfirmed() || this.isCancelled();
  }

  public isActive(): boolean {
    return !this.isTerminal();
  }

  // ===========================================================================
  // Lifecycle Capabilities
  // ===========================================================================

  public canRequest(): boolean {
    return this.isPending();
  }

  public canConfirm(): boolean {
    return (
      this.isConfirmationRequired() &&
      this.hasSatisfiedConfirmationRequirement()
    );
  }

  public canAddConfirmation(): boolean {
    return this.isConfirmationRequired();
  }

  public canWithdrawConfirmation(): boolean {
    return this.isConfirmationRequired();
  }

  /**
   * Disputes may only be opened while the completion is awaiting
   * confirmation.
   *
   * This intentionally matches JourneyCompletionEntity.canBeDisputed().
   */
  public canDispute(): boolean {
    return this.isConfirmationRequired();
  }

  public canCancel(): boolean {
    return this.isPending() || this.isConfirmationRequired();
  }

  public canModify(): boolean {
    return !this.isConfirmed() && !this.isCancelled() && !this.isDisputed();
  }

  // ===========================================================================
  // Request Completion
  // ===========================================================================

  /**
   * Moves the completion from PENDING into the confirmation workflow.
   */
  public request(
    correlationId: string,
    causationId?: string,
    requestedAt: Date = new Date(),
  ): void {
    if (this.isConfirmationRequired()) {
      throw new JourneyCompletionAlreadyRequestedException(this.publicId.value);
    }

    if (this.isConfirmed()) {
      throw new JourneyCompletionAlreadyConfirmedException(this.publicId.value);
    }

    if (this.isDisputed()) {
      throw new JourneyCompletionAlreadyDisputedException(this.publicId.value);
    }

    if (this.isCancelled()) {
      throw new JourneyCompletionCannotModifyCancelledException(
        this.publicId.value,
      );
    }

    if (!this.isPending()) {
      throw new JourneyCompletionInvalidStatusTransitionException(
        this.status.value,
        'CONFIRMATION_REQUIRED',
      );
    }

    this.journeyCompletion.requestCompletion(requestedAt);

    this.journeyCompletion.incrementVersion();

    this.addDomainEvent(
      new JourneyCompletionRequestedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyPublicId.value,
        this.providerPublicId.value,
        requestedAt,
        this.requiredConfirmations,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Add Confirmation
  // ===========================================================================

  /**
   * Adds an active confirmation.
   *
   * Only one confirmation per member is permitted within the aggregate.
   */
  public addConfirmation(
    confirmation: JourneyCompletionConfirmationEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    if (this.isConfirmed()) {
      throw new JourneyCompletionCannotModifyConfirmedException(
        this.publicId.value,
      );
    }

    if (this.isCancelled()) {
      throw new JourneyCompletionCannotModifyCancelledException(
        this.publicId.value,
      );
    }

    if (this.isDisputed()) {
      throw new JourneyCompletionCannotDisputeException(this.publicId.value);
    }

    if (!this.isConfirmationRequired()) {
      throw new JourneyCompletionNotConfirmationRequiredException(
        this.publicId.value,
      );
    }

    if (!confirmation.status.isConfirmed()) {
      throw new JourneyCompletionInvariantException(
        'A Journey Completion confirmation must be active when added.',
      );
    }

    if (!confirmation.completionId.equals(this.journeyCompletion.publicId)) {
      throw new JourneyCompletionInvariantException(
        'Journey Completion confirmation belongs to another completion.',
      );
    }

    const existing = this.findConfirmationByMember(confirmation.memberPublicId);

    if (existing) {
      if (existing.status.isConfirmed()) {
        throw new JourneyCompletionConfirmationAlreadyConfirmedException(
          existing.publicId.value,
        );
      }

      throw new JourneyCompletionConfirmationAlreadyExistsException(
        existing.publicId.value,
      );
    }

    this.journeyCompletion.addConfirmation(confirmation);

    this.recalculateConfirmedCount();

    this.journeyCompletion.incrementVersion();

    const confirmedCount = this.confirmedCount;

    this.addDomainEvent(
      new JourneyCompletionConfirmationAddedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyPublicId.value,
        this.providerPublicId.value,
        confirmation.publicId.value,
        confirmation.memberPublicId.value,
        confirmation.role.value,
        confirmation.confirmedAt,
        confirmedCount,
        this.requiredConfirmations,
        confirmation.bookingPublicId?.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Confirm Completion
  // ===========================================================================

  /**
   * Confirms the Journey Completion once the required number of active
   * confirmations has been reached.
   */
  public confirm(
    correlationId: string,
    causationId?: string,
    confirmedAt: Date = new Date(),
  ): void {
    if (this.isConfirmed()) {
      throw new JourneyCompletionAlreadyConfirmedException(this.publicId.value);
    }

    if (this.isCancelled()) {
      throw new JourneyCompletionCannotModifyCancelledException(
        this.publicId.value,
      );
    }

    if (this.isDisputed()) {
      throw new JourneyCompletionCannotConfirmException(this.publicId.value);
    }

    if (!this.isConfirmationRequired()) {
      throw new JourneyCompletionInvalidStatusTransitionException(
        this.status.value,
        'CONFIRMED',
      );
    }

    if (!this.hasSatisfiedConfirmationRequirement()) {
      throw new JourneyCompletionCannotConfirmException(this.publicId.value);
    }

    this.journeyCompletion.confirm(confirmedAt);

    this.journeyCompletion.incrementVersion();

    this.addDomainEvent(
      new JourneyCompletionConfirmedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyPublicId.value,
        this.providerPublicId.value,
        confirmedAt,
        this.confirmedCount,
        this.requiredConfirmations,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Withdraw Confirmation
  // ===========================================================================

  public withdrawConfirmation(
    confirmationPublicId: JourneyCompletionConfirmationEntity['publicId'],
    memberPublicId: JourneyCompletionConfirmationEntity['memberPublicId'],
    correlationId: string,
    causationId?: string,
    withdrawnAt: Date = new Date(),
  ): void {
    if (this.isConfirmed()) {
      throw new JourneyCompletionCannotModifyConfirmedException(
        this.publicId.value,
      );
    }

    if (this.isCancelled()) {
      throw new JourneyCompletionCannotModifyCancelledException(
        this.publicId.value,
      );
    }

    if (this.isDisputed()) {
      throw new JourneyCompletionCannotDisputeException(this.publicId.value);
    }

    if (!this.isConfirmationRequired()) {
      throw new JourneyCompletionNotConfirmationRequiredException(
        this.publicId.value,
      );
    }

    const confirmation = this.findConfirmation(confirmationPublicId);

    if (!confirmation) {
      throw new JourneyCompletionConfirmationNotFoundException(
        confirmationPublicId.value,
      );
    }

    if (!confirmation.memberPublicId.equals(memberPublicId)) {
      throw new JourneyCompletionConfirmationNotAuthorizedException(
        confirmationPublicId.value,
      );
    }

    if (confirmation.status.isWithdrawn()) {
      throw new JourneyCompletionConfirmationAlreadyWithdrawnException(
        confirmationPublicId.value,
      );
    }

    if (!confirmation.status.canWithdraw()) {
      throw new JourneyCompletionInvariantException(
        'Journey Completion confirmation cannot be withdrawn in its current state.',
      );
    }

    confirmation.withdraw(withdrawnAt);

    this.recalculateConfirmedCount();

    this.journeyCompletion.incrementVersion();

    this.addDomainEvent(
      new JourneyCompletionConfirmationWithdrawnEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyPublicId.value,
        this.providerPublicId.value,
        confirmation.publicId.value,
        confirmation.memberPublicId.value,
        confirmation.role.value,
        withdrawnAt,
        this.confirmedCount,
        this.requiredConfirmations,
        confirmation.bookingPublicId?.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Open Dispute
  // ===========================================================================

  public dispute(
    dispute: JourneyCompletionDisputeEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    if (this.isCancelled()) {
      throw new JourneyCompletionCannotModifyCancelledException(
        this.publicId.value,
      );
    }

    if (this.isConfirmed()) {
      throw new JourneyCompletionCannotDisputeException(this.publicId.value);
    }

    if (this.isDisputed()) {
      throw new JourneyCompletionAlreadyDisputedException(this.publicId.value);
    }

    if (!this.canDispute()) {
      throw new JourneyCompletionCannotDisputeException(this.publicId.value);
    }

    if (!dispute.completionId.equals(this.publicId)) {
      throw new JourneyCompletionInvariantException(
        'Journey Completion dispute belongs to another completion.',
      );
    }

    if (!dispute.status.isOpen()) {
      throw new JourneyCompletionInvariantException(
        'A newly opened Journey Completion dispute must be OPEN.',
      );
    }

    if (this.activeDispute !== undefined) {
      throw new JourneyCompletionAlreadyDisputedException(this.publicId.value);
    }

    this.journeyCompletion.addDispute(dispute);

    this.journeyCompletion.dispute(dispute.openedAt);

    this.journeyCompletion.incrementVersion();

    this.addDomainEvent(
      new JourneyCompletionDisputeOpenedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyPublicId.value,
        this.providerPublicId.value,
        dispute.publicId.value,
        dispute.raisedByPublicId.value,
        dispute.reason.value,
        dispute.openedAt,
        dispute.description?.value,
        correlationId,
        causationId,
      ),
    );

    this.addDomainEvent(
      new JourneyCompletionDisputedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyPublicId.value,
        this.providerPublicId.value,
        dispute.publicId.value,
        dispute.raisedByPublicId.value,
        dispute.reason.value,
        dispute.openedAt,
        dispute.description?.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Put Dispute Under Review
  // ===========================================================================

  public putDisputeUnderReview(
    disputePublicId: JourneyCompletionDisputeEntity['publicId'],
    correlationId: string,
    causationId?: string,
    underReviewAt: Date = new Date(),
  ): void {
    const dispute = this.requireDispute(disputePublicId);

    // -------------------------------------------------------------------------
    // Lifecycle Guard
    // -------------------------------------------------------------------------

    if (!dispute.status.isOpen()) {
      throw new JourneyCompletionDisputeNotOpenException(
        dispute.publicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Child Mutation
    // -------------------------------------------------------------------------

    dispute.startReview(underReviewAt);

    // -------------------------------------------------------------------------
    // Aggregate Version
    // -------------------------------------------------------------------------

    this.journeyCompletion.incrementVersion();

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new JourneyCompletionDisputeUnderReviewEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyPublicId.value,
        this.providerPublicId.value,
        dispute.publicId.value,
        underReviewAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Resolve Dispute
  // ===========================================================================

  public resolveDispute(
    disputePublicId: JourneyCompletionDisputeEntity['publicId'],
    resolvedByPublicId: JourneyCompletionDisputeEntity['resolvedByPublicId'],
    resolutionSummary: string | undefined,
    correlationId: string,
    causationId?: string,
    resolvedAt: Date = new Date(),
  ): void {
    const dispute = this.requireDispute(disputePublicId);

    // -------------------------------------------------------------------------
    // Lifecycle Guards
    // -------------------------------------------------------------------------

    if (dispute.status.isResolved()) {
      throw new JourneyCompletionDisputeAlreadyResolvedException(
        dispute.publicId.value,
      );
    }

    if (dispute.status.isRejected()) {
      throw new JourneyCompletionDisputeAlreadyRejectedException(
        dispute.publicId.value,
      );
    }

    if (dispute.status.isWithdrawn()) {
      throw new JourneyCompletionDisputeAlreadyWithdrawnException(
        dispute.publicId.value,
      );
    }

    if (!dispute.status.isUnderReview()) {
      throw new JourneyCompletionDisputeNotOpenException(
        dispute.publicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Resolver Validation
    // -------------------------------------------------------------------------

    if (!resolvedByPublicId) {
      throw new JourneyCompletionInvariantException(
        'A Journey Completion dispute resolution requires a resolver.',
      );
    }

    // -------------------------------------------------------------------------
    // Resolution Summary
    // -------------------------------------------------------------------------

    const normalizedSummary = this.normalizeOptionalText(resolutionSummary);

    if (normalizedSummary === undefined) {
      throw new JourneyCompletionInvariantException(
        'A Journey Completion dispute resolution requires a resolution summary.',
      );
    }

    const resolutionSummaryValue =
      JourneyCompletionDisputeResolutionSummary.create(normalizedSummary);

    // -------------------------------------------------------------------------
    // Child Mutation
    // -------------------------------------------------------------------------

    dispute.resolve(resolvedByPublicId, resolutionSummaryValue, resolvedAt);

    // -------------------------------------------------------------------------
    // Aggregate Version
    // -------------------------------------------------------------------------

    this.journeyCompletion.incrementVersion();

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new JourneyCompletionDisputeResolvedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyPublicId.value,
        this.providerPublicId.value,
        dispute.publicId.value,
        resolvedByPublicId.value,
        resolvedAt,
        normalizedSummary,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Reject Dispute
  // ===========================================================================

  public rejectDispute(
    disputePublicId: JourneyCompletionDisputeEntity['publicId'],
    resolvedByPublicId: JourneyCompletionDisputeEntity['resolvedByPublicId'],
    resolutionSummary: string | undefined,
    correlationId: string,
    causationId?: string,
    rejectedAt: Date = new Date(),
  ): void {
    const dispute = this.requireDispute(disputePublicId);

    // -------------------------------------------------------------------------
    // Lifecycle Guards
    // -------------------------------------------------------------------------

    if (dispute.status.isRejected()) {
      throw new JourneyCompletionDisputeAlreadyRejectedException(
        dispute.publicId.value,
      );
    }

    if (dispute.status.isResolved()) {
      throw new JourneyCompletionDisputeAlreadyResolvedException(
        dispute.publicId.value,
      );
    }

    if (dispute.status.isWithdrawn()) {
      throw new JourneyCompletionDisputeAlreadyWithdrawnException(
        dispute.publicId.value,
      );
    }

    if (!dispute.status.isUnderReview()) {
      throw new JourneyCompletionDisputeNotOpenException(
        dispute.publicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Resolver Validation
    // -------------------------------------------------------------------------

    if (!resolvedByPublicId) {
      throw new JourneyCompletionInvariantException(
        'A Journey Completion dispute rejection requires a resolver.',
      );
    }

    // -------------------------------------------------------------------------
    // Resolution Summary
    // -------------------------------------------------------------------------

    const normalizedSummary = this.normalizeOptionalText(resolutionSummary);

    if (normalizedSummary === undefined) {
      throw new JourneyCompletionInvariantException(
        'A Journey Completion dispute rejection requires a resolution summary.',
      );
    }

    const resolutionSummaryValue =
      JourneyCompletionDisputeResolutionSummary.create(normalizedSummary);

    // -------------------------------------------------------------------------
    // Child Mutation
    // -------------------------------------------------------------------------

    dispute.reject(resolvedByPublicId, resolutionSummaryValue, rejectedAt);

    // -------------------------------------------------------------------------
    // Aggregate Version
    // -------------------------------------------------------------------------

    this.journeyCompletion.incrementVersion();

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new JourneyCompletionDisputeRejectedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyPublicId.value,
        this.providerPublicId.value,
        dispute.publicId.value,
        resolvedByPublicId.value,
        rejectedAt,
        normalizedSummary,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Withdraw Dispute
  // ===========================================================================

  public withdrawDispute(
    disputePublicId: JourneyCompletionDisputeEntity['publicId'],
    withdrawnByPublicId: JourneyCompletionDisputeEntity['raisedByPublicId'],
    correlationId: string,
    causationId?: string,
    withdrawnAt: Date = new Date(),
  ): void {
    const dispute = this.requireDispute(disputePublicId);

    if (dispute.status.isResolved()) {
      throw new JourneyCompletionDisputeAlreadyResolvedException(
        dispute.publicId.value,
      );
    }

    if (dispute.status.isRejected()) {
      throw new JourneyCompletionDisputeAlreadyRejectedException(
        dispute.publicId.value,
      );
    }

    if (dispute.status.isWithdrawn()) {
      throw new JourneyCompletionDisputeAlreadyWithdrawnException(
        dispute.publicId.value,
      );
    }

    if (!dispute.status.isOpen()) {
      throw new JourneyCompletionDisputeNotOpenException(
        dispute.publicId.value,
      );
    }

    if (!dispute.raisedByPublicId.equals(withdrawnByPublicId)) {
      throw new JourneyCompletionDisputeNotAuthorizedException(
        dispute.publicId.value,
      );
    }

    dispute.withdraw(withdrawnAt);

    this.journeyCompletion.incrementVersion();

    this.addDomainEvent(
      new JourneyCompletionDisputeWithdrawnEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyPublicId.value,
        this.providerPublicId.value,
        dispute.publicId.value,
        withdrawnByPublicId.value,
        withdrawnAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Cancel Completion
  // ===========================================================================

  public cancel(
    correlationId: string,
    causationId?: string,
    cancelledAt: Date = new Date(),
  ): void {
    if (this.isCancelled()) {
      throw new JourneyCompletionAlreadyCancelledException(this.publicId.value);
    }

    if (this.isConfirmed()) {
      throw new JourneyCompletionCannotModifyConfirmedException(
        this.publicId.value,
      );
    }

    if (this.isDisputed()) {
      throw new JourneyCompletionCannotModifyConfirmedException(
        this.publicId.value,
      );
    }

    if (!this.canCancel()) {
      throw new JourneyCompletionInvalidStatusTransitionException(
        this.status.value,
        'CANCELLED',
      );
    }

    this.journeyCompletion.cancel(cancelledAt);

    this.journeyCompletion.incrementVersion();

    this.addDomainEvent(
      new JourneyCompletionCancelledEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyPublicId.value,
        this.providerPublicId.value,
        cancelledAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Confirmation Queries
  // ===========================================================================

  public findConfirmation(
    publicId: JourneyCompletionConfirmationEntity['publicId'],
  ): JourneyCompletionConfirmationEntity | undefined {
    return this.confirmations.find((confirmation) =>
      confirmation.publicId.equals(publicId),
    );
  }

  public findConfirmationByMember(
    memberPublicId: JourneyCompletionConfirmationEntity['memberPublicId'],
  ): JourneyCompletionConfirmationEntity | undefined {
    return this.confirmations.find((confirmation) =>
      confirmation.memberPublicId.equals(memberPublicId),
    );
  }

  public hasConfirmationFromMember(
    memberPublicId: JourneyCompletionConfirmationEntity['memberPublicId'],
  ): boolean {
    return this.findConfirmationByMember(memberPublicId) !== undefined;
  }

  public hasActiveConfirmationFromMember(
    memberPublicId: JourneyCompletionConfirmationEntity['memberPublicId'],
  ): boolean {
    const confirmation = this.findConfirmationByMember(memberPublicId);

    return confirmation?.status.isConfirmed() ?? false;
  }

  // ===========================================================================
  // Dispute Queries
  // ===========================================================================

  public findDispute(
    publicId: JourneyCompletionDisputeEntity['publicId'],
  ): JourneyCompletionDisputeEntity | undefined {
    return this.disputes.find((dispute) => dispute.publicId.equals(publicId));
  }

  private requireDispute(
    publicId: JourneyCompletionDisputeEntity['publicId'],
  ): JourneyCompletionDisputeEntity {
    const dispute = this.findDispute(publicId);

    if (!dispute) {
      throw new JourneyCompletionDisputeNotFoundException(publicId.value);
    }

    return dispute;
  }

  // ===========================================================================
  // Completion State
  // ===========================================================================

  public hasSatisfiedConfirmationRequirement(): boolean {
    return (
      this.requiredConfirmations > 0 &&
      this.confirmedCount >= this.requiredConfirmations
    );
  }

  public isFullyConfirmed(): boolean {
    return this.isConfirmed();
  }

  public isAwaitingConfirmation(): boolean {
    return this.isConfirmationRequired();
  }

  public isAwaitingDisputeResolution(): boolean {
    return this.isDisputed() && this.activeDispute !== undefined;
  }

  public hasOpenDispute(): boolean {
    return this.openDisputes.length > 0;
  }

  // ===========================================================================
  // Consistency Validation
  // ===========================================================================

  public hasValidStructure(): boolean {
    if (!this.journeyPublicId.value) {
      return false;
    }

    if (!this.providerPublicId.value) {
      return false;
    }

    if (this.requiredConfirmations <= 0) {
      return false;
    }

    if (this.confirmedCount < 0) {
      return false;
    }

    if (this.confirmedCount > this.requiredConfirmations) {
      return false;
    }

    if (this.confirmedCount > this.confirmations.length) {
      return false;
    }

    return true;
  }
  /**
   * Ensures that every confirmation belongs to this aggregate and that
   * no member has duplicate confirmation records.
   *
   * Confirmation ownership is validated through the public Journey Completion
   * identity because child entities reference the aggregate through
   * JourneyCompletionPublicId, not the internal UniqueEntityId.
   */
  public hasConsistentConfirmations(): boolean {
    const seenMembers = new Set<string>();

    for (const confirmation of this.confirmations) {
      // -----------------------------------------------------------------------
      // Child Ownership
      // -----------------------------------------------------------------------

      if (!confirmation.completionId.equals(this.publicId)) {
        return false;
      }

      // -----------------------------------------------------------------------
      // Duplicate Member Protection
      // -----------------------------------------------------------------------

      const memberKey = confirmation.memberPublicId.value;

      if (seenMembers.has(memberKey)) {
        return false;
      }

      seenMembers.add(memberKey);
    }

    return true;
  }

  /**
   * Ensures aggregate-level confirmation bookkeeping agrees with the
   * authoritative child confirmation entities.
   */
  public hasConsistentConfirmationCount(): boolean {
    const calculatedCount = this.activeConfirmations.length;

    return calculatedCount === this.confirmedCount;
  }

  /**
   * Ensures the completion lifecycle timestamps agree with its state.
   */
  public hasConsistentLifecycle(): boolean {
    if (this.isPending()) {
      return (
        this.completionRequestedAt === undefined &&
        this.confirmedAt === undefined &&
        this.disputedAt === undefined &&
        this.cancelledAt === undefined
      );
    }

    if (this.isConfirmationRequired()) {
      return (
        this.completionRequestedAt !== undefined &&
        this.confirmedAt === undefined &&
        this.disputedAt === undefined &&
        this.cancelledAt === undefined
      );
    }

    if (this.isConfirmed()) {
      return (
        this.completionRequestedAt !== undefined &&
        this.confirmedAt !== undefined &&
        this.disputedAt === undefined &&
        this.cancelledAt === undefined
      );
    }

    if (this.isDisputed()) {
      return (
        this.completionRequestedAt !== undefined &&
        this.disputedAt !== undefined &&
        this.confirmedAt === undefined &&
        this.cancelledAt === undefined
      );
    }

    if (this.isCancelled()) {
      return (
        this.cancelledAt !== undefined &&
        this.confirmedAt === undefined &&
        this.disputedAt === undefined
      );
    }

    return false;
  }

  /**
   * Ensures there is at most one active dispute.
   */
  public hasConsistentDisputes(): boolean {
    const activeDisputes = this.disputes.filter(
      (dispute) => dispute.status.isOpen() || dispute.status.isUnderReview(),
    );

    return activeDisputes.length <= 1;
  }

  /**
   * Ensures a DISPUTED completion contains a dispute record.
   *
   * The dispute does not have to remain OPEN or UNDER_REVIEW. Once a dispute
   * is resolved, rejected, or withdrawn, it remains part of the aggregate
   * history while no longer being an active dispute.
   */
  public hasConsistentDisputedState(): boolean {
    if (!this.isDisputed()) {
      return true;
    }

    return this.disputes.length > 0;
  }

  // ===========================================================================
  // Aggregate Invariant
  // ===========================================================================

  public assertAggregateInvariant(): void {
    if (!this.hasValidStructure()) {
      throw new JourneyCompletionInvariantException(
        'Journey Completion contains invalid aggregate structure.',
      );
    }

    if (!this.hasConsistentConfirmations()) {
      throw new JourneyCompletionInvariantException(
        'Journey Completion contains invalid or duplicate confirmation entities.',
      );
    }

    if (!this.hasConsistentConfirmationCount()) {
      throw new JourneyCompletionInvariantException(
        'Journey Completion confirmed count does not match active confirmations.',
      );
    }

    if (!this.hasConsistentLifecycle()) {
      throw new JourneyCompletionInvariantException(
        'Journey Completion contains an inconsistent lifecycle state.',
      );
    }

    if (!this.hasConsistentDisputes()) {
      throw new JourneyCompletionInvariantException(
        'Journey Completion contains multiple active disputes.',
      );
    }

    if (!this.hasConsistentDisputedState()) {
      throw new JourneyCompletionInvariantException(
        'A disputed Journey Completion must contain a dispute record.',
      );
    }

    this.assertChildOwnership();
  }

  // ===========================================================================
  // Creation Invariant
  // ===========================================================================

  private assertCreationInvariant(): void {
    if (!this.hasValidStructure()) {
      throw new JourneyCompletionInvariantException(
        'Journey Completion contains invalid aggregate structure.',
      );
    }

    if (!this.isPending()) {
      throw new JourneyCompletionInvariantException(
        'A newly created Journey Completion must be PENDING.',
      );
    }

    if (this.confirmations.length !== 0) {
      throw new JourneyCompletionInvariantException(
        'A newly created Journey Completion cannot contain confirmations.',
      );
    }

    if (this.disputes.length !== 0) {
      throw new JourneyCompletionInvariantException(
        'A newly created Journey Completion cannot contain disputes.',
      );
    }

    if (this.confirmedCount !== 0) {
      throw new JourneyCompletionInvariantException(
        'A newly created Journey Completion must have zero confirmations.',
      );
    }

    if (this.completionRequestedAt !== undefined) {
      throw new JourneyCompletionInvariantException(
        'A newly created Journey Completion cannot have a request timestamp.',
      );
    }

    if (this.confirmedAt !== undefined) {
      throw new JourneyCompletionInvariantException(
        'A newly created Journey Completion cannot have a confirmation timestamp.',
      );
    }

    if (this.disputedAt !== undefined) {
      throw new JourneyCompletionInvariantException(
        'A newly created Journey Completion cannot have a dispute timestamp.',
      );
    }

    if (this.cancelledAt !== undefined) {
      throw new JourneyCompletionInvariantException(
        'A newly created Journey Completion cannot have a cancellation timestamp.',
      );
    }
  }

  // ===========================================================================
  // Child Ownership
  // ===========================================================================

  /**
   * Ensures that every child entity belongs to this Journey Completion
   * aggregate.
   *
   * Child entities reference their owning completion through the public
   * JourneyCompletionPublicId. The aggregate's internal UniqueEntityId is
   * intentionally not used for this comparison.
   */
  private assertChildOwnership(): void {
    // -------------------------------------------------------------------------
    // Confirmations
    // -------------------------------------------------------------------------

    for (const confirmation of this.confirmations) {
      if (!confirmation.completionId.equals(this.publicId)) {
        throw new JourneyCompletionInvariantException(
          `Confirmation "${confirmation.publicId.value}" does not belong to Journey Completion "${this.publicId.value}".`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // Disputes
    // -------------------------------------------------------------------------

    for (const dispute of this.disputes) {
      if (!dispute.completionId.equals(this.publicId)) {
        throw new JourneyCompletionInvariantException(
          `Dispute "${dispute.publicId.value}" does not belong to Journey Completion "${this.publicId.value}".`,
        );
      }
    }
  }
  // ===========================================================================
  // Confirmation Bookkeeping
  // ===========================================================================

  /**
   * Recalculates aggregate confirmation bookkeeping from the authoritative
   * confirmation child entities.
   *
   * The child entities remain authoritative. `confirmedCount` is only
   * aggregate-level bookkeeping.
   */
  private recalculateConfirmedCount(): void {
    const confirmedCount = this.activeConfirmations.length;

    this.journeyCompletion.setConfirmedCount(confirmedCount);
  }

  // ===========================================================================
  // Domain Event Recording
  // ===========================================================================

  public recordDomainEvent(event: JourneyCompletionDomainEvent): void {
    this.addDomainEvent(event);
  }

  // ===========================================================================
  // Created Event
  // ===========================================================================

  private recordCreated(correlationId: string, causationId?: string): void {
    this.addDomainEvent(
      new JourneyCompletionCreatedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyPublicId.value,
        this.providerPublicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Helpers
  // ===========================================================================

  private normalizeOptionalText(value?: string): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    const normalized = value.trim();

    return normalized.length > 0 ? normalized : undefined;
  }
}
