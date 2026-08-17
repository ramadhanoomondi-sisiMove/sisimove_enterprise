// -----------------------------------------------------------------------------
// Journey Demand Capacity Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandCapacityId } from '../value-objects/journey-demand-capacity-id.vo';
import type { JourneyDemandCapacityPublicId } from '../value-objects/journey-demand-capacity-public-id.vo';
import type { JourneyDemandSeats } from '../value-objects/journey-demand-seats.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyDemandCapacityProps {
  publicId: JourneyDemandCapacityPublicId;

  requestedSeats: JourneyDemandSeats;
  matchedSeats: number;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyDemandCapacityEntity extends Entity<
  JourneyDemandCapacityProps,
  JourneyDemandCapacityPublicId
> {
  private constructor(
    props: JourneyDemandCapacityProps,
    id?: UniqueEntityId,
    publicId?: JourneyDemandCapacityPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId: JourneyDemandCapacityPublicId;
    requestedSeats: JourneyDemandSeats;
    matchedSeats?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }): JourneyDemandCapacityEntity {
    const now = new Date();

    const matchedSeats = props.matchedSeats ?? 0;

    JourneyDemandCapacityEntity.assertMatchedSeats(
      matchedSeats,
      props.requestedSeats.value,
    );

    return new JourneyDemandCapacityEntity({
      publicId: props.publicId,

      requestedSeats: props.requestedSeats,
      matchedSeats,

      createdAt: JourneyDemandCapacityEntity.cloneDate(props.createdAt ?? now),

      updatedAt: JourneyDemandCapacityEntity.cloneDate(props.updatedAt ?? now),
    });
  }

  public static rehydrate(
    props: JourneyDemandCapacityProps,
    id: JourneyDemandCapacityId,
    publicId: JourneyDemandCapacityPublicId,
  ): JourneyDemandCapacityEntity {
    JourneyDemandCapacityEntity.assertMatchedSeats(
      props.matchedSeats,
      props.requestedSeats.value,
    );

    return new JourneyDemandCapacityEntity(
      {
        ...props,

        createdAt: JourneyDemandCapacityEntity.cloneDate(props.createdAt),

        updatedAt: JourneyDemandCapacityEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  override get publicId(): JourneyDemandCapacityPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  get requestedSeats(): JourneyDemandSeats {
    return this.props.requestedSeats;
  }

  get matchedSeats(): number {
    return this.props.matchedSeats;
  }

  get remainingSeats(): number {
    return this.props.requestedSeats.value - this.props.matchedSeats;
  }

  get createdAt(): Date {
    return JourneyDemandCapacityEntity.cloneDate(this.props.createdAt);
  }

  get updatedAt(): Date {
    return JourneyDemandCapacityEntity.cloneDate(this.props.updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Mutators
  // ---------------------------------------------------------------------------

  setRequestedSeats(requestedSeats: JourneyDemandSeats): void {
    if (requestedSeats.value < this.props.matchedSeats) {
      throw new Error(
        'Requested seats cannot be less than already matched seats.',
      );
    }

    this.props.requestedSeats = requestedSeats;

    this.touch();
  }

  setMatchedSeats(matchedSeats: number): void {
    JourneyDemandCapacityEntity.assertMatchedSeats(
      matchedSeats,
      this.props.requestedSeats.value,
    );

    this.props.matchedSeats = matchedSeats;

    this.touch();
  }

  addMatchedSeats(seats: JourneyDemandSeats): void {
    const nextMatchedSeats = this.props.matchedSeats + seats.value;

    if (nextMatchedSeats > this.props.requestedSeats.value) {
      throw new Error('Matched seats cannot exceed requested seats.');
    }

    this.props.matchedSeats = nextMatchedSeats;

    this.touch();
  }

  removeMatchedSeats(seats: JourneyDemandSeats): void {
    const nextMatchedSeats = this.props.matchedSeats - seats.value;

    if (nextMatchedSeats < 0) {
      throw new Error('Matched seats cannot be reduced below zero.');
    }

    this.props.matchedSeats = nextMatchedSeats;

    this.touch();
  }

  resetMatchedSeats(): void {
    this.props.matchedSeats = 0;

    this.touch();
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyDemandCapacityEntity.cloneDate(updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  hasCapacity(): boolean {
    return this.props.matchedSeats < this.props.requestedSeats.value;
  }

  isFull(): boolean {
    return this.props.matchedSeats === this.props.requestedSeats.value;
  }

  isEmpty(): boolean {
    return this.props.matchedSeats === 0;
  }

  isPartiallyMatched(): boolean {
    return (
      this.props.matchedSeats > 0 &&
      this.props.matchedSeats < this.props.requestedSeats.value
    );
  }

  isFullyMatched(): boolean {
    return (
      this.props.requestedSeats.value > 0 &&
      this.props.matchedSeats === this.props.requestedSeats.value
    );
  }

  canMatch(seats: JourneyDemandSeats): boolean {
    return (
      seats.value > 0 &&
      this.props.matchedSeats + seats.value <= this.props.requestedSeats.value
    );
  }

  remainingSeatCount(): number {
    return this.remainingSeats;
  }

  matchedSeatCount(): number {
    return this.props.matchedSeats;
  }

  requestedSeatCount(): number {
    return this.props.requestedSeats.value;
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static assertMatchedSeats(
    matchedSeats: number,
    requestedSeats: number,
  ): void {
    if (!Number.isInteger(matchedSeats) || matchedSeats < 0) {
      throw new Error('Matched seats must be a non-negative integer.');
    }

    if (matchedSeats > requestedSeats) {
      throw new Error('Matched seats cannot exceed requested seats.');
    }
  }

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyDemandCapacityProps };
