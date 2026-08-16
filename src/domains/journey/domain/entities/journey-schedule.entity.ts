// src/domains/journey/domain/entities/journey-schedule.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneySchedulePublicId } from '../value-objects/journey-schedule-public-id.vo';
import type { JourneyDepartureAt } from '../value-objects/journey-departure-at.vo';
import type { JourneyArrivalAt } from '../value-objects/journey-arrival-at.vo';
import type { JourneyTimezone } from '../value-objects/journey-timezone.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyScheduleProps {
  publicId: JourneySchedulePublicId;

  departureAt: JourneyDepartureAt;
  arrivalAt: JourneyArrivalAt | undefined;
  timezone: JourneyTimezone;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyScheduleEntity extends Entity<JourneyScheduleProps> {
  private constructor(props: JourneyScheduleProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: JourneyScheduleProps): JourneyScheduleEntity {
    return new JourneyScheduleEntity(props);
  }

  public static rehydrate(
    props: JourneyScheduleProps,
    id: UniqueEntityId,
  ): JourneyScheduleEntity {
    return new JourneyScheduleEntity(props, id);
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

  get departureAt(): JourneyDepartureAt {
    return this.props.departureAt;
  }

  get arrivalAt(): JourneyArrivalAt | undefined {
    return this.props.arrivalAt;
  }

  get timezone(): JourneyTimezone {
    return this.props.timezone;
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

  setDepartureAt(departureAt: JourneyDepartureAt): void {
    this.props.departureAt = departureAt;
  }

  setArrivalAt(arrivalAt: JourneyArrivalAt | undefined): void {
    this.props.arrivalAt = arrivalAt;
  }

  setTimezone(timezone: JourneyTimezone): void {
    this.props.timezone = timezone;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  hasArrivalTime(): boolean {
    return this.props.arrivalAt !== undefined;
  }

  isScheduled(): boolean {
    return true;
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: JourneyScheduleEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyScheduleProps };
