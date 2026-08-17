// -----------------------------------------------------------------------------
// Journey Demand Corridor Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandCorridorId } from '../value-objects/journey-demand-corridor-id.vo';
import { JourneyDemandCorridorPublicId } from '../value-objects/journey-demand-corridor-public-id.vo';
import type { JourneyDemandCorridorKey } from '../value-objects/journey-demand-corridor-key.vo';
import type { JourneyDemandLocation } from '../value-objects/journey-demand-location.vo';
import type { JourneyDemandCoordinate } from '../value-objects/journey-demand-coordinate.vo';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypointEntity } from './journey-demand-waypoint.entity';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyDemandCorridorProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: JourneyDemandCorridorPublicId;

  // ---------------------------------------------------------------------------
  // Corridor
  // ---------------------------------------------------------------------------

  originName: JourneyDemandLocation;

  destinationName: JourneyDemandLocation;

  originCoordinates: JourneyDemandCoordinate;

  destinationCoordinates: JourneyDemandCoordinate;

  /**
   * Stable discovery/matching identifier.
   *
   * This is intentionally NOT a relation to JourneyCorridor.
   */
  corridorKey: JourneyDemandCorridorKey | undefined;

  // ---------------------------------------------------------------------------
  // Waypoints
  // ---------------------------------------------------------------------------

  waypoints: JourneyDemandWaypointEntity[];

  // ---------------------------------------------------------------------------
  // Audit timestamps
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyDemandCorridorEntity extends Entity<
  JourneyDemandCorridorProps,
  JourneyDemandCorridorPublicId
> {
  private constructor(
    props: JourneyDemandCorridorProps,
    id?: UniqueEntityId,
    publicId?: JourneyDemandCorridorPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneyDemandCorridorPublicId;

    originName: JourneyDemandLocation;

    destinationName: JourneyDemandLocation;

    originCoordinates: JourneyDemandCoordinate;

    destinationCoordinates: JourneyDemandCoordinate;

    corridorKey?: JourneyDemandCorridorKey;

    waypoints?: JourneyDemandWaypointEntity[];

    createdAt?: Date;

    updatedAt?: Date;
  }): JourneyDemandCorridorEntity {
    const now = new Date();

    const createdAt = JourneyDemandCorridorEntity.cloneDate(
      props.createdAt ?? now,
    );

    const updatedAt = JourneyDemandCorridorEntity.cloneDate(
      props.updatedAt ?? now,
    );

    return new JourneyDemandCorridorEntity({
      publicId: props.publicId ?? new JourneyDemandCorridorPublicId(),

      originName: props.originName,

      destinationName: props.destinationName,

      originCoordinates: props.originCoordinates,

      destinationCoordinates: props.destinationCoordinates,

      corridorKey:
        props.corridorKey !== undefined ? props.corridorKey : undefined,

      waypoints: [...(props.waypoints ?? [])],

      createdAt,

      updatedAt,
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyDemandCorridorProps,
    id: JourneyDemandCorridorId,
    publicId: JourneyDemandCorridorPublicId,
  ): JourneyDemandCorridorEntity {
    return new JourneyDemandCorridorEntity(
      {
        ...props,

        waypoints: [...props.waypoints],

        createdAt: JourneyDemandCorridorEntity.cloneDate(props.createdAt),

        updatedAt: JourneyDemandCorridorEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  override get publicId(): JourneyDemandCorridorPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Origin
  // ---------------------------------------------------------------------------

  get originName(): JourneyDemandLocation {
    return this.props.originName;
  }

  setOriginName(originName: JourneyDemandLocation): void {
    this.props.originName = originName;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Destination
  // ---------------------------------------------------------------------------

  get destinationName(): JourneyDemandLocation {
    return this.props.destinationName;
  }

  setDestinationName(destinationName: JourneyDemandLocation): void {
    this.props.destinationName = destinationName;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Coordinates
  // ---------------------------------------------------------------------------

  get originCoordinates(): JourneyDemandCoordinate {
    return this.props.originCoordinates;
  }

  get destinationCoordinates(): JourneyDemandCoordinate {
    return this.props.destinationCoordinates;
  }

  setOriginCoordinates(coordinates: JourneyDemandCoordinate): void {
    this.props.originCoordinates = coordinates;
    this.touch();
  }

  setDestinationCoordinates(coordinates: JourneyDemandCoordinate): void {
    this.props.destinationCoordinates = coordinates;
    this.touch();
  }

  setCoordinates(
    originCoordinates: JourneyDemandCoordinate,
    destinationCoordinates: JourneyDemandCoordinate,
  ): void {
    this.props.originCoordinates = originCoordinates;
    this.props.destinationCoordinates = destinationCoordinates;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Corridor Key
  // ---------------------------------------------------------------------------

  get corridorKey(): JourneyDemandCorridorKey | undefined {
    return this.props.corridorKey;
  }

  setCorridorKey(corridorKey: JourneyDemandCorridorKey | undefined): void {
    this.props.corridorKey = corridorKey;
    this.touch();
  }

  hasCorridorKey(): boolean {
    return this.props.corridorKey !== undefined;
  }

  clearCorridorKey(): void {
    if (this.props.corridorKey === undefined) {
      return;
    }

    this.props.corridorKey = undefined;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Waypoints
  // ---------------------------------------------------------------------------

  get waypoints(): readonly JourneyDemandWaypointEntity[] {
    return this.props.waypoints;
  }

  addWaypoint(waypoint: JourneyDemandWaypointEntity): void {
    if (this.props.waypoints.some((existing) => existing.equals(waypoint))) {
      return;
    }

    this.props.waypoints.push(waypoint);

    this.touch();
  }

  removeWaypoint(waypoint: JourneyDemandWaypointEntity): void {
    const originalLength = this.props.waypoints.length;

    this.props.waypoints = this.props.waypoints.filter(
      (existing) => !existing.equals(waypoint),
    );

    if (this.props.waypoints.length !== originalLength) {
      this.touch();
    }
  }

  setWaypoints(waypoints: JourneyDemandWaypointEntity[]): void {
    this.props.waypoints = [...waypoints];
    this.touch();
  }

  clearWaypoints(): void {
    if (this.props.waypoints.length === 0) {
      return;
    }

    this.props.waypoints = [];
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Waypoint Queries
  // ---------------------------------------------------------------------------

  hasWaypoints(): boolean {
    return this.props.waypoints.length > 0;
  }

  waypointCount(): number {
    return this.props.waypoints.length;
  }

  getWaypointById(
    waypointId: UniqueEntityId,
  ): JourneyDemandWaypointEntity | undefined {
    return this.props.waypoints.find((waypoint) =>
      waypoint.id.equals(waypointId),
    );
  }

  getWaypointByPublicId(
    publicId: JourneyDemandWaypointEntity['publicId'],
  ): JourneyDemandWaypointEntity | undefined {
    return this.props.waypoints.find((waypoint) =>
      waypoint.publicId.equals(publicId),
    );
  }

  // ---------------------------------------------------------------------------
  // Origin / Destination Queries
  // ---------------------------------------------------------------------------

  getOriginWaypoint(): JourneyDemandWaypointEntity | undefined {
    return this.props.waypoints.find((waypoint) => waypoint.isOrigin());
  }

  getDestinationWaypoint(): JourneyDemandWaypointEntity | undefined {
    return this.props.waypoints.find((waypoint) => waypoint.isDestination());
  }

  getPickupWaypoints(): readonly JourneyDemandWaypointEntity[] {
    return this.props.waypoints.filter((waypoint) => waypoint.isPickup());
  }

  getDropoffWaypoints(): readonly JourneyDemandWaypointEntity[] {
    return this.props.waypoints.filter((waypoint) => waypoint.isDropoff());
  }

  getIntermediateWaypoints(): readonly JourneyDemandWaypointEntity[] {
    return this.props.waypoints.filter((waypoint) => waypoint.isWaypoint());
  }

  // ---------------------------------------------------------------------------
  // Ordering
  // ---------------------------------------------------------------------------

  getOrderedWaypoints(): readonly JourneyDemandWaypointEntity[] {
    return [...this.props.waypoints].sort(
      (a, b) => a.sequence.value - b.sequence.value,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation Helpers
  // ---------------------------------------------------------------------------

  hasOrigin(): boolean {
    return this.getOriginWaypoint() !== undefined;
  }

  hasDestination(): boolean {
    return this.getDestinationWaypoint() !== undefined;
  }

  isComplete(): boolean {
    return (
      this.props.originName.value.trim().length > 0 &&
      this.props.destinationName.value.trim().length > 0 &&
      this.hasOrigin() &&
      this.hasDestination()
    );
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  get createdAt(): Date {
    return JourneyDemandCorridorEntity.cloneDate(this.props.createdAt);
  }

  get updatedAt(): Date {
    return JourneyDemandCorridorEntity.cloneDate(this.props.updatedAt);
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyDemandCorridorEntity.cloneDate(updatedAt);
  }

  override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyDemandCorridorEntity.cloneDate(at);
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

export type { JourneyDemandCorridorProps };
