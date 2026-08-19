// -----------------------------------------------------------------------------
// Journey Boarding Aggregate
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyBoardingEntity } from '../entities/journey-boarding.entity';

import type { JourneyBoardingParticipantEntity } from '../entities/journey-boarding-participant.entity';

import type { JourneyBoardingEventEntity } from '../entities/journey-boarding-event.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import {
  JourneyBoardingCreatedEvent,
  JourneyBoardingOpenedEvent,
  JourneyBoardingProviderBoardedEvent,
  JourneyBoardingPassengerBoardedEvent,
  JourneyBoardingPassengerNoShowEvent,
  JourneyBoardingParticipantWithdrawnEvent,
  JourneyBoardingParticipantRemovedEvent,
  JourneyBoardingStartedEvent,
  JourneyBoardingCancelledEvent,
} from '../events';

import type { JourneyBoardingDomainEvent } from '../events';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import {
  JourneyBoardingInvariantException,
  JourneyBoardingInvalidStatusTransitionException,
  JourneyBoardingAlreadyStartedException,
  JourneyBoardingAlreadyCancelledException,
  JourneyBoardingProviderNotBoardedException,
  JourneyBoardingParticipantNotFoundException,
  JourneyBoardingParticipantAlreadyBoardedException,
  JourneyBoardingParticipantAlreadyWithdrawnException,
  JourneyBoardingParticipantAlreadyNoShowException,
  JourneyBoardingParticipantAlreadyRemovedException,
  JourneyBoardingPassengerNotExpectedException,
  JourneyBoardingCannotModifyStartedException,
  JourneyBoardingCannotModifyCancelledException,
} from '../exceptions';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBoardingStatus } from '../value-objects';

import { JourneyBoardingParticipantRole } from '../value-objects';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

/**
 * Aggregate root for the physical boarding lifecycle of a Journey.
 *
 * Aggregate boundary:
 *
 * JourneyBoardingAggregate
 * ├── JourneyBoardingEntity
 * ├── JourneyBoardingParticipantEntity[]
 * └── JourneyBoardingEventEntity[]
 *
 * The aggregate owns:
 *
 * - boarding lifecycle
 * - provider boarding
 * - passenger boarding
 * - passenger no-show
 * - participant withdrawal
 * - participant removal
 * - physical journey start
 * - boarding cancellation
 * - boarding-local event history
 *
 * External bounded contexts are represented through public identifiers only.
 *
 * JourneyBoardingEntity owns the current mutable lifecycle state.
 * Participants and historical boarding events belong to the aggregate
 * consistency boundary and are therefore maintained here.
 */
export class JourneyBoardingAggregate extends AggregateRoot<JourneyBoardingEntity> {
  // ===========================================================================
  // Internal Aggregate State
  // ===========================================================================

  /**
   * Participants currently belonging to this boarding aggregate.
   */
  private readonly participantEntities: JourneyBoardingParticipantEntity[];

  /**
   * Immutable historical boarding events.
   */
  private readonly eventEntities: JourneyBoardingEventEntity[];

  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(
    boarding: JourneyBoardingEntity,
    id?: UniqueEntityId,
    participants: JourneyBoardingParticipantEntity[] = [],
    events: JourneyBoardingEventEntity[] = [],
  ) {
    super(boarding, id);

    this.participantEntities = [...participants];
    this.eventEntities = [...events];
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Journey Boarding aggregate.
   *
   * A newly-created boarding may legitimately have no participants yet.
   * Participant completeness is therefore validated after participants have
   * been attached rather than making aggregate creation impossible.
   */
  public static create(
    boarding: JourneyBoardingEntity,
    correlationId: string,
    causationId?: string,
    participants: JourneyBoardingParticipantEntity[] = [],
    events: JourneyBoardingEventEntity[] = [],
  ): JourneyBoardingAggregate {
    const aggregate = new JourneyBoardingAggregate(
      boarding,
      boarding.id,
      participants,
      events,
    );

    aggregate.assertStructuralInvariant();
    aggregate.recordCreated(correlationId, causationId);

    return aggregate;
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    boarding: JourneyBoardingEntity,
    participants: JourneyBoardingParticipantEntity[] = [],
    events: JourneyBoardingEventEntity[] = [],
  ): JourneyBoardingAggregate {
    const aggregate = new JourneyBoardingAggregate(
      boarding,
      boarding.id,
      participants,
      events,
    );

    aggregate.assertAggregateInvariant();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate Identity
  // ===========================================================================

  public get journeyBoarding(): JourneyBoardingEntity {
    return this.props;
  }

  /**
   * Alias for callers that use `boarding`.
   */
  public get boarding(): JourneyBoardingEntity {
    return this.props;
  }

  public get aggregateId(): UniqueEntityId {
    return this.id;
  }

  public override get publicId(): JourneyBoardingEntity['publicId'] {
    return this.journeyBoarding.publicId;
  }

  // ===========================================================================
  // Journey Reference
  // ===========================================================================

  public get journeyId(): JourneyBoardingEntity['journeyId'] {
    return this.journeyBoarding.journeyId;
  }

  public belongsToJourney(
    journeyId: JourneyBoardingEntity['journeyId'],
  ): boolean {
    return this.journeyId.equals(journeyId);
  }

  // ===========================================================================
  // Provider Reference
  // ===========================================================================

  public get providerPublicId(): JourneyBoardingEntity['providerPublicId'] {
    return this.journeyBoarding.providerPublicId;
  }

  public belongsToProvider(
    providerPublicId: JourneyBoardingEntity['providerPublicId'],
  ): boolean {
    return this.providerPublicId.equals(providerPublicId);
  }

  // ===========================================================================
  // Lifecycle State
  // ===========================================================================

  public get status(): JourneyBoardingStatus {
    return this.journeyBoarding.status;
  }

  public get boardingStartedAt(): Date | undefined {
    return this.journeyBoarding.boardingStartedAt;
  }

  public get journeyStartedAt(): Date | undefined {
    return this.journeyBoarding.journeyStartedAt;
  }

  public get cancelledAt(): Date | undefined {
    return this.journeyBoarding.cancelledAt;
  }

  public get version(): number {
    return this.journeyBoarding.version;
  }

  // ===========================================================================
  // Participants
  // ===========================================================================

  public get participants(): readonly JourneyBoardingParticipantEntity[] {
    return this.participantEntities;
  }

  public get participantCount(): number {
    return this.participantEntities.length;
  }

  public get providerParticipant():
    JourneyBoardingParticipantEntity | undefined {
    return this.participantEntities.find((participant) =>
      participant.role.equals(JourneyBoardingParticipantRole.provider()),
    );
  }

  public get passengerParticipants(): JourneyBoardingParticipantEntity[] {
    return this.participantEntities.filter((participant) =>
      participant.role.equals(JourneyBoardingParticipantRole.passenger()),
    );
  }

  public findParticipant(
    participantPublicId: JourneyBoardingParticipantEntity['publicId'],
  ): JourneyBoardingParticipantEntity | undefined {
    return this.participantEntities.find((participant) =>
      participant.publicId.equals(participantPublicId),
    );
  }

  public findParticipantByMember(
    memberPublicId: JourneyBoardingParticipantEntity['memberPublicId'],
  ): JourneyBoardingParticipantEntity | undefined {
    return this.participantEntities.find((participant) =>
      participant.memberPublicId.equals(memberPublicId),
    );
  }

  public findParticipantByBooking(
    bookingPublicId: JourneyBoardingParticipantEntity['bookingPublicId'],
  ): JourneyBoardingParticipantEntity | undefined {
    if (bookingPublicId === undefined) {
      return undefined;
    }

    return this.participantEntities.find(
      (participant) =>
        participant.bookingPublicId?.equals(bookingPublicId) ?? false,
    );
  }

  // ===========================================================================
  // Event History
  // ===========================================================================

  public get events(): readonly JourneyBoardingEventEntity[] {
    return this.eventEntities;
  }

  public get eventCount(): number {
    return this.eventEntities.length;
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isNotStarted(): boolean {
    return this.status.isNotStarted();
  }

  public isBoarding(): boolean {
    return this.status.isBoarding();
  }

  public isStarted(): boolean {
    return this.status.isStarted();
  }

  public isCancelled(): boolean {
    return this.status.isCancelled();
  }

  public isActive(): boolean {
    return this.isNotStarted() || this.isBoarding();
  }

  public isTerminal(): boolean {
    return this.isStarted() || this.isCancelled();
  }

  // ===========================================================================
  // Lifecycle Capabilities
  // ===========================================================================

  public canOpen(): boolean {
    return this.isNotStarted();
  }

  public canStart(): boolean {
    return this.isBoarding() && this.isProviderBoarded();
  }

  public canCancel(): boolean {
    return !this.isStarted() && !this.isCancelled();
  }

  public canModify(): boolean {
    return !this.isStarted() && !this.isCancelled();
  }

  // ===========================================================================
  // Open Boarding
  // ===========================================================================

  public open(
    correlationId: string,
    causationId?: string,
    boardingStartedAt: Date = new Date(),
  ): void {
    if (this.isBoarding()) {
      return;
    }

    if (this.isStarted()) {
      throw new JourneyBoardingAlreadyStartedException(this.publicId.value);
    }

    if (this.isCancelled()) {
      throw new JourneyBoardingCannotModifyCancelledException(
        this.publicId.value,
      );
    }

    if (!this.isNotStarted()) {
      throw new JourneyBoardingInvalidStatusTransitionException(
        this.status.value,
        'BOARDING',
      );
    }

    this.journeyBoarding.openBoarding(boardingStartedAt);
    this.journeyBoarding.incrementVersion();

    this.addDomainEvent(
      new JourneyBoardingOpenedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyId.value,
        this.providerPublicId.value,
        boardingStartedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Provider Boarding
  // ===========================================================================

  public boardProvider(
    correlationId: string,
    causationId?: string,
    boardedAt: Date = new Date(),
  ): void {
    this.assertBoardingModificationAllowed();

    if (!this.isBoarding()) {
      throw new JourneyBoardingInvalidStatusTransitionException(
        this.status.value,
        'PROVIDER_BOARDED',
      );
    }

    const provider = this.providerParticipant;

    if (provider === undefined) {
      throw new JourneyBoardingParticipantNotFoundException(
        this.providerPublicId.value,
      );
    }

    if (provider.isBoarded()) {
      throw new JourneyBoardingParticipantAlreadyBoardedException(
        provider.publicId.value,
      );
    }

    if (!provider.isExpected()) {
      throw new JourneyBoardingInvalidStatusTransitionException(
        provider.status.value,
        'BOARDED',
      );
    }

    if (!provider.memberPublicId.equals(this.providerPublicId)) {
      throw new JourneyBoardingInvariantException(
        'The provider participant must match the Journey Boarding provider.',
      );
    }

    provider.board(boardedAt);

    this.journeyBoarding.touch(boardedAt);
    this.journeyBoarding.incrementVersion();

    this.addDomainEvent(
      new JourneyBoardingProviderBoardedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyId.value,
        this.providerPublicId.value,
        provider.memberPublicId.value,
        boardedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Passenger Boarding
  // ===========================================================================

  public boardPassenger(
    participantPublicId: JourneyBoardingParticipantEntity['publicId'],
    correlationId: string,
    causationId?: string,
    boardedAt: Date = new Date(),
  ): void {
    this.assertBoardingModificationAllowed();

    if (!this.isBoarding()) {
      throw new JourneyBoardingInvalidStatusTransitionException(
        this.status.value,
        'PASSENGER_BOARDED',
      );
    }

    const participant = this.requirePassenger(participantPublicId);

    if (participant.isBoarded()) {
      throw new JourneyBoardingParticipantAlreadyBoardedException(
        participant.publicId.value,
      );
    }

    if (!participant.isExpected()) {
      throw new JourneyBoardingInvalidStatusTransitionException(
        participant.status.value,
        'BOARDED',
      );
    }

    participant.board(boardedAt);

    this.journeyBoarding.touch(boardedAt);
    this.journeyBoarding.incrementVersion();

    this.addDomainEvent(
      new JourneyBoardingPassengerBoardedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyId.value,
        this.providerPublicId.value,
        participant.memberPublicId.value,
        participant.bookingPublicId?.value,
        boardedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Passenger No-Show
  // ===========================================================================

  public markPassengerNoShow(
    participantPublicId: JourneyBoardingParticipantEntity['publicId'],
    correlationId: string,
    causationId?: string,
    noShowAt: Date = new Date(),
  ): void {
    this.assertBoardingModificationAllowed();

    if (!this.isBoarding()) {
      throw new JourneyBoardingInvalidStatusTransitionException(
        this.status.value,
        'PASSENGER_NO_SHOW',
      );
    }

    const participant = this.requirePassenger(participantPublicId);

    if (participant.isNoShow()) {
      throw new JourneyBoardingParticipantAlreadyNoShowException(
        participant.publicId.value,
      );
    }

    if (participant.isBoarded()) {
      throw new JourneyBoardingInvariantException(
        'A boarded passenger cannot be marked as a no-show.',
      );
    }

    if (!participant.isExpected()) {
      throw new JourneyBoardingInvalidStatusTransitionException(
        participant.status.value,
        'NO_SHOW',
      );
    }

    participant.markNoShow(noShowAt);

    this.journeyBoarding.touch(noShowAt);
    this.journeyBoarding.incrementVersion();

    this.addDomainEvent(
      new JourneyBoardingPassengerNoShowEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyId.value,
        this.providerPublicId.value,
        participant.memberPublicId.value,
        participant.bookingPublicId?.value,
        noShowAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Participant Withdrawal
  // ===========================================================================

  public withdrawParticipant(
    participantPublicId: JourneyBoardingParticipantEntity['publicId'],
    correlationId: string,
    causationId?: string,
    withdrawnAt: Date = new Date(),
  ): void {
    this.assertParticipantModificationAllowed();

    const participant = this.requireParticipant(participantPublicId);

    if (participant.isWithdrawn()) {
      throw new JourneyBoardingParticipantAlreadyWithdrawnException(
        participant.publicId.value,
      );
    }

    if (participant.isBoarded()) {
      throw new JourneyBoardingInvariantException(
        'A boarded participant cannot withdraw from boarding.',
      );
    }

    if (!participant.isExpected()) {
      throw new JourneyBoardingInvalidStatusTransitionException(
        participant.status.value,
        'WITHDRAWN',
      );
    }

    participant.withdraw(withdrawnAt);

    this.journeyBoarding.touch(withdrawnAt);
    this.journeyBoarding.incrementVersion();

    this.addDomainEvent(
      new JourneyBoardingParticipantWithdrawnEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyId.value,
        this.providerPublicId.value,
        participant.memberPublicId.value,
        participant.bookingPublicId?.value,
        withdrawnAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Participant Removal
  // ===========================================================================

  public removeParticipant(
    participantPublicId: JourneyBoardingParticipantEntity['publicId'],
    correlationId: string,
    causationId?: string,
    removedAt: Date = new Date(),
    actorPublicId?: JourneyBoardingParticipantEntity['memberPublicId'],
  ): void {
    this.assertParticipantModificationAllowed();

    const participant = this.requireParticipant(participantPublicId);

    if (participant.isRemoved()) {
      throw new JourneyBoardingParticipantAlreadyRemovedException(
        participant.publicId.value,
      );
    }

    if (participant.isBoarded()) {
      throw new JourneyBoardingInvariantException(
        'A boarded participant cannot be removed from boarding.',
      );
    }

    if (!participant.isExpected() && !participant.isWithdrawn()) {
      throw new JourneyBoardingInvalidStatusTransitionException(
        participant.status.value,
        'REMOVED',
      );
    }

    participant.remove(removedAt);

    this.journeyBoarding.touch(removedAt);
    this.journeyBoarding.incrementVersion();

    this.addDomainEvent(
      new JourneyBoardingParticipantRemovedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyId.value,
        this.providerPublicId.value,
        participant.memberPublicId.value,
        participant.bookingPublicId?.value,
        actorPublicId?.value,
        removedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Journey Start
  // ===========================================================================

  public startJourney(
    correlationId: string,
    causationId?: string,
    journeyStartedAt: Date = new Date(),
  ): void {
    if (this.isStarted()) {
      throw new JourneyBoardingAlreadyStartedException(this.publicId.value);
    }

    if (this.isCancelled()) {
      throw new JourneyBoardingCannotModifyCancelledException(
        this.publicId.value,
      );
    }

    if (!this.isBoarding()) {
      throw new JourneyBoardingInvalidStatusTransitionException(
        this.status.value,
        'STARTED',
      );
    }

    const provider = this.providerParticipant;

    if (provider === undefined || !provider.isBoarded()) {
      throw new JourneyBoardingProviderNotBoardedException(
        this.providerPublicId.value,
      );
    }

    this.journeyBoarding.startJourney(journeyStartedAt);
    this.journeyBoarding.incrementVersion();

    this.addDomainEvent(
      new JourneyBoardingStartedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyId.value,
        this.providerPublicId.value,
        journeyStartedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Cancellation
  // ===========================================================================

  public cancel(
    correlationId: string,
    causationId?: string,
    cancelledAt: Date = new Date(),
    actorPublicId?: JourneyBoardingParticipantEntity['memberPublicId'],
  ): void {
    if (this.isCancelled()) {
      throw new JourneyBoardingAlreadyCancelledException(this.publicId.value);
    }

    if (this.isStarted()) {
      throw new JourneyBoardingCannotModifyStartedException(
        this.publicId.value,
      );
    }

    if (!this.canCancel()) {
      throw new JourneyBoardingInvalidStatusTransitionException(
        this.status.value,
        'CANCELLED',
      );
    }

    this.journeyBoarding.cancel(cancelledAt);
    this.journeyBoarding.incrementVersion();

    this.addDomainEvent(
      new JourneyBoardingCancelledEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyId.value,
        this.providerPublicId.value,
        cancelledAt,
        actorPublicId?.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Participant Management
  // ===========================================================================

  public addParticipant(participant: JourneyBoardingParticipantEntity): void {
    if (!participant) {
      throw new JourneyBoardingInvariantException(
        'Journey boarding participant is required.',
      );
    }

    this.assertParticipantModificationAllowed();

    /**
     * Participant.boardingId must reference the Journey Boarding public ID,
     * not the Journey public ID.
     */
    if (participant.boardingId.value !== this.publicId.value) {
      throw new JourneyBoardingInvariantException(
        `Participant "${participant.publicId.value}" does not belong to Journey Boarding "${this.publicId.value}".`,
      );
    }

    if (this.hasParticipant(participant.publicId)) {
      throw new JourneyBoardingInvariantException(
        `Journey boarding participant "${participant.publicId.value}" already exists.`,
      );
    }

    if (this.hasMember(participant.memberPublicId)) {
      throw new JourneyBoardingInvariantException(
        `Member "${participant.memberPublicId.value}" is already a boarding participant.`,
      );
    }

    if (
      participant.role.equals(JourneyBoardingParticipantRole.provider()) &&
      this.providerParticipant !== undefined
    ) {
      throw new JourneyBoardingInvariantException(
        'A Journey Boarding aggregate can contain only one provider participant.',
      );
    }

    if (
      participant.role.equals(JourneyBoardingParticipantRole.provider()) &&
      !participant.memberPublicId.equals(this.providerPublicId)
    ) {
      throw new JourneyBoardingInvariantException(
        'The provider participant must match the Journey Boarding provider.',
      );
    }

    if (
      participant.role.equals(JourneyBoardingParticipantRole.passenger()) &&
      participant.bookingPublicId === undefined
    ) {
      throw new JourneyBoardingInvariantException(
        'A passenger boarding participant must have a Journey Booking public ID.',
      );
    }

    if (
      participant.role.equals(JourneyBoardingParticipantRole.provider()) &&
      participant.bookingPublicId !== undefined
    ) {
      throw new JourneyBoardingInvariantException(
        'A provider boarding participant cannot have a Journey Booking public ID.',
      );
    }

    this.participantEntities.push(participant);

    this.journeyBoarding.touch();
    this.journeyBoarding.incrementVersion();
  }

  public removeParticipantEntity(
    participantPublicId: JourneyBoardingParticipantEntity['publicId'],
  ): void {
    this.assertParticipantModificationAllowed();

    const participant = this.requireParticipant(participantPublicId);

    if (participant.isBoarded()) {
      throw new JourneyBoardingInvariantException(
        'A boarded participant cannot be removed from the aggregate.',
      );
    }

    const index = this.participantEntities.findIndex((candidate) =>
      candidate.publicId.equals(participant.publicId),
    );

    if (index === -1) {
      throw new JourneyBoardingParticipantNotFoundException(
        participant.publicId.value,
      );
    }

    this.participantEntities.splice(index, 1);

    this.journeyBoarding.touch();
    this.journeyBoarding.incrementVersion();
  }

  // ===========================================================================
  // Boarding Event History
  // ===========================================================================

  /**
   * Adds an immutable historical event to the aggregate.
   *
   * `event.boardingId` must identify this Journey Boarding aggregate.
   */
  public addBoardingEvent(event: JourneyBoardingEventEntity): void {
    if (!event) {
      throw new JourneyBoardingInvariantException(
        'Journey boarding event is required.',
      );
    }

    if (event.boardingId.value !== this.publicId.value) {
      throw new JourneyBoardingInvariantException(
        `Journey boarding event "${event.publicId.value}" does not belong to Journey Boarding "${this.publicId.value}".`,
      );
    }

    if (this.hasEvent(event.publicId)) {
      throw new JourneyBoardingInvariantException(
        `Journey boarding event "${event.publicId.value}" already exists.`,
      );
    }

    this.eventEntities.push(event);

    this.journeyBoarding.setUpdatedAt(event.occurredAt);
  }

  public hasEvent(
    eventPublicId: JourneyBoardingEventEntity['publicId'],
  ): boolean {
    return this.eventEntities.some((event) =>
      event.publicId.equals(eventPublicId),
    );
  }

  // ===========================================================================
  // Participant Queries
  // ===========================================================================

  public hasParticipant(
    participantPublicId: JourneyBoardingParticipantEntity['publicId'],
  ): boolean {
    return this.findParticipant(participantPublicId) !== undefined;
  }

  public hasMember(
    memberPublicId: JourneyBoardingParticipantEntity['memberPublicId'],
  ): boolean {
    return this.findParticipantByMember(memberPublicId) !== undefined;
  }

  public hasBooking(
    bookingPublicId: NonNullable<
      JourneyBoardingParticipantEntity['bookingPublicId']
    >,
  ): boolean {
    return this.findParticipantByBooking(bookingPublicId) !== undefined;
  }

  public isProviderBoarded(): boolean {
    return this.providerParticipant?.isBoarded() ?? false;
  }

  public isPassengerBoarded(
    participantPublicId: JourneyBoardingParticipantEntity['publicId'],
  ): boolean {
    const participant = this.findParticipant(participantPublicId);

    return (
      participant !== undefined &&
      participant.role.equals(JourneyBoardingParticipantRole.passenger()) &&
      participant.isBoarded()
    );
  }

  public boardedParticipants(): JourneyBoardingParticipantEntity[] {
    return this.participantEntities.filter((participant) =>
      participant.isBoarded(),
    );
  }

  public expectedParticipants(): JourneyBoardingParticipantEntity[] {
    return this.participantEntities.filter((participant) =>
      participant.isExpected(),
    );
  }

  public withdrawnParticipants(): JourneyBoardingParticipantEntity[] {
    return this.participantEntities.filter((participant) =>
      participant.isWithdrawn(),
    );
  }

  public noShowParticipants(): JourneyBoardingParticipantEntity[] {
    return this.participantEntities.filter((participant) =>
      participant.isNoShow(),
    );
  }

  public removedParticipants(): JourneyBoardingParticipantEntity[] {
    return this.participantEntities.filter((participant) =>
      participant.isRemoved(),
    );
  }

  public passengerCount(): number {
    return this.passengerParticipants.length;
  }

  public boardedPassengerCount(): number {
    return this.passengerParticipants.filter((participant) =>
      participant.isBoarded(),
    ).length;
  }

  public pendingPassengerCount(): number {
    return this.passengerParticipants.filter((participant) =>
      participant.isExpected(),
    ).length;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * A Journey Boarding is complete once the physical journey has started.
   */
  public isComplete(): boolean {
    return this.isStarted();
  }

  public hasProviderParticipant(): boolean {
    return this.providerParticipant !== undefined;
  }

  /**
   * Structural participant validation.
   *
   * Unlike `hasConsistentParticipants()`, this method allows an empty
   * participant collection while the aggregate is being constructed.
   */
  public hasValidParticipantStructure(): boolean {
    const memberIds = new Set<string>();
    let providerCount = 0;

    for (const participant of this.participantEntities) {
      if (participant.boardingId.value !== this.publicId.value) {
        return false;
      }

      const memberId = participant.memberPublicId.value;

      if (memberIds.has(memberId)) {
        return false;
      }

      memberIds.add(memberId);

      if (participant.role.equals(JourneyBoardingParticipantRole.provider())) {
        providerCount += 1;

        if (providerCount > 1) {
          return false;
        }

        if (!participant.memberPublicId.equals(this.providerPublicId)) {
          return false;
        }

        if (participant.bookingPublicId !== undefined) {
          return false;
        }
      }

      if (
        participant.role.equals(JourneyBoardingParticipantRole.passenger()) &&
        participant.bookingPublicId === undefined
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Strong participant invariant.
   *
   * A provider participant is required once the boarding lifecycle is opened.
   * This allows a newly-created aggregate to be assembled before opening.
   */
  public hasConsistentParticipants(): boolean {
    if (!this.hasValidParticipantStructure()) {
      return false;
    }

    if (this.isNotStarted()) {
      return true;
    }

    return this.hasProviderParticipant();
  }

  public hasConsistentLifecycle(): boolean {
    if (this.isNotStarted()) {
      return (
        this.boardingStartedAt === undefined &&
        this.journeyStartedAt === undefined &&
        this.cancelledAt === undefined
      );
    }

    if (this.isBoarding()) {
      return (
        this.boardingStartedAt !== undefined &&
        this.journeyStartedAt === undefined &&
        this.cancelledAt === undefined
      );
    }

    if (this.isStarted()) {
      return (
        this.boardingStartedAt !== undefined &&
        this.journeyStartedAt !== undefined &&
        this.cancelledAt === undefined
      );
    }

    if (this.isCancelled()) {
      return (
        this.cancelledAt !== undefined && this.journeyStartedAt === undefined
      );
    }

    return false;
  }

  public hasConsistentEvents(): boolean {
    const eventIds = new Set<string>();

    for (const event of this.eventEntities) {
      if (event.boardingId.value !== this.publicId.value) {
        return false;
      }

      if (eventIds.has(event.publicId.value)) {
        return false;
      }

      eventIds.add(event.publicId.value);
    }

    return true;
  }

  /**
   * Validates all invariants that must hold for the complete aggregate.
   */
  public assertAggregateInvariant(): void {
    if (!this.hasConsistentParticipants()) {
      throw new JourneyBoardingInvariantException(
        'Journey Boarding contains inconsistent participants.',
      );
    }

    if (!this.hasConsistentLifecycle()) {
      throw new JourneyBoardingInvariantException(
        'Journey Boarding contains an inconsistent lifecycle state.',
      );
    }

    if (!this.hasConsistentEvents()) {
      throw new JourneyBoardingInvariantException(
        'Journey Boarding contains inconsistent historical events.',
      );
    }
  }

  /**
   * Validates invariants that must hold while assembling a newly-created
   * aggregate before its participants are necessarily attached.
   */
  private assertStructuralInvariant(): void {
    if (!this.hasValidParticipantStructure()) {
      throw new JourneyBoardingInvariantException(
        'Journey Boarding contains structurally invalid participants.',
      );
    }

    if (!this.hasConsistentLifecycle()) {
      throw new JourneyBoardingInvariantException(
        'Journey Boarding contains an inconsistent lifecycle state.',
      );
    }

    if (!this.hasConsistentEvents()) {
      throw new JourneyBoardingInvariantException(
        'Journey Boarding contains inconsistent historical events.',
      );
    }
  }

  // ===========================================================================
  // Domain Event Recording
  // ===========================================================================

  public recordDomainEvent(event: JourneyBoardingDomainEvent): void {
    this.addDomainEvent(event);
  }

  // ===========================================================================
  // Created Event
  // ===========================================================================

  private recordCreated(correlationId: string, causationId?: string): void {
    this.addDomainEvent(
      new JourneyBoardingCreatedEvent(
        this.id.toString(),
        this.publicId.value,
        this.journeyId.value,
        this.providerPublicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Internal Helpers
  // ===========================================================================

  private requireParticipant(
    participantPublicId: JourneyBoardingParticipantEntity['publicId'],
  ): JourneyBoardingParticipantEntity {
    const participant = this.findParticipant(participantPublicId);

    if (participant === undefined) {
      throw new JourneyBoardingParticipantNotFoundException(
        participantPublicId.value,
      );
    }

    return participant;
  }

  private requirePassenger(
    participantPublicId: JourneyBoardingParticipantEntity['publicId'],
  ): JourneyBoardingParticipantEntity {
    const participant = this.requireParticipant(participantPublicId);

    if (!participant.role.equals(JourneyBoardingParticipantRole.passenger())) {
      throw new JourneyBoardingPassengerNotExpectedException(
        participant.memberPublicId.value,
      );
    }

    return participant;
  }

  private assertBoardingModificationAllowed(): void {
    if (this.isStarted()) {
      throw new JourneyBoardingAlreadyStartedException(this.publicId.value);
    }

    if (this.isCancelled()) {
      throw new JourneyBoardingCannotModifyCancelledException(
        this.publicId.value,
      );
    }
  }

  private assertParticipantModificationAllowed(): void {
    if (this.isStarted()) {
      throw new JourneyBoardingCannotModifyStartedException(
        this.publicId.value,
      );
    }

    if (this.isCancelled()) {
      throw new JourneyBoardingCannotModifyCancelledException(
        this.publicId.value,
      );
    }
  }
}
