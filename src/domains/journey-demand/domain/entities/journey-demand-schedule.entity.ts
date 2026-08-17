// src/domains/journey-demand/domain/entities/journey-demand-schedule.entity.ts

// -----------------------------------------------------------------------------
// Journey Demand Schedule Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandScheduleId } from '../value-objects/journey-demand-schedule-id.vo';

import type { JourneyDemandSchedulePublicId } from '../value-objects/journey-demand-schedule-public-id.vo';

import type { JourneyDemandScheduleWindow } from '../value-objects/journey-demand-schedule-window.vo';

import { JourneyDemandArrivalWindow } from '../value-objects/journey-demand-arrival-window.vo';

import type { JourneyDemandTimezone } from '../value-objects/journey-demand-timezone.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyDemandScheduleProps {
  // ---------------------------------------------------------------------------
  // Scheduling
  // ---------------------------------------------------------------------------

  scheduleWindow: JourneyDemandScheduleWindow;

  arrivalWindow: JourneyDemandArrivalWindow;

  timezone: JourneyDemandTimezone;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyDemandScheduleEntity extends Entity<
  JourneyDemandScheduleProps,
  JourneyDemandSchedulePublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(
    props: JourneyDemandScheduleProps,
    id?: UniqueEntityId,
    publicId?: JourneyDemandSchedulePublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(props: {
    publicId: JourneyDemandSchedulePublicId;

    scheduleWindow: JourneyDemandScheduleWindow;

    arrivalWindow?: JourneyDemandArrivalWindow;

    timezone: JourneyDemandTimezone;

    createdAt?: Date;

    updatedAt?: Date;
  }): JourneyDemandScheduleEntity {
    const now = new Date();

    const arrivalWindow =
      props.arrivalWindow ?? new JourneyDemandArrivalWindow();

    JourneyDemandScheduleEntity.validateArrivalAgainstDeparture(
      props.scheduleWindow,
      arrivalWindow,
    );

    return new JourneyDemandScheduleEntity(
      {
        // ---------------------------------------------------------------------
        // Scheduling
        // ---------------------------------------------------------------------

        scheduleWindow: props.scheduleWindow,

        arrivalWindow,

        timezone: props.timezone,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: JourneyDemandScheduleEntity.cloneDate(
          props.createdAt ?? now,
        ),

        updatedAt: JourneyDemandScheduleEntity.cloneDate(
          props.updatedAt ?? now,
        ),
      },
      undefined,
      props.publicId,
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    props: JourneyDemandScheduleProps,
    id: JourneyDemandScheduleId,
    publicId: JourneyDemandSchedulePublicId,
  ): JourneyDemandScheduleEntity {
    return new JourneyDemandScheduleEntity(
      {
        // ---------------------------------------------------------------------
        // Scheduling
        // ---------------------------------------------------------------------

        scheduleWindow: props.scheduleWindow,

        arrivalWindow: props.arrivalWindow,

        timezone: props.timezone,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: JourneyDemandScheduleEntity.cloneDate(props.createdAt),

        updatedAt: JourneyDemandScheduleEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  override get publicId(): JourneyDemandSchedulePublicId {
    return super.publicId;
  }

  // ===========================================================================
  // Schedule Window
  // ===========================================================================

  public get scheduleWindow(): JourneyDemandScheduleWindow {
    return this.props.scheduleWindow;
  }

  public get earliestDeparture(): Date {
    return JourneyDemandScheduleEntity.cloneDate(
      this.props.scheduleWindow.earliestDeparture,
    );
  }

  public get latestDeparture(): Date {
    return JourneyDemandScheduleEntity.cloneDate(
      this.props.scheduleWindow.latestDeparture,
    );
  }

  public setScheduleWindow(scheduleWindow: JourneyDemandScheduleWindow): void {
    JourneyDemandScheduleEntity.validateArrivalAgainstDeparture(
      scheduleWindow,
      this.props.arrivalWindow,
    );

    this.props.scheduleWindow = scheduleWindow;

    this.touch();
  }

  // ===========================================================================
  // Arrival Window
  // ===========================================================================

  public get arrivalWindow(): JourneyDemandArrivalWindow {
    return this.props.arrivalWindow;
  }

  public get targetArrival(): Date | undefined {
    const targetArrival = this.props.arrivalWindow.targetArrival;

    return targetArrival !== undefined
      ? JourneyDemandScheduleEntity.cloneDate(targetArrival)
      : undefined;
  }

  public get maximumArrival(): Date | undefined {
    const maximumArrival = this.props.arrivalWindow.maximumArrival;

    return maximumArrival !== undefined
      ? JourneyDemandScheduleEntity.cloneDate(maximumArrival)
      : undefined;
  }

  public setArrivalWindow(arrivalWindow: JourneyDemandArrivalWindow): void {
    JourneyDemandScheduleEntity.validateArrivalAgainstDeparture(
      this.props.scheduleWindow,
      arrivalWindow,
    );

    this.props.arrivalWindow = arrivalWindow;

    this.touch();
  }

  // ===========================================================================
  // Target Arrival
  // ===========================================================================

  public setTargetArrival(targetArrival: Date): void {
    JourneyDemandScheduleEntity.assertDate(targetArrival, 'Target arrival');

    const arrivalWindow = new JourneyDemandArrivalWindow(
      targetArrival,
      this.props.arrivalWindow.maximumArrival,
    );

    JourneyDemandScheduleEntity.validateArrivalAgainstDeparture(
      this.props.scheduleWindow,
      arrivalWindow,
    );

    this.props.arrivalWindow = arrivalWindow;

    this.touch();
  }

  public clearTargetArrival(): void {
    if (!this.props.arrivalWindow.hasTargetArrival) {
      return;
    }

    this.props.arrivalWindow = this.props.arrivalWindow.clearTargetArrival();

    this.touch();
  }

  // ===========================================================================
  // Maximum Arrival
  // ===========================================================================

  public setMaximumArrival(maximumArrival: Date): void {
    JourneyDemandScheduleEntity.assertDate(maximumArrival, 'Maximum arrival');

    const arrivalWindow = new JourneyDemandArrivalWindow(
      this.props.arrivalWindow.targetArrival,
      maximumArrival,
    );

    JourneyDemandScheduleEntity.validateArrivalAgainstDeparture(
      this.props.scheduleWindow,
      arrivalWindow,
    );

    this.props.arrivalWindow = arrivalWindow;

    this.touch();
  }

  public clearMaximumArrival(): void {
    if (!this.props.arrivalWindow.hasMaximumArrival) {
      return;
    }

    this.props.arrivalWindow = this.props.arrivalWindow.clearMaximumArrival();

    this.touch();
  }

  public clearArrivalWindow(): void {
    if (!this.props.arrivalWindow.hasWindow) {
      return;
    }

    this.props.arrivalWindow = new JourneyDemandArrivalWindow();

    this.touch();
  }

  // ===========================================================================
  // Timezone
  // ===========================================================================

  public get timezone(): JourneyDemandTimezone {
    return this.props.timezone;
  }

  public setTimezone(timezone: JourneyDemandTimezone): void {
    this.props.timezone = timezone;

    this.touch();
  }

  // ===========================================================================
  // Scheduling Queries
  // ===========================================================================

  public hasTargetArrival(): boolean {
    return this.props.arrivalWindow.hasTargetArrival;
  }

  public hasMaximumArrival(): boolean {
    return this.props.arrivalWindow.hasMaximumArrival;
  }

  public hasArrivalConstraint(): boolean {
    return this.props.arrivalWindow.hasWindow;
  }

  public hasMaximumArrivalConstraint(): boolean {
    return this.props.arrivalWindow.hasMaximumArrival;
  }

  public hasDepartureWindow(): boolean {
    return this.earliestDeparture.getTime() !== this.latestDeparture.getTime();
  }

  public isExactDepartureTime(): boolean {
    return this.earliestDeparture.getTime() === this.latestDeparture.getTime();
  }

  public isExactArrivalTime(): boolean {
    return this.props.arrivalWindow.isExactArrivalTime;
  }

  // ===========================================================================
  // Departure Queries
  // ===========================================================================

  public isDepartureWindowOpenAt(at: Date): boolean {
    JourneyDemandScheduleEntity.assertDate(at, 'Departure time');

    const timestamp = at.getTime();

    return (
      timestamp >= this.earliestDeparture.getTime() &&
      timestamp <= this.latestDeparture.getTime()
    );
  }

  public isDepartureWindowExpired(at: Date = new Date()): boolean {
    JourneyDemandScheduleEntity.assertDate(at, 'Departure time');

    return at.getTime() > this.latestDeparture.getTime();
  }

  public isDepartureWindowUpcoming(at: Date = new Date()): boolean {
    JourneyDemandScheduleEntity.assertDate(at, 'Departure time');

    return at.getTime() < this.earliestDeparture.getTime();
  }

  // ===========================================================================
  // Arrival Queries
  // ===========================================================================

  public isArrivalWithinMaximum(arrival: Date): boolean {
    JourneyDemandScheduleEntity.assertDate(arrival, 'Arrival time');

    const maximumArrival = this.props.arrivalWindow.maximumArrival;

    if (maximumArrival === undefined) {
      return true;
    }

    return arrival.getTime() <= maximumArrival.getTime();
  }

  public isArrivalAtOrBeforeTarget(arrival: Date): boolean {
    JourneyDemandScheduleEntity.assertDate(arrival, 'Arrival time');

    const targetArrival = this.props.arrivalWindow.targetArrival;

    if (targetArrival === undefined) {
      return true;
    }

    return arrival.getTime() <= targetArrival.getTime();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  public get createdAt(): Date {
    return JourneyDemandScheduleEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneyDemandScheduleEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    JourneyDemandScheduleEntity.assertDate(updatedAt, 'Updated at');

    this.props.updatedAt = JourneyDemandScheduleEntity.cloneDate(updatedAt);
  }

  override touch(at: Date = new Date()): void {
    JourneyDemandScheduleEntity.assertDate(at, 'Updated at');

    this.props.updatedAt = JourneyDemandScheduleEntity.cloneDate(at);
  }

  // ===========================================================================
  // Equality
  // ===========================================================================

  override equals(
    other?: Entity<JourneyDemandScheduleProps, JourneyDemandSchedulePublicId>,
  ): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  private static validateArrivalAgainstDeparture(
    scheduleWindow: JourneyDemandScheduleWindow,
    arrivalWindow: JourneyDemandArrivalWindow,
  ): void {
    const targetArrival = arrivalWindow.targetArrival;
    const maximumArrival = arrivalWindow.maximumArrival;

    // -------------------------------------------------------------------------
    // Target arrival
    // -------------------------------------------------------------------------

    if (
      targetArrival !== undefined &&
      targetArrival.getTime() < scheduleWindow.earliestDeparture.getTime()
    ) {
      throw new Error(
        'Journey demand target arrival cannot be before earliest departure.',
      );
    }

    // -------------------------------------------------------------------------
    // Maximum arrival
    // -------------------------------------------------------------------------

    if (
      maximumArrival !== undefined &&
      maximumArrival.getTime() < scheduleWindow.latestDeparture.getTime()
    ) {
      throw new Error(
        'Journey demand maximum arrival cannot be before latest departure.',
      );
    }

    // -------------------------------------------------------------------------
    // Arrival ordering
    // -------------------------------------------------------------------------

    if (
      targetArrival !== undefined &&
      maximumArrival !== undefined &&
      targetArrival.getTime() > maximumArrival.getTime()
    ) {
      throw new Error(
        'Journey demand target arrival cannot be after maximum arrival.',
      );
    }
  }

  // ===========================================================================
  // Internal Helpers
  // ===========================================================================

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }

  private static assertDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new Error(`${fieldName} must be a valid Date.`);
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyDemandScheduleProps };
