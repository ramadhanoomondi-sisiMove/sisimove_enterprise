// src/domains/journey/domain/entities/journey-corridor.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyCorridorPublicId } from '../value-objects/journey-corridor-public-id.vo';
import type { JourneyCorridorKey } from '../value-objects/journey-corridor-key.vo';
import type { JourneyLocationName } from '../value-objects/journey-location-name.vo';
import type { JourneyLatitude } from '../value-objects/journey-latitude.vo';
import type { JourneyLongitude } from '../value-objects/journey-longitude.vo';

import type { JourneyWaypointEntity } from './journey-waypoint.entity';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyCorridorProps {
  publicId: JourneyCorridorPublicId;

  originName: JourneyLocationName;
  destinationName: JourneyLocationName;

  originLatitude: JourneyLatitude;
  originLongitude: JourneyLongitude;

  destinationLatitude: JourneyLatitude;
  destinationLongitude: JourneyLongitude;

  corridorKey: JourneyCorridorKey | undefined;

  waypoints: JourneyWaypointEntity[];

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyCorridorEntity extends Entity<JourneyCorridorProps> {
  private constructor(props: JourneyCorridorProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: JourneyCorridorProps): JourneyCorridorEntity {
    return new JourneyCorridorEntity(props);
  }

  public static rehydrate(
    props: JourneyCorridorProps,
    id: UniqueEntityId,
  ): JourneyCorridorEntity {
    return new JourneyCorridorEntity(props, id);
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

  get originName(): JourneyLocationName {
    return this.props.originName;
  }

  get destinationName(): JourneyLocationName {
    return this.props.destinationName;
  }

  get originLatitude(): JourneyLatitude {
    return this.props.originLatitude;
  }

  get originLongitude(): JourneyLongitude {
    return this.props.originLongitude;
  }

  get destinationLatitude(): JourneyLatitude {
    return this.props.destinationLatitude;
  }

  get destinationLongitude(): JourneyLongitude {
    return this.props.destinationLongitude;
  }

  get corridorKey(): JourneyCorridorKey | undefined {
    return this.props.corridorKey;
  }

  get waypoints(): readonly JourneyWaypointEntity[] {
    return this.props.waypoints;
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

  setOriginName(originName: JourneyLocationName): void {
    this.props.originName = originName;
  }

  setDestinationName(destinationName: JourneyLocationName): void {
    this.props.destinationName = destinationName;
  }

  setOriginCoordinates(
    latitude: JourneyLatitude,
    longitude: JourneyLongitude,
  ): void {
    this.props.originLatitude = latitude;
    this.props.originLongitude = longitude;
  }

  setDestinationCoordinates(
    latitude: JourneyLatitude,
    longitude: JourneyLongitude,
  ): void {
    this.props.destinationLatitude = latitude;
    this.props.destinationLongitude = longitude;
  }

  setCorridorKey(corridorKey: JourneyCorridorKey | undefined): void {
    this.props.corridorKey = corridorKey;
  }

  addWaypoint(waypoint: JourneyWaypointEntity): void {
    if (this.props.waypoints.some((existing) => existing.equals(waypoint))) {
      return;
    }

    this.props.waypoints.push(waypoint);
  }

  removeWaypoint(waypoint: JourneyWaypointEntity): void {
    this.props.waypoints = this.props.waypoints.filter(
      (existing) => !existing.equals(waypoint),
    );
  }

  setWaypoints(waypoints: JourneyWaypointEntity[]): void {
    this.props.waypoints = [...waypoints];
  }

  clearWaypoints(): void {
    this.props.waypoints = [];
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  hasCorridorKey(): boolean {
    return this.props.corridorKey !== undefined;
  }

  hasWaypoints(): boolean {
    return this.props.waypoints.length > 0;
  }

  waypointCount(): number {
    return this.props.waypoints.length;
  }

  containsWaypoint(waypoint: JourneyWaypointEntity): boolean {
    return this.props.waypoints.some((existing) => existing.equals(waypoint));
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: JourneyCorridorEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyCorridorProps };
