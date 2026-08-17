// -----------------------------------------------------------------------------
// Journey Demand Waypoint Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandWaypointPublicId } from '../value-objects/journey-demand-waypoint-public-id.vo';

import type { JourneyDemandWaypointTypeValueObject } from '../value-objects/journey-demand-waypoint-type.vo';

import type { JourneyDemandSequence } from '../value-objects/journey-demand-sequence.vo';

import type { JourneyDemandLocation } from '../value-objects/journey-demand-location.vo';

import { JourneyDemandCoordinate } from '../value-objects/journey-demand-coordinate.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyDemandWaypointProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: JourneyDemandWaypointPublicId;

  // ---------------------------------------------------------------------------
  // Waypoint
  // ---------------------------------------------------------------------------

  type: JourneyDemandWaypointTypeValueObject;

  sequence: JourneyDemandSequence;

  name: JourneyDemandLocation;

  /**
   * Geographic position of the waypoint.
   *
   * JourneyDemandCoordinate owns both latitude and longitude as a single
   * geographic value object.
   */
  coordinates: JourneyDemandCoordinate;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyDemandWaypointEntity extends Entity<
  JourneyDemandWaypointProps,
  JourneyDemandWaypointPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(
    props: JourneyDemandWaypointProps,
    id?: UniqueEntityId,
    publicId?: JourneyDemandWaypointPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(props: {
    publicId: JourneyDemandWaypointPublicId;

    type: JourneyDemandWaypointTypeValueObject;

    sequence: JourneyDemandSequence;

    name: JourneyDemandLocation;

    coordinates: JourneyDemandCoordinate;

    createdAt?: Date;

    updatedAt?: Date;
  }): JourneyDemandWaypointEntity {
    const now = new Date();

    return new JourneyDemandWaypointEntity(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId: props.publicId,

        // ---------------------------------------------------------------------
        // Waypoint
        // ---------------------------------------------------------------------

        type: props.type,

        sequence: props.sequence,

        name: props.name,

        coordinates: props.coordinates,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: JourneyDemandWaypointEntity.cloneDate(
          props.createdAt ?? now,
        ),

        updatedAt: JourneyDemandWaypointEntity.cloneDate(
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
    props: JourneyDemandWaypointProps,
    id: UniqueEntityId,
  ): JourneyDemandWaypointEntity {
    return new JourneyDemandWaypointEntity(
      {
        ...props,

        createdAt: JourneyDemandWaypointEntity.cloneDate(props.createdAt),

        updatedAt: JourneyDemandWaypointEntity.cloneDate(props.updatedAt),
      },
      id,
      props.publicId,
    );
  }

  // ===========================================================================
  // Waypoint Type
  // ===========================================================================

  get type(): JourneyDemandWaypointTypeValueObject {
    return this.props.type;
  }

  setType(type: JourneyDemandWaypointTypeValueObject): void {
    this.props.type = type;

    this.touch();
  }

  // ===========================================================================
  // Sequence
  // ===========================================================================

  get sequence(): JourneyDemandSequence {
    return this.props.sequence;
  }

  setSequence(sequence: JourneyDemandSequence): void {
    this.props.sequence = sequence;

    this.touch();
  }

  // ===========================================================================
  // Location Name
  // ===========================================================================

  get name(): JourneyDemandLocation {
    return this.props.name;
  }

  setName(name: JourneyDemandLocation): void {
    this.props.name = name;

    this.touch();
  }

  // ===========================================================================
  // Coordinates
  // ===========================================================================

  get coordinates(): JourneyDemandCoordinate {
    return this.props.coordinates;
  }

  get latitude(): number {
    return this.props.coordinates.latitude;
  }

  get longitude(): number {
    return this.props.coordinates.longitude;
  }

  setCoordinates(coordinates: JourneyDemandCoordinate): void {
    this.props.coordinates = coordinates;

    this.touch();
  }

  setLatitude(latitude: number): void {
    this.props.coordinates = new JourneyDemandCoordinate(
      latitude,
      this.props.coordinates.longitude,
    );

    this.touch();
  }

  setLongitude(longitude: number): void {
    this.props.coordinates = new JourneyDemandCoordinate(
      this.props.coordinates.latitude,
      longitude,
    );

    this.touch();
  }

  // ===========================================================================
  // Requirement Queries
  //
  // Requirements are derived from the waypoint type.
  // They are intentionally not stored as independent mutable state.
  // ===========================================================================

  get pickupRequired(): boolean {
    return this.props.type.requiresPickup;
  }

  get dropoffRequired(): boolean {
    return this.props.type.requiresDropoff;
  }

  requiresPickup(): boolean {
    return this.props.type.requiresPickup;
  }

  requiresDropoff(): boolean {
    return this.props.type.requiresDropoff;
  }

  hasPickupRequirement(): boolean {
    return this.props.type.requiresPickup;
  }

  hasDropoffRequirement(): boolean {
    return this.props.type.requiresDropoff;
  }

  // ===========================================================================
  // Waypoint Type Queries
  // ===========================================================================

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

  isEndpoint(): boolean {
    return this.props.type.isEndpoint;
  }

  isStop(): boolean {
    return this.props.type.isStop;
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  get createdAt(): Date {
    return JourneyDemandWaypointEntity.cloneDate(this.props.createdAt);
  }

  get updatedAt(): Date {
    return JourneyDemandWaypointEntity.cloneDate(this.props.updatedAt);
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyDemandWaypointEntity.cloneDate(updatedAt);
  }

  // ===========================================================================
  // Internal Helpers
  // ===========================================================================

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyDemandWaypointProps };
