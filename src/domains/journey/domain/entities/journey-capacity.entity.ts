// src/domains/journey/domain/entities/journey-capacity.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyCapacityPublicId } from '../value-objects/journey-capacity-public-id.vo';
import type { JourneyTotalSeats } from '../value-objects/journey-total-seats.vo';
import { JourneyBookedSeats } from '../value-objects/journey-booked-seats.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyCapacityProps {
  publicId: JourneyCapacityPublicId;

  totalSeats: JourneyTotalSeats;
  bookedSeats: JourneyBookedSeats;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyCapacityEntity extends Entity<JourneyCapacityProps> {
  private constructor(props: JourneyCapacityProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: JourneyCapacityProps): JourneyCapacityEntity {
    if (props.bookedSeats.value > props.totalSeats.value) {
      throw new Error('Journey booked seats cannot exceed total seats.');
    }

    return new JourneyCapacityEntity(props);
  }

  public static rehydrate(
    props: JourneyCapacityProps,
    id: UniqueEntityId,
  ): JourneyCapacityEntity {
    return new JourneyCapacityEntity(props, id);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  override get publicId(): PublicEntityId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  get totalSeats(): JourneyTotalSeats {
    return this.props.totalSeats;
  }

  get bookedSeats(): JourneyBookedSeats {
    return this.props.bookedSeats;
  }

  get availableSeats(): number {
    return this.props.totalSeats.value - this.props.bookedSeats.value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Mutators
  // ---------------------------------------------------------------------------

  setTotalSeats(totalSeats: JourneyTotalSeats): void {
    if (this.props.bookedSeats.value > totalSeats.value) {
      throw new Error('Journey total seats cannot be less than booked seats.');
    }

    this.props.totalSeats = totalSeats;
  }

  setBookedSeats(bookedSeats: JourneyBookedSeats): void {
    if (bookedSeats.value > this.props.totalSeats.value) {
      throw new Error('Journey booked seats cannot exceed total seats.');
    }

    this.props.bookedSeats = bookedSeats;
  }

  bookSeats(count: number = 1): void {
    if (!Number.isInteger(count) || count <= 0) {
      throw new Error('Seats to book must be a positive integer.');
    }

    const nextBookedSeats = this.props.bookedSeats.value + count;

    if (nextBookedSeats > this.props.totalSeats.value) {
      throw new Error('Journey does not have enough available seats.');
    }

    this.props.bookedSeats = new JourneyBookedSeats(nextBookedSeats);
  }

  releaseSeats(count: number = 1): void {
    if (!Number.isInteger(count) || count <= 0) {
      throw new Error('Seats to release must be a positive integer.');
    }

    const nextBookedSeats = this.props.bookedSeats.value - count;

    if (nextBookedSeats < 0) {
      throw new Error('Journey booked seats cannot become negative.');
    }

    this.props.bookedSeats = new JourneyBookedSeats(nextBookedSeats);
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  hasAvailableSeats(): boolean {
    return this.availableSeats > 0;
  }

  isFull(): boolean {
    return this.availableSeats === 0;
  }

  isEmpty(): boolean {
    return this.props.bookedSeats.value === 0;
  }

  hasBookings(): boolean {
    return this.props.bookedSeats.value > 0;
  }

  canBook(count: number = 1): boolean {
    return Number.isInteger(count) && count > 0 && this.availableSeats >= count;
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: JourneyCapacityEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyCapacityProps };
