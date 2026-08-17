// -----------------------------------------------------------------------------
// Journey Demand Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandStatusValueObject } from '../value-objects/journey-demand-status.vo';
import type { RequesterPublicId } from '../value-objects/requester-public-id.vo';
import type { MatchedJourneyPublicId } from '../value-objects/matched-journey-public-id.vo';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyDemandCorridorEntity } from './journey-demand-corridor.entity';
import type { JourneyDemandScheduleEntity } from './journey-demand-schedule.entity';
import type { JourneyDemandCapacityEntity } from './journey-demand-capacity.entity';
import type { JourneyDemandPricingEntity } from './journey-demand-pricing.entity';
import type { JourneyDemandParticipantEntity } from './journey-demand-participant.entity';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyDemandProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier persisted as JourneyDemand.publicId.
   *
   * JourneyDemand intentionally uses the foundation PublicEntityId because
   * there is no dedicated JourneyDemandPublicId value object.
   */
  publicId: PublicEntityId;

  // ---------------------------------------------------------------------------
  // Requester
  // ---------------------------------------------------------------------------

  /**
   * Cross-domain reference to Identity.publicId.
   *
   * This is intentionally NOT a Prisma/domain relation.
   */
  requesterPublicId: RequesterPublicId;

  // ---------------------------------------------------------------------------
  // Lifecycle Status
  // ---------------------------------------------------------------------------

  status: JourneyDemandStatusValueObject;

  // ---------------------------------------------------------------------------
  // Matching
  // ---------------------------------------------------------------------------

  /**
   * Cross-reference to the matched Journey aggregate.
   *
   * This is intentionally NOT a Prisma/domain relation.
   */
  matchedJourneyPublicId: MatchedJourneyPublicId | undefined;

  // ---------------------------------------------------------------------------
  // Demand Components
  // ---------------------------------------------------------------------------

  corridor: JourneyDemandCorridorEntity | undefined;

  schedule: JourneyDemandScheduleEntity | undefined;

  capacity: JourneyDemandCapacityEntity | undefined;

  pricing: JourneyDemandPricingEntity | undefined;

  participants: JourneyDemandParticipantEntity[];

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  publishedAt: Date | undefined;

  matchedAt: Date | undefined;

  convertedAt: Date | undefined;

  fulfilledAt: Date | undefined;

  cancelledAt: Date | undefined;

  expiredAt: Date | undefined;

  // ---------------------------------------------------------------------------
  // Aggregate Version
  // ---------------------------------------------------------------------------

  version: number;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyDemandEntity extends Entity<
  JourneyDemandProps,
  PublicEntityId
> {
  private constructor(
    props: JourneyDemandProps,
    id?: UniqueEntityId,
    publicId?: PublicEntityId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: PublicEntityId;

    requesterPublicId: RequesterPublicId;

    status: JourneyDemandStatusValueObject;

    corridor?: JourneyDemandCorridorEntity;

    schedule?: JourneyDemandScheduleEntity;

    capacity?: JourneyDemandCapacityEntity;

    pricing?: JourneyDemandPricingEntity;

    participants?: JourneyDemandParticipantEntity[];

    matchedJourneyPublicId?: MatchedJourneyPublicId;

    publishedAt?: Date;

    matchedAt?: Date;

    convertedAt?: Date;

    fulfilledAt?: Date;

    cancelledAt?: Date;

    expiredAt?: Date;

    version?: number;

    createdAt?: Date;

    updatedAt?: Date;
  }): JourneyDemandEntity {
    const now = new Date();

    const publicId = props.publicId ?? new PublicEntityId();

    const version = props.version ?? 1;

    JourneyDemandEntity.validateVersion(version);

    return new JourneyDemandEntity(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Requester
        // ---------------------------------------------------------------------

        requesterPublicId: props.requesterPublicId,

        // ---------------------------------------------------------------------
        // Status
        // ---------------------------------------------------------------------

        status: props.status,

        // ---------------------------------------------------------------------
        // Matching
        // ---------------------------------------------------------------------

        matchedJourneyPublicId: props.matchedJourneyPublicId,

        // ---------------------------------------------------------------------
        // Components
        // ---------------------------------------------------------------------

        corridor: props.corridor,

        schedule: props.schedule,

        capacity: props.capacity,

        pricing: props.pricing,

        participants: [...(props.participants ?? [])],

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        publishedAt:
          props.publishedAt !== undefined
            ? JourneyDemandEntity.cloneDate(props.publishedAt)
            : undefined,

        matchedAt:
          props.matchedAt !== undefined
            ? JourneyDemandEntity.cloneDate(props.matchedAt)
            : undefined,

        convertedAt:
          props.convertedAt !== undefined
            ? JourneyDemandEntity.cloneDate(props.convertedAt)
            : undefined,

        fulfilledAt:
          props.fulfilledAt !== undefined
            ? JourneyDemandEntity.cloneDate(props.fulfilledAt)
            : undefined,

        cancelledAt:
          props.cancelledAt !== undefined
            ? JourneyDemandEntity.cloneDate(props.cancelledAt)
            : undefined,

        expiredAt:
          props.expiredAt !== undefined
            ? JourneyDemandEntity.cloneDate(props.expiredAt)
            : undefined,

        // ---------------------------------------------------------------------
        // Version
        // ---------------------------------------------------------------------

        version,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: JourneyDemandEntity.cloneDate(props.createdAt ?? now),

        updatedAt: JourneyDemandEntity.cloneDate(props.updatedAt ?? now),
      },
      undefined,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyDemandProps,
    id: UniqueEntityId,
  ): JourneyDemandEntity {
    JourneyDemandEntity.validateVersion(props.version);

    return new JourneyDemandEntity(
      {
        ...props,

        participants: [...props.participants],

        publishedAt:
          props.publishedAt !== undefined
            ? JourneyDemandEntity.cloneDate(props.publishedAt)
            : undefined,

        matchedAt:
          props.matchedAt !== undefined
            ? JourneyDemandEntity.cloneDate(props.matchedAt)
            : undefined,

        convertedAt:
          props.convertedAt !== undefined
            ? JourneyDemandEntity.cloneDate(props.convertedAt)
            : undefined,

        fulfilledAt:
          props.fulfilledAt !== undefined
            ? JourneyDemandEntity.cloneDate(props.fulfilledAt)
            : undefined,

        cancelledAt:
          props.cancelledAt !== undefined
            ? JourneyDemandEntity.cloneDate(props.cancelledAt)
            : undefined,

        expiredAt:
          props.expiredAt !== undefined
            ? JourneyDemandEntity.cloneDate(props.expiredAt)
            : undefined,

        createdAt: JourneyDemandEntity.cloneDate(props.createdAt),

        updatedAt: JourneyDemandEntity.cloneDate(props.updatedAt),
      },
      id,
      props.publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Requester
  // ---------------------------------------------------------------------------

  get requesterPublicId(): RequesterPublicId {
    return this.props.requesterPublicId;
  }

  setRequesterPublicId(requesterPublicId: RequesterPublicId): void {
    if (this.props.requesterPublicId.equals(requesterPublicId)) {
      return;
    }

    this.props.requesterPublicId = requesterPublicId;

    this.touch();
  }

  belongsToRequester(requesterPublicId: RequesterPublicId): boolean {
    return this.props.requesterPublicId.equals(requesterPublicId);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Status
  // ---------------------------------------------------------------------------

  get status(): JourneyDemandStatusValueObject {
    return this.props.status;
  }

  setStatus(status: JourneyDemandStatusValueObject): void {
    this.props.status = status;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Matched Journey
  // ---------------------------------------------------------------------------

  get matchedJourneyPublicId(): MatchedJourneyPublicId | undefined {
    return this.props.matchedJourneyPublicId;
  }

  setMatchedJourneyPublicId(
    matchedJourneyPublicId: MatchedJourneyPublicId | undefined,
  ): void {
    this.props.matchedJourneyPublicId = matchedJourneyPublicId;

    this.touch();
  }

  hasMatchedJourney(): boolean {
    return this.props.matchedJourneyPublicId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Demand Components
  // ---------------------------------------------------------------------------

  get corridor(): JourneyDemandCorridorEntity | undefined {
    return this.props.corridor;
  }

  get schedule(): JourneyDemandScheduleEntity | undefined {
    return this.props.schedule;
  }

  get capacity(): JourneyDemandCapacityEntity | undefined {
    return this.props.capacity;
  }

  get pricing(): JourneyDemandPricingEntity | undefined {
    return this.props.pricing;
  }

  get participants(): readonly JourneyDemandParticipantEntity[] {
    return this.props.participants;
  }

  // ---------------------------------------------------------------------------
  // Component Mutators
  // ---------------------------------------------------------------------------

  setCorridor(corridor: JourneyDemandCorridorEntity | undefined): void {
    this.props.corridor = corridor;

    this.touch();
  }

  setSchedule(schedule: JourneyDemandScheduleEntity | undefined): void {
    this.props.schedule = schedule;

    this.touch();
  }

  setCapacity(capacity: JourneyDemandCapacityEntity | undefined): void {
    this.props.capacity = capacity;

    this.touch();
  }

  setPricing(pricing: JourneyDemandPricingEntity | undefined): void {
    this.props.pricing = pricing;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Component Presence
  // ---------------------------------------------------------------------------

  hasCorridor(): boolean {
    return this.props.corridor !== undefined;
  }

  hasSchedule(): boolean {
    return this.props.schedule !== undefined;
  }

  hasCapacity(): boolean {
    return this.props.capacity !== undefined;
  }

  hasPricing(): boolean {
    return this.props.pricing !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Participants
  // ---------------------------------------------------------------------------

  addParticipant(participant: JourneyDemandParticipantEntity): void {
    if (
      this.props.participants.some((existing) => existing.equals(participant))
    ) {
      return;
    }

    this.props.participants.push(participant);

    this.touch();
  }

  removeParticipant(participant: JourneyDemandParticipantEntity): void {
    const previousLength = this.props.participants.length;

    this.props.participants = this.props.participants.filter(
      (existing) => !existing.equals(participant),
    );

    if (this.props.participants.length !== previousLength) {
      this.touch();
    }
  }

  setParticipants(participants: JourneyDemandParticipantEntity[]): void {
    this.props.participants = [...participants];

    this.touch();
  }

  clearParticipants(): void {
    if (this.props.participants.length === 0) {
      return;
    }

    this.props.participants = [];

    this.touch();
  }

  participantCount(): number {
    return this.props.participants.length;
  }

  hasParticipants(): boolean {
    return this.props.participants.length > 0;
  }

  hasParticipant(participant: JourneyDemandParticipantEntity): boolean {
    return this.props.participants.some((existing) =>
      existing.equals(participant),
    );
  }

  getParticipantById(
    participantId: UniqueEntityId,
  ): JourneyDemandParticipantEntity | undefined {
    return this.props.participants.find((participant) =>
      participant.id.equals(participantId),
    );
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  get publishedAt(): Date | undefined {
    return JourneyDemandEntity.cloneOptionalDate(this.props.publishedAt);
  }

  get matchedAt(): Date | undefined {
    return JourneyDemandEntity.cloneOptionalDate(this.props.matchedAt);
  }

  get convertedAt(): Date | undefined {
    return JourneyDemandEntity.cloneOptionalDate(this.props.convertedAt);
  }

  get fulfilledAt(): Date | undefined {
    return JourneyDemandEntity.cloneOptionalDate(this.props.fulfilledAt);
  }

  get cancelledAt(): Date | undefined {
    return JourneyDemandEntity.cloneOptionalDate(this.props.cancelledAt);
  }

  get expiredAt(): Date | undefined {
    return JourneyDemandEntity.cloneOptionalDate(this.props.expiredAt);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamp Mutators
  // ---------------------------------------------------------------------------

  setPublishedAt(publishedAt: Date | undefined): void {
    this.props.publishedAt = JourneyDemandEntity.cloneOptionalDate(publishedAt);

    this.touch();
  }

  setMatchedAt(matchedAt: Date | undefined): void {
    this.props.matchedAt = JourneyDemandEntity.cloneOptionalDate(matchedAt);

    this.touch();
  }

  setConvertedAt(convertedAt: Date | undefined): void {
    this.props.convertedAt = JourneyDemandEntity.cloneOptionalDate(convertedAt);

    this.touch();
  }

  setFulfilledAt(fulfilledAt: Date | undefined): void {
    this.props.fulfilledAt = JourneyDemandEntity.cloneOptionalDate(fulfilledAt);

    this.touch();
  }

  setCancelledAt(cancelledAt: Date | undefined): void {
    this.props.cancelledAt = JourneyDemandEntity.cloneOptionalDate(cancelledAt);

    this.touch();
  }

  setExpiredAt(expiredAt: Date | undefined): void {
    this.props.expiredAt = JourneyDemandEntity.cloneOptionalDate(expiredAt);

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Lifecycle State Queries
  // ---------------------------------------------------------------------------

  isDraft(): boolean {
    return this.props.status.isDraft;
  }

  isOpen(): boolean {
    return this.props.status.isOpen;
  }

  isMatched(): boolean {
    return this.props.status.isMatched;
  }

  isConverted(): boolean {
    return this.props.status.isConverted;
  }

  isFulfilled(): boolean {
    return this.props.status.isFulfilled;
  }

  isCancelled(): boolean {
    return this.props.status.isCancelled;
  }

  isExpired(): boolean {
    return this.props.status.isExpired;
  }

  isPublished(): boolean {
    return this.props.publishedAt !== undefined;
  }

  isTerminal(): boolean {
    return this.isFulfilled() || this.isCancelled() || this.isExpired();
  }

  isActive(): boolean {
    return (
      this.isDraft() || this.isOpen() || this.isMatched() || this.isConverted()
    );
  }

  // ---------------------------------------------------------------------------
  // Version
  // ---------------------------------------------------------------------------

  get version(): number {
    return this.props.version;
  }

  setVersion(version: number): void {
    JourneyDemandEntity.validateVersion(version);

    this.props.version = version;

    this.touch();
  }

  incrementVersion(): void {
    this.props.version += 1;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  get createdAt(): Date {
    return JourneyDemandEntity.cloneDate(this.props.createdAt);
  }

  get updatedAt(): Date {
    return JourneyDemandEntity.cloneDate(this.props.updatedAt);
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyDemandEntity.cloneDate(updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: JourneyDemandEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateVersion(version: number): void {
    if (!Number.isInteger(version) || version < 1) {
      throw new Error('Journey demand version must be a positive integer.');
    }
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }

  private static cloneOptionalDate(date: Date | undefined): Date | undefined {
    return date !== undefined ? JourneyDemandEntity.cloneDate(date) : undefined;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyDemandProps };
