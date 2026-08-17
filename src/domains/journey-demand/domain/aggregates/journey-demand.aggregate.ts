// src/domains/journey-demand/domain/aggregates/journey-demand.aggregate.ts

// -----------------------------------------------------------------------------
// Journey Demand Aggregate
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { JourneyDemandEntity } from '../entities/journey-demand.entity';
import type { JourneyDemandCorridorEntity } from '../entities/journey-demand-corridor.entity';
import type { JourneyDemandWaypointEntity } from '../entities/journey-demand-waypoint.entity';
import type { JourneyDemandScheduleEntity } from '../entities/journey-demand-schedule.entity';
import type { JourneyDemandCapacityEntity } from '../entities/journey-demand-capacity.entity';
import type { JourneyDemandPricingEntity } from '../entities/journey-demand-pricing.entity';
import type { JourneyDemandParticipantEntity } from '../entities/journey-demand-participant.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import {
  JourneyDemandCreatedEvent,
  JourneyDemandUpdatedEvent,
  JourneyDemandPublishedEvent,
  JourneyDemandMatchedEvent,
  JourneyDemandConvertedEvent,
  JourneyDemandFulfilledEvent,
  JourneyDemandCancelledEvent,
  JourneyDemandExpiredEvent,
  JourneyDemandCorridorUpdatedEvent,
  JourneyDemandScheduleUpdatedEvent,
  JourneyDemandCapacityUpdatedEvent,
  JourneyDemandPricingUpdatedEvent,
  JourneyDemandWaypointAddedEvent,
  JourneyDemandWaypointUpdatedEvent,
  JourneyDemandWaypointRemovedEvent,
  JourneyDemandParticipantAddedEvent,
  JourneyDemandParticipantUpdatedEvent,
  JourneyDemandParticipantWithdrawnEvent,
  JourneyDemandParticipantRemovedEvent,
} from '../events';

import type { JourneyDemandDomainEvent } from '../events';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyDemandStatus,
  JourneyDemandStatusValueObject,
} from '../value-objects/journey-demand-status.vo';

import type { MemberPublicId } from '../value-objects/member-public-id.vo';
import type {
  JourneyDemandCurrency,
  JourneyDemandPrice,
} from '../value-objects';
import {
  JourneyDemandArrivalWindow,
  JourneyDemandCoordinate,
  JourneyDemandLocation,
  JourneyDemandScheduleWindow,
  JourneyDemandSeats,
  JourneyDemandSequence,
  JourneyDemandTimezone,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

/**
 * Aggregate root for the Journey Demand domain.
 *
 * Aggregate boundary:
 *
 * JourneyDemandAggregate
 * ├── JourneyDemandEntity
 * ├── JourneyDemandCorridorEntity?
 * │   └── JourneyDemandWaypointEntity[]
 * ├── JourneyDemandScheduleEntity?
 * ├── JourneyDemandCapacityEntity?
 * ├── JourneyDemandPricingEntity?
 * └── JourneyDemandParticipantEntity[]
 *
 * JourneyDemandEntity remains the canonical state holder.
 *
 * Identity rule:
 *
 * - JourneyDemandEntity.id                  -> internal UniqueEntityId
 * - JourneyDemandEntity.publicId            -> foundation PublicEntityId
 * - Child entity.id                         -> internal UniqueEntityId
 * - Child entity.publicId                   -> strongly typed public identifier
 *
 * The aggregate never conflates internal IDs with public IDs.
 */
export class JourneyDemandAggregate extends AggregateRoot<JourneyDemandEntity> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(demand: JourneyDemandEntity, id?: UniqueEntityId) {
    super(demand, id);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(demand: JourneyDemandEntity): JourneyDemandAggregate {
    return new JourneyDemandAggregate(demand, demand.id);
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrate the complete aggregate.
   *
   * The persistence layer supplies the root entity and its owned child
   * entities. JourneyDemandEntity remains the canonical aggregate state
   * container.
   */
  public static rehydrate(
    demand: JourneyDemandEntity,
    corridor?: JourneyDemandCorridorEntity,
    schedule?: JourneyDemandScheduleEntity,
    capacity?: JourneyDemandCapacityEntity,
    pricing?: JourneyDemandPricingEntity,
    waypoints: JourneyDemandWaypointEntity[] = [],
    participants: JourneyDemandParticipantEntity[] = [],
  ): JourneyDemandAggregate {
    const aggregate = new JourneyDemandAggregate(demand, demand.id);

    // -------------------------------------------------------------------------
    // Corridor / Waypoints
    // -------------------------------------------------------------------------

    if (corridor !== undefined) {
      corridor.setWaypoints([...waypoints]);
      demand.setCorridor(corridor);
    } else if (waypoints.length > 0) {
      throw new Error(
        'Cannot rehydrate Journey Demand waypoints without a Journey Demand corridor.',
      );
    }

    // -------------------------------------------------------------------------
    // Optional Components
    // -------------------------------------------------------------------------

    demand.setSchedule(schedule);
    demand.setCapacity(capacity);
    demand.setPricing(pricing);

    // -------------------------------------------------------------------------
    // Participants
    // -------------------------------------------------------------------------

    demand.setParticipants([...participants]);

    return aggregate;
  }

  // ===========================================================================
  // Aggregate Identity
  // ===========================================================================

  public get journeyDemand(): JourneyDemandEntity {
    return this.props;
  }

  /**
   * Backward-compatible alias.
   */
  public get demand(): JourneyDemandEntity {
    return this.props;
  }

  public get aggregateId(): UniqueEntityId {
    return this.id;
  }

  // ===========================================================================
  // Requester
  // ===========================================================================

  public get requesterPublicId() {
    return this.journeyDemand.requesterPublicId;
  }

  public belongsToRequester(
    requesterPublicId: typeof this.requesterPublicId,
  ): boolean {
    return this.journeyDemand.belongsToRequester(requesterPublicId);
  }

  // ===========================================================================
  // Lifecycle State
  // ===========================================================================

  public get status(): JourneyDemandStatusValueObject {
    return this.journeyDemand.status;
  }

  public get publishedAt(): Date | undefined {
    return this.journeyDemand.publishedAt;
  }

  public get matchedAt(): Date | undefined {
    return this.journeyDemand.matchedAt;
  }

  public get convertedAt(): Date | undefined {
    return this.journeyDemand.convertedAt;
  }

  public get fulfilledAt(): Date | undefined {
    return this.journeyDemand.fulfilledAt;
  }

  public get cancelledAt(): Date | undefined {
    return this.journeyDemand.cancelledAt;
  }

  public get expiredAt(): Date | undefined {
    return this.journeyDemand.expiredAt;
  }

  public get version(): number {
    return this.journeyDemand.version;
  }

  // ===========================================================================
  // Cross-Aggregate Journey
  // ===========================================================================

  public get matchedJourneyPublicId() {
    return this.journeyDemand.matchedJourneyPublicId;
  }

  public hasMatchedJourney(): boolean {
    return this.journeyDemand.matchedJourneyPublicId !== undefined;
  }

  // ===========================================================================
  // Components
  // ===========================================================================

  public get corridor(): JourneyDemandCorridorEntity | undefined {
    return this.journeyDemand.corridor;
  }

  public get schedule(): JourneyDemandScheduleEntity | undefined {
    return this.journeyDemand.schedule;
  }

  public get capacity(): JourneyDemandCapacityEntity | undefined {
    return this.journeyDemand.capacity;
  }

  public get pricing(): JourneyDemandPricingEntity | undefined {
    return this.journeyDemand.pricing;
  }

  public get waypoints(): readonly JourneyDemandWaypointEntity[] {
    return this.journeyDemand.corridor?.waypoints ?? [];
  }

  public get participants(): readonly JourneyDemandParticipantEntity[] {
    return this.journeyDemand.participants;
  }

  // ===========================================================================
  // Lifecycle Commands
  // ===========================================================================

  public publish(
    correlationId: string,
    causationId?: string,
    publishedAt: Date = new Date(),
  ): void {
    if (!this.canPublish()) {
      return;
    }

    this.journeyDemand.setStatus(
      new JourneyDemandStatusValueObject(JourneyDemandStatus.OPEN),
    );

    this.journeyDemand.setPublishedAt(publishedAt);
    this.journeyDemand.setUpdatedAt(publishedAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandPublishedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        publishedAt,
        correlationId,
        causationId,
      ),
    );
  }

  public match(
    matchedJourneyPublicId: NonNullable<
      JourneyDemandEntity['matchedJourneyPublicId']
    >,
    correlationId: string,
    causationId?: string,
    matchedAt: Date = new Date(),
  ): void {
    if (!this.canMatch()) {
      return;
    }

    this.journeyDemand.setStatus(
      new JourneyDemandStatusValueObject(JourneyDemandStatus.MATCHED),
    );

    this.journeyDemand.setMatchedJourneyPublicId(matchedJourneyPublicId);

    this.journeyDemand.setMatchedAt(matchedAt);
    this.journeyDemand.setUpdatedAt(matchedAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandMatchedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        matchedJourneyPublicId.value,
        matchedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Convert
  // ===========================================================================

  public convert(
    journeyPublicId: NonNullable<JourneyDemandEntity['matchedJourneyPublicId']>,
    correlationId: string,
    causationId?: string,
    convertedAt: Date = new Date(),
  ): void {
    if (!this.canConvert()) {
      return;
    }

    const matchedJourney = this.journeyDemand.matchedJourneyPublicId;

    if (matchedJourney === undefined) {
      throw new Error(
        'A matched Journey is required before converting a Journey Demand.',
      );
    }

    // -------------------------------------------------------------------------
    // Ensure the Journey being converted from the demand is the Journey that
    // was previously matched to this demand.
    // -------------------------------------------------------------------------

    if (!matchedJourney.equals(journeyPublicId)) {
      throw new Error(
        'The Journey being converted does not match the Journey previously matched to this Journey Demand.',
      );
    }

    // -------------------------------------------------------------------------
    // Transition
    // -------------------------------------------------------------------------

    this.journeyDemand.setStatus(
      new JourneyDemandStatusValueObject(JourneyDemandStatus.CONVERTED),
    );

    this.journeyDemand.setConvertedAt(convertedAt);

    this.journeyDemand.setUpdatedAt(convertedAt);

    this.journeyDemand.incrementVersion();

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new JourneyDemandConvertedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        journeyPublicId.value,
        convertedAt,
        correlationId,
        causationId,
      ),
    );
  }

  public fulfill(
    correlationId: string,
    causationId?: string,
    fulfilledAt: Date = new Date(),
  ): void {
    if (!this.canFulfill()) {
      return;
    }

    this.journeyDemand.setStatus(
      new JourneyDemandStatusValueObject(JourneyDemandStatus.FULFILLED),
    );

    this.journeyDemand.setFulfilledAt(fulfilledAt);
    this.journeyDemand.setUpdatedAt(fulfilledAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandFulfilledEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        fulfilledAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Cancel
  // ===========================================================================

  public cancel(
    correlationId: string,
    causationId?: string,
    reason?: string,
    cancelledAt: Date = new Date(),
  ): void {
    if (!this.canCancel()) {
      return;
    }

    this.journeyDemand.setStatus(
      new JourneyDemandStatusValueObject(JourneyDemandStatus.CANCELLED),
    );

    this.journeyDemand.setCancelledAt(cancelledAt);
    this.journeyDemand.setUpdatedAt(cancelledAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandCancelledEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        cancelledAt,
        reason,
        correlationId,
        causationId,
      ),
    );
  }
  public expire(
    correlationId: string,
    causationId?: string,
    expiredAt: Date = new Date(),
  ): void {
    if (!this.canExpire()) {
      return;
    }

    this.journeyDemand.setStatus(
      new JourneyDemandStatusValueObject(JourneyDemandStatus.EXPIRED),
    );

    this.journeyDemand.setExpiredAt(expiredAt);
    this.journeyDemand.setUpdatedAt(expiredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandExpiredEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        expiredAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isDraft(): boolean {
    return this.journeyDemand.status.value === JourneyDemandStatus.DRAFT;
  }

  public isOpen(): boolean {
    return this.journeyDemand.status.value === JourneyDemandStatus.OPEN;
  }

  public isMatched(): boolean {
    return this.journeyDemand.status.value === JourneyDemandStatus.MATCHED;
  }

  public isConverted(): boolean {
    return this.journeyDemand.status.value === JourneyDemandStatus.CONVERTED;
  }

  public isFulfilled(): boolean {
    return this.journeyDemand.status.value === JourneyDemandStatus.FULFILLED;
  }

  public isCancelled(): boolean {
    return this.journeyDemand.status.value === JourneyDemandStatus.CANCELLED;
  }

  public isExpired(): boolean {
    return this.journeyDemand.status.value === JourneyDemandStatus.EXPIRED;
  }

  public isTerminal(): boolean {
    return this.isFulfilled() || this.isCancelled() || this.isExpired();
  }

  public isActive(): boolean {
    return (
      this.isDraft() || this.isOpen() || this.isMatched() || this.isConverted()
    );
  }

  // ===========================================================================
  // Lifecycle Capabilities
  // ===========================================================================

  public canPublish(): boolean {
    return this.isDraft() && this.hasRequiredComponents();
  }

  public canMatch(): boolean {
    return (
      this.isOpen() &&
      this.hasRequiredComponents() &&
      this.hasAvailableCapacity()
    );
  }

  public canConvert(): boolean {
    return this.isMatched() && this.hasMatchedJourney();
  }

  public canFulfill(): boolean {
    return this.isConverted();
  }

  public canCancel(): boolean {
    return !this.isTerminal();
  }

  public canExpire(): boolean {
    return !this.isTerminal();
  }

  // ===========================================================================
  // Corridor
  // ===========================================================================

  public attachCorridor(corridor: JourneyDemandCorridorEntity): void {
    this.journeyDemand.setCorridor(corridor);
  }

  public removeCorridor(): void {
    if (this.hasWaypoints()) {
      throw new Error(
        'Cannot remove Journey Demand corridor while waypoints are attached.',
      );
    }

    this.journeyDemand.setCorridor(undefined);
  }

  public hasCorridor(): boolean {
    return this.journeyDemand.hasCorridor();
  }

  public get corridorId(): JourneyDemandCorridorEntity['publicId'] | undefined {
    return this.corridor?.publicId;
  }

  // ===========================================================================
  // Waypoints
  // ===========================================================================

  public addWaypoint(waypoint: JourneyDemandWaypointEntity): void {
    const corridor = this.corridor;

    if (corridor === undefined) {
      throw new Error(
        'A Journey Demand corridor is required before adding waypoints.',
      );
    }

    // -------------------------------------------------------------------------
    // Prevent duplicate waypoint by public identity.
    // -------------------------------------------------------------------------

    const existing = corridor.getWaypointByPublicId(waypoint.publicId);

    if (existing !== undefined) {
      return;
    }

    corridor.addWaypoint(waypoint);
  }

  // ===========================================================================
  // Waypoint Update
  // ===========================================================================

  public updateWaypoint(
    waypointPublicId: JourneyDemandWaypointEntity['publicId'],
    changes: {
      name?: string;
      latitude?: number;
      longitude?: number;
      sequence?: number;
    },
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    const corridor = this.corridor;

    // -------------------------------------------------------------------------
    // Corridor
    // -------------------------------------------------------------------------

    if (corridor === undefined) {
      throw new Error(
        'A Journey Demand corridor is required before updating a waypoint.',
      );
    }

    // -------------------------------------------------------------------------
    // Locate waypoint
    // -------------------------------------------------------------------------

    const waypoint = corridor.getWaypointByPublicId(waypointPublicId);

    if (waypoint === undefined) {
      throw new Error(
        `Journey Demand waypoint '${waypointPublicId.value}' was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Validate changes
    // -------------------------------------------------------------------------

    const hasChanges =
      changes.name !== undefined ||
      changes.latitude !== undefined ||
      changes.longitude !== undefined ||
      changes.sequence !== undefined;

    if (!hasChanges) {
      return;
    }

    // -------------------------------------------------------------------------
    // Name
    // -------------------------------------------------------------------------

    if (changes.name !== undefined) {
      const normalizedName = changes.name.trim();

      if (normalizedName.length === 0) {
        throw new Error('Journey Demand waypoint name cannot be empty.');
      }

      waypoint.setName(new JourneyDemandLocation(normalizedName));
    }

    // -------------------------------------------------------------------------
    // Coordinates
    //
    // JourneyDemandCoordinate represents the complete geographic position.
    // Therefore latitude and longitude are reconstructed together whenever
    // either coordinate component changes.
    // -------------------------------------------------------------------------

    if (changes.latitude !== undefined || changes.longitude !== undefined) {
      const latitude =
        changes.latitude !== undefined ? changes.latitude : waypoint.latitude;

      const longitude =
        changes.longitude !== undefined
          ? changes.longitude
          : waypoint.longitude;

      waypoint.setCoordinates(new JourneyDemandCoordinate(latitude, longitude));
    }

    // -------------------------------------------------------------------------
    // Sequence
    // -------------------------------------------------------------------------

    if (changes.sequence !== undefined) {
      waypoint.setSequence(new JourneyDemandSequence(changes.sequence));
    }

    // -------------------------------------------------------------------------
    // Aggregate audit/version
    // -------------------------------------------------------------------------

    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new JourneyDemandWaypointUpdatedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        waypoint.publicId.value,
        corridor.publicId.value,
        waypoint.sequence.value,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  public removeWaypoint(
    waypointPublicId: JourneyDemandWaypointEntity['publicId'],
  ): void {
    const corridor = this.corridor;

    if (corridor === undefined) {
      return;
    }

    const waypoint = corridor.getWaypointByPublicId(waypointPublicId);

    if (waypoint === undefined) {
      return;
    }

    corridor.removeWaypoint(waypoint);
  }

  public getWaypointByPublicId(
    waypointPublicId: JourneyDemandWaypointEntity['publicId'],
  ): JourneyDemandWaypointEntity | undefined {
    return this.corridor?.getWaypointByPublicId(waypointPublicId);
  }

  public hasWaypoint(
    waypointPublicId: JourneyDemandWaypointEntity['publicId'],
  ): boolean {
    return this.getWaypointByPublicId(waypointPublicId) !== undefined;
  }

  public hasWaypoints(): boolean {
    return this.corridor?.hasWaypoints() ?? false;
  }

  public getWaypointCount(): number {
    return this.corridor?.waypointCount() ?? 0;
  }

  // ===========================================================================
  // Schedule
  // ===========================================================================

  public attachSchedule(schedule: JourneyDemandScheduleEntity): void {
    this.journeyDemand.setSchedule(schedule);
  }

  public updateSchedule(
    earliestDeparture: Date,
    latestDeparture: Date,
    targetArrival: Date | undefined,
    maximumArrival: Date | undefined,
    timezone: string | undefined,
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    const schedule = this.schedule;

    if (schedule === undefined) {
      throw new Error(
        'A Journey Demand schedule is required before updating the schedule.',
      );
    }

    // -------------------------------------------------------------------------
    // Validate Dates
    // -------------------------------------------------------------------------

    JourneyDemandAggregate.assertDate(earliestDeparture, 'Earliest departure');

    JourneyDemandAggregate.assertDate(latestDeparture, 'Latest departure');

    if (targetArrival !== undefined) {
      JourneyDemandAggregate.assertDate(targetArrival, 'Target arrival');
    }

    if (maximumArrival !== undefined) {
      JourneyDemandAggregate.assertDate(maximumArrival, 'Maximum arrival');
    }

    // -------------------------------------------------------------------------
    // Departure Window
    // -------------------------------------------------------------------------

    const scheduleWindow = new JourneyDemandScheduleWindow(
      earliestDeparture,
      latestDeparture,
    );

    schedule.setScheduleWindow(scheduleWindow);

    // -------------------------------------------------------------------------
    // Arrival Window
    // -------------------------------------------------------------------------

    const arrivalWindow = new JourneyDemandArrivalWindow(
      targetArrival,
      maximumArrival,
    );

    schedule.setArrivalWindow(arrivalWindow);

    // -------------------------------------------------------------------------
    // Timezone
    // -------------------------------------------------------------------------

    if (timezone !== undefined) {
      schedule.setTimezone(new JourneyDemandTimezone(timezone));
    }

    // -------------------------------------------------------------------------
    // Aggregate Audit / Version
    // -------------------------------------------------------------------------

    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new JourneyDemandScheduleUpdatedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        schedule.publicId.value,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  public removeSchedule(): void {
    this.journeyDemand.setSchedule(undefined);
  }

  public hasSchedule(): boolean {
    return this.journeyDemand.hasSchedule();
  }

  public get scheduleId(): JourneyDemandScheduleEntity['publicId'] | undefined {
    return this.schedule?.publicId;
  }

  // ===========================================================================
  // Capacity
  // ===========================================================================

  public attachCapacity(capacity: JourneyDemandCapacityEntity): void {
    this.journeyDemand.setCapacity(capacity);
  }

  public removeCapacity(): void {
    this.journeyDemand.setCapacity(undefined);
  }

  public hasCapacity(): boolean {
    return this.journeyDemand.capacity !== undefined;
  }

  public get capacityId(): JourneyDemandCapacityEntity['publicId'] | undefined {
    return this.capacity?.publicId;
  }

  public hasAvailableCapacity(): boolean {
    return this.capacity?.hasCapacity() ?? false;
  }

  public get remainingSeats(): number {
    return this.capacity?.remainingSeats ?? 0;
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  public attachPricing(pricing: JourneyDemandPricingEntity): void {
    this.journeyDemand.setPricing(pricing);
  }

  public updatePricing(
    currency: JourneyDemandCurrency,
    maximumPricePerSeat: JourneyDemandPrice,
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    const pricing = this.pricing;

    if (pricing === undefined) {
      throw new Error(
        'Cannot update Journey Demand pricing without a Journey Demand pricing component.',
      );
    }

    // -------------------------------------------------------------------------
    // Update Domain Entity
    // -------------------------------------------------------------------------

    pricing.setCurrency(currency);

    pricing.setMaximumPricePerSeat(maximumPricePerSeat);

    // -------------------------------------------------------------------------
    // Record Domain Event
    // -------------------------------------------------------------------------

    this.recordPricingUpdated(correlationId, causationId, occurredAt);
  }

  public removePricing(): void {
    this.journeyDemand.setPricing(undefined);
  }

  public hasPricing(): boolean {
    return this.journeyDemand.hasPricing();
  }

  public get pricingId(): JourneyDemandPricingEntity['publicId'] | undefined {
    return this.pricing?.publicId;
  }

  // ===========================================================================
  // Participants
  // ===========================================================================

  public addParticipant(participant: JourneyDemandParticipantEntity): void {
    const existing = this.getParticipantByMember(participant.memberPublicId);

    if (existing !== undefined) {
      return;
    }

    this.journeyDemand.addParticipant(participant);
  }

  public updateParticipant(participant: JourneyDemandParticipantEntity): void {
    const existing = this.getParticipantByPublicId(participant.publicId);

    if (existing === undefined) {
      return;
    }

    const participants = this.journeyDemand.participants.map((current) =>
      current.publicId.equals(participant.publicId) ? participant : current,
    );

    this.journeyDemand.setParticipants(participants);
  }

  public withdrawParticipant(
    participantPublicId: JourneyDemandParticipantEntity['publicId'],
    at: Date = new Date(),
  ): void {
    const participant = this.getParticipantByPublicId(participantPublicId);

    if (participant === undefined) {
      return;
    }

    participant.withdraw(at);
  }

  public removeParticipant(
    participantPublicId: JourneyDemandParticipantEntity['publicId'],
  ): void {
    const participant = this.getParticipantByPublicId(participantPublicId);

    if (participant === undefined) {
      return;
    }

    this.journeyDemand.removeParticipant(participant);
  }

  public getParticipantByPublicId(
    participantPublicId: JourneyDemandParticipantEntity['publicId'],
  ): JourneyDemandParticipantEntity | undefined {
    return this.journeyDemand.participants.find((participant) =>
      participant.publicId.equals(participantPublicId),
    );
  }

  public getParticipantByMember(
    memberPublicId: MemberPublicId,
  ): JourneyDemandParticipantEntity | undefined {
    return this.journeyDemand.participants.find((participant) =>
      participant.belongsToMember(memberPublicId),
    );
  }

  public hasParticipant(memberPublicId: MemberPublicId): boolean {
    return this.getParticipantByMember(memberPublicId) !== undefined;
  }

  public participantCount(): number {
    return this.journeyDemand.participantCount();
  }

  public activeParticipantCount(): number {
    return this.journeyDemand.participants.filter((participant) =>
      participant.isActive(),
    ).length;
  }

  public totalParticipantSeats(): number {
    return this.journeyDemand.participants.reduce(
      (total, participant) => total + participant.seatCount(),
      0,
    );
  }

  public activeParticipantSeats(): number {
    return this.journeyDemand.participants
      .filter((participant) => participant.isActive())
      .reduce((total, participant) => total + participant.seatCount(), 0);
  }

  // ===========================================================================
  // Aggregate Invariants
  // ===========================================================================

  /**
   * Participants are intentionally optional when publishing.
   *
   * The structural components required for publication are:
   *
   * - corridor
   * - schedule
   * - capacity
   * - pricing
   */
  public hasRequiredComponents(): boolean {
    return (
      this.hasCorridor() &&
      this.hasSchedule() &&
      this.hasCapacity() &&
      this.hasPricing()
    );
  }

  // ===========================================================================
  // Domain Event Recording
  // ===========================================================================

  public recordDomainEvent(event: JourneyDemandDomainEvent): void {
    this.addDomainEvent(event);
  }

  // ===========================================================================
  // Created Event
  // ===========================================================================

  public recordCreated(correlationId: string, causationId?: string): void {
    this.addDomainEvent(
      new JourneyDemandCreatedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Aggregate Updated Event
  // ===========================================================================

  public recordUpdated(
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandUpdatedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Corridor Updated Event
  // ===========================================================================

  public recordCorridorUpdated(
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    const corridor = this.corridor;

    if (corridor === undefined) {
      throw new Error(
        'Cannot record a corridor update without a Journey Demand corridor.',
      );
    }

    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandCorridorUpdatedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        corridor.publicId.value,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Schedule Updated Event
  // ===========================================================================

  public recordScheduleUpdated(
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    const schedule = this.schedule;

    if (schedule === undefined) {
      throw new Error(
        'Cannot record a schedule update without a Journey Demand schedule.',
      );
    }

    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandScheduleUpdatedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        schedule.publicId.value,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Capacity
  // ===========================================================================

  public updateCapacity(
    seatsRequired: number,
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    // -------------------------------------------------------------------------
    // Capacity is required
    // -------------------------------------------------------------------------

    const capacity = this.capacity;

    if (capacity === undefined) {
      throw new Error(
        'A Journey Demand capacity is required before updating capacity.',
      );
    }

    // -------------------------------------------------------------------------
    // Domain Value Object
    // -------------------------------------------------------------------------

    const requestedSeats = new JourneyDemandSeats(seatsRequired);

    // -------------------------------------------------------------------------
    // Update Capacity
    //
    // JourneyDemandCapacityEntity owns the invariant that requested seats
    // cannot be reduced below already matched seats.
    // -------------------------------------------------------------------------

    capacity.setRequestedSeats(requestedSeats);

    // -------------------------------------------------------------------------
    // Record Domain Event
    // -------------------------------------------------------------------------

    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandCapacityUpdatedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        capacity.publicId.value,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }
  // ===========================================================================
  // Capacity Updated Event
  // ===========================================================================

  public recordCapacityUpdated(
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    const capacity = this.capacity;

    if (capacity === undefined) {
      throw new Error(
        'Cannot record a capacity update without a Journey Demand capacity.',
      );
    }

    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandCapacityUpdatedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        capacity.publicId.value,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }
  // ===========================================================================
  // Corridor Update
  // ===========================================================================

  public updateCorridor(
    origin: string,
    destination: string,
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    const corridor = this.corridor;

    if (corridor === undefined) {
      throw new Error(
        'A Journey Demand corridor is required before updating the corridor.',
      );
    }

    // -------------------------------------------------------------------------
    // Validate input
    // -------------------------------------------------------------------------

    const normalizedOrigin = origin.trim();
    const normalizedDestination = destination.trim();

    if (normalizedOrigin.length === 0) {
      throw new Error('Journey Demand corridor origin cannot be empty.');
    }

    if (normalizedDestination.length === 0) {
      throw new Error('Journey Demand corridor destination cannot be empty.');
    }

    // -------------------------------------------------------------------------
    // Update corridor names
    //
    // Coordinates, corridor key, and waypoints remain unchanged because this
    // command only represents an origin/destination name update.
    // -------------------------------------------------------------------------

    corridor.setOriginName(new JourneyDemandLocation(normalizedOrigin));

    corridor.setDestinationName(
      new JourneyDemandLocation(normalizedDestination),
    );

    // -------------------------------------------------------------------------
    // Aggregate audit/version
    // -------------------------------------------------------------------------

    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new JourneyDemandCorridorUpdatedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        corridor.publicId.value,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Pricing Updated Event
  // ===========================================================================

  public recordPricingUpdated(
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    const pricing = this.pricing;

    if (pricing === undefined) {
      throw new Error(
        'Cannot record a pricing update without Journey Demand pricing.',
      );
    }

    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandPricingUpdatedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        pricing.publicId.value,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Waypoint Added Event
  // ===========================================================================

  public recordWaypointAdded(
    waypoint: JourneyDemandWaypointEntity,
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    const corridor = this.corridor;

    if (corridor === undefined) {
      throw new Error(
        'Cannot record a waypoint event without a Journey Demand corridor.',
      );
    }

    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandWaypointAddedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        waypoint.publicId.value,
        corridor.publicId.value,
        waypoint.sequence.value,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Waypoint Updated Event
  // ===========================================================================

  public recordWaypointUpdated(
    waypoint: JourneyDemandWaypointEntity,
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    const corridor = this.corridor;

    if (corridor === undefined) {
      throw new Error(
        'Cannot record a waypoint event without a Journey Demand corridor.',
      );
    }

    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandWaypointUpdatedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        waypoint.publicId.value,
        corridor.publicId.value,
        waypoint.sequence.value,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Waypoint Removed Event
  // ===========================================================================

  public recordWaypointRemoved(
    waypointPublicId: JourneyDemandWaypointEntity['publicId'],
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    const corridor = this.corridor;

    if (corridor === undefined) {
      throw new Error(
        'Cannot record a waypoint event without a Journey Demand corridor.',
      );
    }

    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandWaypointRemovedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        waypointPublicId.value,
        corridor.publicId.value,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Participant Added Event
  // ===========================================================================

  public recordParticipantAdded(
    participant: JourneyDemandParticipantEntity,
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandParticipantAddedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        participant.publicId.value,
        participant.memberPublicId.value,
        participant.seatCount(),
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Participant Updated Event
  // ===========================================================================

  public recordParticipantUpdated(
    participant: JourneyDemandParticipantEntity,
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandParticipantUpdatedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        participant.publicId.value,
        participant.memberPublicId.value,
        participant.seatCount(),
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Participant Withdrawn Event
  // ===========================================================================

  public recordParticipantWithdrawn(
    participant: JourneyDemandParticipantEntity,
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandParticipantWithdrawnEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        participant.publicId.value,
        participant.memberPublicId.value,
        participant.withdrawnAt ?? occurredAt,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Participant Removed Event
  // ===========================================================================

  public recordParticipantRemoved(
    participant: JourneyDemandParticipantEntity,
    correlationId: string,
    causationId?: string,
    occurredAt: Date = new Date(),
  ): void {
    this.journeyDemand.setUpdatedAt(occurredAt);
    this.journeyDemand.incrementVersion();

    this.addDomainEvent(
      new JourneyDemandParticipantRemovedEvent(
        this.id.toString(),
        this.journeyDemand.publicId.value,
        this.requesterPublicId.value,
        participant.publicId.value,
        participant.memberPublicId.value,
        participant.removedAt ?? occurredAt,
        this.version,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Internal Validation
  // ===========================================================================

  private static assertDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new Error(`${fieldName} must be a valid Date.`);
    }
  }
}
