// -----------------------------------------------------------------------------
// Journey Demand Waypoint Type
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Waypoint Type
// -----------------------------------------------------------------------------

export enum JourneyDemandWaypointType {
  ORIGIN = 'ORIGIN',
  DESTINATION = 'DESTINATION',
  PICKUP = 'PICKUP',
  DROPOFF = 'DROPOFF',
  WAYPOINT = 'WAYPOINT',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandWaypointTypeProps {
  value: JourneyDemandWaypointType;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class JourneyDemandWaypointTypeValueObject extends ValueObject<JourneyDemandWaypointTypeProps> {
  constructor(type: JourneyDemandWaypointType) {
    if (!Object.values(JourneyDemandWaypointType).includes(type)) {
      throw new Error(`Invalid journey demand waypoint type "${type}".`);
    }

    super({
      value: type,
    });
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  get value(): JourneyDemandWaypointType {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Type predicates
  // ---------------------------------------------------------------------------

  get isOrigin(): boolean {
    return this.props.value === JourneyDemandWaypointType.ORIGIN;
  }

  get isDestination(): boolean {
    return this.props.value === JourneyDemandWaypointType.DESTINATION;
  }

  get isPickup(): boolean {
    return this.props.value === JourneyDemandWaypointType.PICKUP;
  }

  get isDropoff(): boolean {
    return this.props.value === JourneyDemandWaypointType.DROPOFF;
  }

  get isWaypoint(): boolean {
    return this.props.value === JourneyDemandWaypointType.WAYPOINT;
  }

  // ---------------------------------------------------------------------------
  // Semantic predicates
  // ---------------------------------------------------------------------------

  get isEndpoint(): boolean {
    return (
      this.props.value === JourneyDemandWaypointType.ORIGIN ||
      this.props.value === JourneyDemandWaypointType.DESTINATION
    );
  }

  get isStop(): boolean {
    return (
      this.props.value === JourneyDemandWaypointType.PICKUP ||
      this.props.value === JourneyDemandWaypointType.DROPOFF ||
      this.props.value === JourneyDemandWaypointType.WAYPOINT
    );
  }

  get requiresPickup(): boolean {
    return (
      this.props.value === JourneyDemandWaypointType.ORIGIN ||
      this.props.value === JourneyDemandWaypointType.PICKUP
    );
  }

  get requiresDropoff(): boolean {
    return (
      this.props.value === JourneyDemandWaypointType.DESTINATION ||
      this.props.value === JourneyDemandWaypointType.DROPOFF
    );
  }
}
