// src/domains/journey/domain/value-objects/journey-waypoint-type.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Journey Waypoint Type
// -----------------------------------------------------------------------------

export enum JourneyWaypointType {
  ORIGIN = 'ORIGIN',
  DESTINATION = 'DESTINATION',
  PICKUP = 'PICKUP',
  DROPOFF = 'DROPOFF',
  WAYPOINT = 'WAYPOINT',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyWaypointTypeProps {
  value: JourneyWaypointType;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class JourneyWaypointTypeValueObject extends ValueObject<JourneyWaypointTypeProps> {
  constructor(type: JourneyWaypointType) {
    if (!Object.values(JourneyWaypointType).includes(type)) {
      throw new Error(`Invalid journey waypoint type "${type}".`);
    }

    super({
      value: type,
    });
  }

  get value(): JourneyWaypointType {
    return this.props.value;
  }

  get isOrigin(): boolean {
    return this.props.value === JourneyWaypointType.ORIGIN;
  }

  get isDestination(): boolean {
    return this.props.value === JourneyWaypointType.DESTINATION;
  }

  get isPickup(): boolean {
    return this.props.value === JourneyWaypointType.PICKUP;
  }

  get isDropoff(): boolean {
    return this.props.value === JourneyWaypointType.DROPOFF;
  }

  get isWaypoint(): boolean {
    return this.props.value === JourneyWaypointType.WAYPOINT;
  }

  get isEndpoint(): boolean {
    return (
      this.props.value === JourneyWaypointType.ORIGIN ||
      this.props.value === JourneyWaypointType.DESTINATION
    );
  }

  get isStop(): boolean {
    return (
      this.props.value === JourneyWaypointType.PICKUP ||
      this.props.value === JourneyWaypointType.DROPOFF ||
      this.props.value === JourneyWaypointType.WAYPOINT
    );
  }
}
