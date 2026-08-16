// src/domains/journey/domain/entities/journey-waypoint.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyWaypointPublicId } from '../value-objects/journey-waypoint-public-id.vo';
import type { JourneyWaypointTypeValueObject } from '../value-objects/journey-waypoint-type.vo';
import type { JourneyWaypointSequence } from '../value-objects/journey-waypoint-sequence.vo';
import type { JourneyLocationName } from '../value-objects/journey-location-name.vo';
import type { JourneyLatitude } from '../value-objects/journey-latitude.vo';
import type { JourneyLongitude } from '../value-objects/journey-longitude.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyWaypointProps {
  publicId: JourneyWaypointPublicId;

  type: JourneyWaypointTypeValueObject;
  sequence: JourneyWaypointSequence;

  name: JourneyLocationName;

  latitude: JourneyLatitude;
  longitude: JourneyLongitude;

  pickupAllowed: boolean;
  dropoffAllowed: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyWaypointEntity extends Entity<JourneyWaypointProps> {
  private constructor(props: JourneyWaypointProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: JourneyWaypointProps): JourneyWaypointEntity {
    return new JourneyWaypointEntity(props);
  }

  public static rehydrate(
    props: JourneyWaypointProps,
    id: UniqueEntityId,
  ): JourneyWaypointEntity {
    return new JourneyWaypointEntity(props, id);
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

  get type(): JourneyWaypointTypeValueObject {
    return this.props.type;
  }

  get sequence(): JourneyWaypointSequence {
    return this.props.sequence;
  }

  get name(): JourneyLocationName {
    return this.props.name;
  }

  get latitude(): JourneyLatitude {
    return this.props.latitude;
  }

  get longitude(): JourneyLongitude {
    return this.props.longitude;
  }

  get pickupAllowed(): boolean {
    return this.props.pickupAllowed;
  }

  get dropoffAllowed(): boolean {
    return this.props.dropoffAllowed;
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

  setType(type: JourneyWaypointTypeValueObject): void {
    this.props.type = type;
  }

  setSequence(sequence: JourneyWaypointSequence): void {
    this.props.sequence = sequence;
  }

  setName(name: JourneyLocationName): void {
    this.props.name = name;
  }

  setCoordinates(latitude: JourneyLatitude, longitude: JourneyLongitude): void {
    this.props.latitude = latitude;
    this.props.longitude = longitude;
  }

  setPickupAllowed(allowed: boolean): void {
    this.props.pickupAllowed = allowed;
  }

  setDropoffAllowed(allowed: boolean): void {
    this.props.dropoffAllowed = allowed;
  }

  allowPickup(): void {
    this.props.pickupAllowed = true;
  }

  disallowPickup(): void {
    this.props.pickupAllowed = false;
  }

  allowDropoff(): void {
    this.props.dropoffAllowed = true;
  }

  disallowDropoff(): void {
    this.props.dropoffAllowed = false;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  isOrigin(): boolean {
    return this.props.type.isOrigin;
  }

  isDestination(): boolean {
    return this.props.type.isDestination;
  }

  isPickup(): boolean {
    return this.props.type.isPickup;
  }

  isDropoff(): boolean {
    return this.props.type.isDropoff;
  }

  isWaypoint(): boolean {
    return this.props.type.isWaypoint;
  }

  canPickup(): boolean {
    return this.props.pickupAllowed;
  }

  canDropoff(): boolean {
    return this.props.dropoffAllowed;
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: JourneyWaypointEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyWaypointProps };
