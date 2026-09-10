// -----------------------------------------------------------------------------
// sisiMove — Traveller Journey
// -----------------------------------------------------------------------------
//
// Presentation component for a publicly discoverable Journey.
//
// The Journey is the primary public discovery object.
//
// Responsibilities:
// - Compose the public Journey route, schedule, vehicle, availability,
//   and price components.
// - Consume the frontend Journey read model directly.
// - Map public Journey waypoint projections into presentation values.
// - Provide presentation-level display controls.
//
// This component does not:
// - fetch Journey data;
// - calculate availability;
// - calculate prices;
// - calculate Commercial fees or commissions;
// - perform booking logic;
// - expose private vehicle information;
// - determine Journey eligibility.
//
// The supplied Journey is already a server-authoritative public projection.
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import type { Journey } from '@/features/journeys';

import { cn } from '../../../foundation/utils/cn';

import { TravellerAvailability } from './traveller-availability';
import { TravellerPrice } from './traveller-price';
import { TravellerRoute } from './traveller-route';
import { TravellerSchedule } from './traveller-schedule';
import { TravellerVehicle } from './traveller-vehicle';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TravellerJourneyProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
  > {
  /**
   * Public Journey read model.
   *
   * The Journey is the authoritative public discovery object from which the
   * presentation sections are composed.
   */
  readonly journey: Journey;

  /**
   * Optional presentation content.
   */
  readonly routeLeadingContent?: ReactNode;
  readonly scheduleLeadingContent?: ReactNode;
  readonly vehicleLeadingContent?: ReactNode;
  readonly availabilityLeadingContent?: ReactNode;
  readonly priceLeadingContent?: ReactNode;

  /**
   * Display controls.
   */
  readonly showWaypoints?: boolean;
  readonly showVehicle?: boolean;
  readonly showAvailability?: boolean;
  readonly showPrice?: boolean;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Determines whether the public vehicle projection contains information worth
 * rendering.
 *
 * This is a presentation decision only. It does not determine whether a
 * Journey has a vehicle assigned or whether the Journey is eligible.
 */
function hasVehicleInformation(
  vehicle: Journey['vehicle'],
): boolean {
  if (!vehicle) {
    return false;
  }

  return (
    Boolean(vehicle.make?.trim()) ||
    Boolean(vehicle.model?.trim()) ||
    vehicle.year !== null ||
    Boolean(vehicle.color?.trim()) ||
    Boolean(vehicle.imageUrl?.trim())
  );
}

/**
 * Maps the structured public Journey waypoints into the plain display values
 * expected by TravellerRoute.
 *
 * Only the public waypoint name crosses into the generic presentation
 * component. Coordinates, identifiers, and operational pickup/drop-off
 * information remain outside TravellerRoute.
 */
function getPublicWaypointNames(
  waypoints: Journey['route']['waypoints'],
): string[] {
  return waypoints
    .map((waypoint) => waypoint.name.trim())
    .filter(Boolean);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerJourney({
  journey,

  routeLeadingContent,
  scheduleLeadingContent,
  vehicleLeadingContent,
  availabilityLeadingContent,
  priceLeadingContent,

  showWaypoints = false,
  showVehicle = true,
  showAvailability = true,
  showPrice = true,

  className,
  ...props
}: TravellerJourneyProps) {
  const {
    route,
    schedule,
    vehicle,
    capacity,
    pricing,
  } = journey;

  const showVehicleSection =
    showVehicle &&
    hasVehicleInformation(vehicle);

  const publicVehicle =
    showVehicleSection
      ? vehicle
      : null;

  const waypointNames =
    showWaypoints
      ? getPublicWaypointNames(route.waypoints)
      : [];

  return (
    <div
      {...props}
      className={cn(
        'space-y-5',
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Route                                                               */}
      {/* ------------------------------------------------------------------- */}

      <TravellerRoute
        origin={route.originName}
        destination={route.destinationName}
        waypoints={waypointNames}
        showWaypoints={showWaypoints}
        leadingContent={routeLeadingContent}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Schedule                                                            */}
      {/* ------------------------------------------------------------------- */}

      <TravellerSchedule
        departureAt={schedule.departureAt}
        arrivalAt={schedule.arrivalAt}
        timezone={schedule.timezone}
        type="FIXED"
        leadingContent={scheduleLeadingContent}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Vehicle                                                             */}
      {/* ------------------------------------------------------------------- */}

      {publicVehicle && (
        <TravellerVehicle
          make={publicVehicle.make}
          model={publicVehicle.model}
          year={publicVehicle.year}
          color={publicVehicle.color}
          leadingContent={vehicleLeadingContent}
        />
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Availability                                                        */}
      {/* ------------------------------------------------------------------- */}

      {showAvailability && (
        <TravellerAvailability
          capacity={capacity.totalSeats}
          available={capacity.availableSeats}
          leadingContent={availabilityLeadingContent}
        />
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Price                                                               */}
      {/* ------------------------------------------------------------------- */}

      {showPrice && (
        <TravellerPrice
          amount={pricing.amount}
          currency={pricing.currency}
          leadingContent={priceLeadingContent}
        />
      )}
    </div>
  );
}