// -----------------------------------------------------------------------------
// Journey Demand Waypoint Requirements
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandWaypointRequirementsProps {
  pickupRequired: boolean;
  dropoffRequired: boolean;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Pickup and dropoff requirements associated with a Journey Demand waypoint.
 *
 * This value object represents the business requirements for how a waypoint
 * participates in passenger pickup and dropoff.
 */
export class JourneyDemandWaypointRequirements extends ValueObject<JourneyDemandWaypointRequirementsProps> {
  constructor(
    pickupRequired: boolean = false,
    dropoffRequired: boolean = false,
  ) {
    super({
      pickupRequired,
      dropoffRequired,
    });
  }

  get pickupRequired(): boolean {
    return this.props.pickupRequired;
  }

  get dropoffRequired(): boolean {
    return this.props.dropoffRequired;
  }

  get hasPickupRequirement(): boolean {
    return this.props.pickupRequired;
  }

  get hasDropoffRequirement(): boolean {
    return this.props.dropoffRequired;
  }

  get hasRequirements(): boolean {
    return this.props.pickupRequired || this.props.dropoffRequired;
  }

  get hasNoRequirements(): boolean {
    return !this.props.pickupRequired && !this.props.dropoffRequired;
  }

  withPickupRequired(required: boolean): JourneyDemandWaypointRequirements {
    return new JourneyDemandWaypointRequirements(
      required,
      this.props.dropoffRequired,
    );
  }

  withDropoffRequired(required: boolean): JourneyDemandWaypointRequirements {
    return new JourneyDemandWaypointRequirements(
      this.props.pickupRequired,
      required,
    );
  }

  requirePickup(): JourneyDemandWaypointRequirements {
    return this.withPickupRequired(true);
  }

  requireDropoff(): JourneyDemandWaypointRequirements {
    return this.withDropoffRequired(true);
  }

  removePickupRequirement(): JourneyDemandWaypointRequirements {
    return this.withPickupRequired(false);
  }

  removeDropoffRequirement(): JourneyDemandWaypointRequirements {
    return this.withDropoffRequired(false);
  }
}
