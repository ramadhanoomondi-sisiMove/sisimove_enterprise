// -----------------------------------------------------------------------------
// Journey Booking Snapshot Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyBookingSnapshotPublicId } from '../value-objects/journey-booking-snapshot-public-id.vo';

import type { JourneyBookingOriginName } from '../value-objects/journey-booking-origin-name.vo';

import type { JourneyBookingDestinationName } from '../value-objects/journey-booking-destination-name.vo';

import type { JourneyBookingCoordinates } from '../value-objects/journey-booking-coordinates.vo';

import type { JourneyBookingDepartureAt } from '../value-objects/journey-booking-departure-at.vo';

import type { JourneyBookingArrivalAt } from '../value-objects/journey-booking-arrival-at.vo';

import type { JourneyBookingTimezone } from '../value-objects/journey-booking-timezone.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyBookingSnapshotProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: JourneyBookingSnapshotPublicId;

  // ---------------------------------------------------------------------------
  // Journey Snapshot
  // ---------------------------------------------------------------------------

  /**
   * Origin name captured at booking time.
   *
   * This is a historical snapshot and does not reference the Journey domain.
   */
  originName: JourneyBookingOriginName;

  /**
   * Destination name captured at booking time.
   *
   * This is a historical snapshot and does not reference the Journey domain.
   */
  destinationName: JourneyBookingDestinationName;

  /**
   * Origin geographic coordinate captured at booking time.
   */
  originCoordinates: JourneyBookingCoordinates;

  /**
   * Destination geographic coordinate captured at booking time.
   */
  destinationCoordinates: JourneyBookingCoordinates;

  /**
   * Scheduled journey departure captured at booking time.
   */
  departureAt: JourneyBookingDepartureAt;

  /**
   * Scheduled journey arrival captured at booking time.
   *
   * Arrival may be unknown when the booking is created.
   */
  arrivalAt?: JourneyBookingArrivalAt | undefined;

  /**
   * IANA timezone identifier captured at booking time.
   */
  timezone: JourneyBookingTimezone;

  // ---------------------------------------------------------------------------
  // Vehicle Snapshot
  // ---------------------------------------------------------------------------

  /**
   * Vehicle make captured at booking time.
   */
  vehicleMake?: string | undefined;

  /**
   * Vehicle model captured at booking time.
   */
  vehicleModel?: string | undefined;

  /**
   * Vehicle manufacturing year captured at booking time.
   */
  vehicleYear?: number | undefined;

  /**
   * Vehicle color captured at booking time.
   */
  vehicleColor?: string | undefined;

  /**
   * Vehicle registration captured at booking time.
   */
  vehicleRegistration?: string | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Represents the journey and vehicle state captured when a Journey Booking
 * was created.
 *
 * The snapshot intentionally does not reference JourneyCorridor,
 * JourneySchedule, JourneyVehicle, or other Journey-domain entities.
 *
 * It preserves the exact journey information presented to the passenger
 * at booking time.
 */
export class JourneyBookingSnapshotEntity extends Entity<
  JourneyBookingSnapshotProps,
  JourneyBookingSnapshotPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: JourneyBookingSnapshotProps,
    id?: UniqueEntityId,
    publicId?: JourneyBookingSnapshotPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneyBookingSnapshotPublicId;

    originName: JourneyBookingOriginName;

    destinationName: JourneyBookingDestinationName;

    originCoordinates: JourneyBookingCoordinates;

    destinationCoordinates: JourneyBookingCoordinates;

    departureAt: JourneyBookingDepartureAt;

    arrivalAt?: JourneyBookingArrivalAt | undefined;

    timezone: JourneyBookingTimezone;

    vehicleMake?: string | undefined;

    vehicleModel?: string | undefined;

    vehicleYear?: number | undefined;

    vehicleColor?: string | undefined;

    vehicleRegistration?: string | undefined;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): JourneyBookingSnapshotEntity {
    const now = new Date();

    if (props.vehicleYear !== undefined) {
      JourneyBookingSnapshotEntity.assertVehicleYear(props.vehicleYear);
    }

    return new JourneyBookingSnapshotEntity({
      publicId: props.publicId ?? new JourneyBookingSnapshotPublicId(),

      originName: props.originName,

      destinationName: props.destinationName,

      originCoordinates: props.originCoordinates,

      destinationCoordinates: props.destinationCoordinates,

      departureAt: props.departureAt,

      ...(props.arrivalAt !== undefined
        ? {
            arrivalAt: props.arrivalAt,
          }
        : {}),

      timezone: props.timezone,

      ...(props.vehicleMake !== undefined
        ? {
            vehicleMake: props.vehicleMake,
          }
        : {}),

      ...(props.vehicleModel !== undefined
        ? {
            vehicleModel: props.vehicleModel,
          }
        : {}),

      ...(props.vehicleYear !== undefined
        ? {
            vehicleYear: props.vehicleYear,
          }
        : {}),

      ...(props.vehicleColor !== undefined
        ? {
            vehicleColor: props.vehicleColor,
          }
        : {}),

      ...(props.vehicleRegistration !== undefined
        ? {
            vehicleRegistration: props.vehicleRegistration,
          }
        : {}),

      createdAt: JourneyBookingSnapshotEntity.cloneDate(props.createdAt ?? now),

      updatedAt: JourneyBookingSnapshotEntity.cloneDate(props.updatedAt ?? now),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyBookingSnapshotProps,
    id: UniqueEntityId,
    publicId: JourneyBookingSnapshotPublicId,
  ): JourneyBookingSnapshotEntity {
    if (props.vehicleYear !== undefined) {
      JourneyBookingSnapshotEntity.assertVehicleYear(props.vehicleYear);
    }

    return new JourneyBookingSnapshotEntity(
      {
        ...props,

        // The persistence public ID is authoritative during rehydration.
        publicId,

        createdAt: JourneyBookingSnapshotEntity.cloneDate(props.createdAt),

        updatedAt: JourneyBookingSnapshotEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): JourneyBookingSnapshotPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Origin
  // ---------------------------------------------------------------------------

  public get originName(): JourneyBookingOriginName {
    return this.props.originName;
  }

  public setOriginName(originName: JourneyBookingOriginName): void {
    this.props.originName = originName;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Destination
  // ---------------------------------------------------------------------------

  public get destinationName(): JourneyBookingDestinationName {
    return this.props.destinationName;
  }

  public setDestinationName(
    destinationName: JourneyBookingDestinationName,
  ): void {
    this.props.destinationName = destinationName;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Coordinates
  // ---------------------------------------------------------------------------

  public get originCoordinates(): JourneyBookingCoordinates {
    return this.props.originCoordinates;
  }

  public get destinationCoordinates(): JourneyBookingCoordinates {
    return this.props.destinationCoordinates;
  }

  public setOriginCoordinates(coordinates: JourneyBookingCoordinates): void {
    this.props.originCoordinates = coordinates;
    this.touch();
  }

  public setDestinationCoordinates(
    coordinates: JourneyBookingCoordinates,
  ): void {
    this.props.destinationCoordinates = coordinates;
    this.touch();
  }

  public setCoordinates(
    originCoordinates: JourneyBookingCoordinates,
    destinationCoordinates: JourneyBookingCoordinates,
  ): void {
    this.props.originCoordinates = originCoordinates;
    this.props.destinationCoordinates = destinationCoordinates;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Departure
  // ---------------------------------------------------------------------------

  public get departureAt(): JourneyBookingDepartureAt {
    return this.props.departureAt;
  }

  public setDepartureAt(departureAt: JourneyBookingDepartureAt): void {
    this.props.departureAt = departureAt;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Arrival
  // ---------------------------------------------------------------------------

  public get arrivalAt(): JourneyBookingArrivalAt | undefined {
    return this.props.arrivalAt;
  }

  public setArrivalAt(arrivalAt: JourneyBookingArrivalAt): void {
    this.props.arrivalAt = arrivalAt;
    this.touch();
  }

  public clearArrivalAt(): void {
    if (this.props.arrivalAt === undefined) {
      return;
    }

    delete this.props.arrivalAt;

    this.touch();
  }

  public hasArrivalAt(): boolean {
    return this.props.arrivalAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Timezone
  // ---------------------------------------------------------------------------

  public get timezone(): JourneyBookingTimezone {
    return this.props.timezone;
  }

  public setTimezone(timezone: JourneyBookingTimezone): void {
    this.props.timezone = timezone;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Vehicle Make
  // ---------------------------------------------------------------------------

  public get vehicleMake(): string | undefined {
    return this.props.vehicleMake;
  }

  public setVehicleMake(vehicleMake: string): void {
    this.props.vehicleMake = vehicleMake;
    this.touch();
  }

  public clearVehicleMake(): void {
    if (this.props.vehicleMake === undefined) {
      return;
    }

    delete this.props.vehicleMake;

    this.touch();
  }

  public hasVehicleMake(): boolean {
    return this.props.vehicleMake !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Vehicle Model
  // ---------------------------------------------------------------------------

  public get vehicleModel(): string | undefined {
    return this.props.vehicleModel;
  }

  public setVehicleModel(vehicleModel: string): void {
    this.props.vehicleModel = vehicleModel;
    this.touch();
  }

  public clearVehicleModel(): void {
    if (this.props.vehicleModel === undefined) {
      return;
    }

    delete this.props.vehicleModel;

    this.touch();
  }

  public hasVehicleModel(): boolean {
    return this.props.vehicleModel !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Vehicle Year
  // ---------------------------------------------------------------------------

  public get vehicleYear(): number | undefined {
    return this.props.vehicleYear;
  }

  public setVehicleYear(vehicleYear: number): void {
    JourneyBookingSnapshotEntity.assertVehicleYear(vehicleYear);

    this.props.vehicleYear = vehicleYear;
    this.touch();
  }

  public clearVehicleYear(): void {
    if (this.props.vehicleYear === undefined) {
      return;
    }

    delete this.props.vehicleYear;

    this.touch();
  }

  public hasVehicleYear(): boolean {
    return this.props.vehicleYear !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Vehicle Color
  // ---------------------------------------------------------------------------

  public get vehicleColor(): string | undefined {
    return this.props.vehicleColor;
  }

  public setVehicleColor(vehicleColor: string): void {
    this.props.vehicleColor = vehicleColor;
    this.touch();
  }

  public clearVehicleColor(): void {
    if (this.props.vehicleColor === undefined) {
      return;
    }

    delete this.props.vehicleColor;

    this.touch();
  }

  public hasVehicleColor(): boolean {
    return this.props.vehicleColor !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Vehicle Registration
  // ---------------------------------------------------------------------------

  public get vehicleRegistration(): string | undefined {
    return this.props.vehicleRegistration;
  }

  public setVehicleRegistration(vehicleRegistration: string): void {
    this.props.vehicleRegistration = vehicleRegistration;
    this.touch();
  }

  public clearVehicleRegistration(): void {
    if (this.props.vehicleRegistration === undefined) {
      return;
    }

    delete this.props.vehicleRegistration;

    this.touch();
  }

  public hasVehicleRegistration(): boolean {
    return this.props.vehicleRegistration !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Vehicle Queries
  // ---------------------------------------------------------------------------

  public hasVehicleSnapshot(): boolean {
    return (
      this.hasVehicleMake() ||
      this.hasVehicleModel() ||
      this.hasVehicleYear() ||
      this.hasVehicleColor() ||
      this.hasVehicleRegistration()
    );
  }

  public hasCompleteVehicleSnapshot(): boolean {
    return (
      this.hasVehicleMake() &&
      this.hasVehicleModel() &&
      this.hasVehicleYear() &&
      this.hasVehicleColor() &&
      this.hasVehicleRegistration()
    );
  }

  // ---------------------------------------------------------------------------
  // Snapshot Queries
  // ---------------------------------------------------------------------------

  public hasArrivalInformation(): boolean {
    return this.hasArrivalAt();
  }

  /**
   * Determines whether all mandatory journey snapshot information exists.
   *
   * The required properties are structurally mandatory in the entity, so
   * completeness here confirms the presence of the required domain values
   * rather than checking for `undefined`.
   */
  public isComplete(): boolean {
    return (
      this.props.originName !== undefined &&
      this.props.destinationName !== undefined &&
      this.props.originCoordinates !== undefined &&
      this.props.destinationCoordinates !== undefined &&
      this.props.departureAt !== undefined &&
      this.props.timezone !== undefined
    );
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return JourneyBookingSnapshotEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneyBookingSnapshotEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyBookingSnapshotEntity.cloneDate(updatedAt);
  }

  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyBookingSnapshotEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: JourneyBookingSnapshotEntity): boolean {
    if (!other) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static assertVehicleYear(year: number): void {
    if (!Number.isInteger(year)) {
      throw new Error('Journey booking vehicle year must be an integer.');
    }

    if (year < 1886 || year > 3000) {
      throw new Error(
        'Journey booking vehicle year must be between 1886 and 3000.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBookingSnapshotProps };
