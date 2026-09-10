// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Mapper
// -----------------------------------------------------------------------------
//
// Maps Journey Demand API transport responses into frontend feature models.
//
// Architectural boundary:
//
// API transport DTO
//       ↓
// JourneyDemandMapper
//       ↓
// JourneyDemand feature model
//
// This mapper must:
// - contain no business logic
// - contain no API calls
// - contain no persistence concerns
// - contain no React concerns
// - preserve backend-authoritative values
//
// The transport contracts are owned by the API layer:
//
// api/
// └── journey-demands.types.ts
//
// The feature models are owned by the model layer:
//
// models/
// └── journey-demand*.ts
//
// The mapper is the explicit boundary between those two representations.
//
// Collection responses are handled by the application/hook layer:
//
// JourneyDemandResponse[]
//       ↓
// response.map(journeyDemandMapper.map)
//       ↓
// JourneyDemand[]
//
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Feature Models
// -----------------------------------------------------------------------------

import type {
  JourneyDemand,
  JourneyDemandCapacity,
  JourneyDemandPricing,
  JourneyDemandRoute,
  JourneyDemandSchedule,
  JourneyDemandWaypoint,
} from '../models';


// -----------------------------------------------------------------------------
// Transport Types
// -----------------------------------------------------------------------------

import type {
  JourneyDemandCapacityResponse,
  JourneyDemandPricingResponse,
  JourneyDemandResponse,
  JourneyDemandRouteResponse,
  JourneyDemandScheduleResponse,
  JourneyDemandWaypointResponse,
} from '../api';


// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class JourneyDemandMapper {
  /**
   * Maps a single Journey Demand API response into the frontend feature model.
   *
   * The mapper does not transform or derive business state. Values supplied
   * by the backend are preserved as received.
   */
  public map(response: JourneyDemandResponse): JourneyDemand {
    return {
      publicId: response.publicId,
      requesterPublicId: response.requesterPublicId,
      status: response.status,
      route: this.mapRoute(response.route),
      schedule: this.mapSchedule(response.schedule),
      capacity: this.mapCapacity(response.capacity),
      pricing: this.mapPricing(response.pricing),
      isActive: response.isActive,
      isMatchable: response.isMatchable,
    };
  }

  /**
   * Maps the Journey Demand route transport representation.
   */
  private mapRoute(
    response: JourneyDemandRouteResponse,
  ): JourneyDemandRoute {
    return {
      publicId: response.publicId,
      originName: response.originName,
      destinationName: response.destinationName,
      waypoints: response.waypoints.map((waypoint) =>
        this.mapWaypoint(waypoint),
      ),
    };
  }

  /**
   * Maps a Journey Demand waypoint transport representation.
   */
  private mapWaypoint(
    response: JourneyDemandWaypointResponse,
  ): JourneyDemandWaypoint {
    return {
      publicId: response.publicId,
      type: response.type,
      sequence: response.sequence,
      name: response.name,
      pickupRequired: response.pickupRequired,
      dropoffRequired: response.dropoffRequired,
    };
  }

  /**
   * Maps the Journey Demand schedule transport representation.
   *
   * ISO-8601 datetime strings are intentionally preserved as strings.
   * Date parsing and presentation belong to the consuming layer.
   */
  private mapSchedule(
    response: JourneyDemandScheduleResponse,
  ): JourneyDemandSchedule {
    return {
      publicId: response.publicId,
      earliestDeparture: response.earliestDeparture,
      latestDeparture: response.latestDeparture,
      targetArrival: response.targetArrival,
      maximumArrival: response.maximumArrival,
      timezone: response.timezone,
    };
  }

  /**
   * Maps the Journey Demand capacity transport representation.
   *
   * Backend-calculated capacity values are preserved exactly.
   */
  private mapCapacity(
    response: JourneyDemandCapacityResponse,
  ): JourneyDemandCapacity {
    return {
      publicId: response.publicId,
      requestedSeats: response.requestedSeats,
      matchedSeats: response.matchedSeats,
      remainingSeats: response.remainingSeats,
    };
  }

  /**
   * Maps requester pricing preferences.
   *
   * These values represent Journey Demand preferences only.
   * Commercial, payment, commission, settlement, and wallet data do not
   * belong in this mapping.
   */
  private mapPricing(
    response: JourneyDemandPricingResponse,
  ): JourneyDemandPricing {
    return {
      publicId: response.publicId,
      maximumPricePerSeat: response.maximumPricePerSeat,
      preferredPricePerSeat: response.preferredPricePerSeat,
      currency: response.currency,
    };
  }
}


// -----------------------------------------------------------------------------
// Shared Mapper Instance
// -----------------------------------------------------------------------------

export const journeyDemandMapper = new JourneyDemandMapper();