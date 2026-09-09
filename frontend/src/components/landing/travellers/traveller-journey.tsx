// -----------------------------------------------------------------------------
// sisiMove — Traveller Journey
// -----------------------------------------------------------------------------
//
// Presentation component for a public traveller journey.
//
// Responsibilities:
// - Compose the public journey route, schedule, vehicle, availability,
//   and price components.
// - Consume the public traveller journey read model directly.
// - Provide presentation-level display controls.
//
// This component does not:
// - fetch journey data;
// - calculate availability;
// - calculate prices;
// - calculate Commercial fees or commissions;
// - perform booking logic;
// - expose private vehicle information;
// - determine journey eligibility.
//
// The supplied PublicTravellerJourney is already a server-authoritative
// public projection.
//
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import type {
  PublicTravellerJourney,
} from '@/features/traveller-discovery';

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
   * Public traveller journey projection.
   */
  readonly journey: PublicTravellerJourney;

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

function hasVehicleInformation(
  vehicle:
    PublicTravellerJourney['vehicle'],
): boolean {
  if (!vehicle) {
    return false;
  }

  return Boolean(
    vehicle.make?.trim() ||
      vehicle.model?.trim() ||
      vehicle.year !== null &&
      vehicle.year !== undefined ||
      vehicle.color?.trim() ||
      vehicle.imageUrl?.trim(),
  );
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
    availability,
    pricing,
  } = journey;

  const showVehicleSection =
    showVehicle &&
    hasVehicleInformation(vehicle);

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
        origin={route.origin}
        destination={route.destination}
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
        leadingContent={
          scheduleLeadingContent
        }
      />

      {/* ------------------------------------------------------------------- */}
      {/* Vehicle                                                             */}
      {/* ------------------------------------------------------------------- */}

      {showVehicleSection && (
        <TravellerVehicle
          make={vehicle?.make}
          model={vehicle?.model}
          year={vehicle?.year}
          color={vehicle?.color}
          leadingContent={
            vehicleLeadingContent
          }
        />
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Availability                                                        */}
      {/* ------------------------------------------------------------------- */}

      {showAvailability && (
        <TravellerAvailability
          capacity={
            availability.totalSeats
          }
          available={
            availability.availableSeats
          }
          leadingContent={
            availabilityLeadingContent
          }
        />
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Price                                                               */}
      {/* ------------------------------------------------------------------- */}

      {showPrice && (
        <TravellerPrice
          amount={pricing.amount}
          currency={pricing.currency}
          leadingContent={
            priceLeadingContent
          }
        />
      )}
    </div>
  );
}