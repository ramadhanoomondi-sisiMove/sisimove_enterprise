// -----------------------------------------------------------------------------
// Public Traveller Discovery Mapper
// -----------------------------------------------------------------------------
//
// Maps the public traveller-discovery API response into the frontend
// traveller-discovery read model.
//
// The mapper is the normalization boundary between transport data and
// feature-level models.
//
// Responsibilities:
// - Preserve the public API contract
// - Normalize nullable values
// - Produce stable frontend model shapes
// - Prevent transport implementation details from crossing the boundary
// - Preserve the public-data boundary
// - Preserve discriminated activity unions
//
// Non-responsibilities:
// - No authentication or authorization
// - No business rules
// - No pricing calculations
// - No trust/reputation calculations
// - No filtering or sorting
// - No domain/entity mapping
// - No persistence mapping
// - No conversion of public data into private data
//
// The API response must already represent the public read model.
//
// This mapper must never accept:
// - Prisma models
// - Domain entities
// - Aggregates
// - Commands
// - Internal financial/commercial models
// - Private identity or verification records
//
// -----------------------------------------------------------------------------

import type {
  PublicTraveller,
  PublicTravellerActivity,
  PublicTravellerDemand,
  PublicTravellerDiscovery,
  PublicTravellerDiscoveryPagination,
  PublicTravellerDiscoveryResult,
  PublicTravellerJourney,
  PublicTravellerTrust,
  PublicTravellerVehicle,
} from '../models';

// -----------------------------------------------------------------------------
// Input Types
// -----------------------------------------------------------------------------

/**
 * Transport representation of the public discovery response.
 *
 * The transport contract currently matches the frontend public read model.
 *
 * Keeping the transport type explicit provides a dedicated boundary so that
 * the mapper can evolve independently if the HTTP response later diverges
 * from the feature model.
 */
type PublicTravellerDiscoveryResponse =
  PublicTravellerDiscovery;

// -----------------------------------------------------------------------------
// Public Traveller
// -----------------------------------------------------------------------------

/**
 * Maps the public traveller social-identity projection.
 *
 * Traveller identity intentionally contains only publicly discoverable
 * social information.
 *
 * Trust information is not mapped here because Trust is a separate
 * projection owned by PublicTravellerTrust.
 */
function mapPublicTraveller(
  traveller: PublicTraveller,
): PublicTraveller {
  return {
    handle: traveller.handle,
    avatarUrl: traveller.avatarUrl ?? null,
  };
}

// -----------------------------------------------------------------------------
// Public Traveller Trust
// -----------------------------------------------------------------------------

/**
 * Maps the public trust projection.
 *
 * Discovery composes Trust but does not calculate or interpret it.
 *
 * This function must never introduce:
 *
 * - verification evidence
 * - reviewer information
 * - moderation information
 * - fraud/risk information
 * - private rating information
 * - internal trust scores
 */
function mapPublicTravellerTrust(
  trust: PublicTravellerTrust,
): PublicTravellerTrust {
  return {
    verification: {
      verified: trust.verification.verified,
      level: trust.verification.level ?? null,
    },

    rating: {
      score: trust.rating.score ?? null,
      count: trust.rating.count,
    },

    journeyHistory: {
      completedJourneys:
        trust.journeyHistory.completedJourneys,

      cancelledJourneys:
        trust.journeyHistory.cancelledJourneys ?? null,
    },

    badges: trust.badges.map((badge) => ({
      publicId: badge.publicId,
      type: badge.type,
      name: badge.name,
      description: badge.description ?? null,
      assetUrl: badge.assetUrl ?? null,
    })),
  };
}

// -----------------------------------------------------------------------------
// Public Traveller Vehicle
// -----------------------------------------------------------------------------

/**
 * Maps the safe public vehicle projection.
 *
 * Vehicle registration, ownership, insurance, verification evidence, tracking
 * information, and other private vehicle information must never be introduced
 * here.
 */
function mapPublicTravellerVehicle(
  vehicle: PublicTravellerVehicle | null,
): PublicTravellerVehicle | null {
  if (!vehicle) {
    return null;
  }

  return {
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year ?? null,
    color: vehicle.color ?? null,
    imageUrl: vehicle.imageUrl ?? null,
  };
}

// -----------------------------------------------------------------------------
// Public Traveller Journey
// -----------------------------------------------------------------------------

/**
 * Maps the public journey activity projection.
 *
 * Availability and pricing are already server-projected values. The mapper
 * must not recalculate either value.
 */
function mapPublicTravellerJourney(
  journey: PublicTravellerJourney,
): PublicTravellerJourney {
  return {
    publicId: journey.publicId,

    route: {
      origin: journey.route.origin,
      destination: journey.route.destination,
    },

    schedule: {
      departureAt: journey.schedule.departureAt,
      arrivalAt: journey.schedule.arrivalAt ?? null,
      timezone: journey.schedule.timezone,
    },

    vehicle: mapPublicTravellerVehicle(
      journey.vehicle,
    ),

    availability: {
      totalSeats: journey.availability.totalSeats,
      availableSeats: journey.availability.availableSeats,
    },

    pricing: {
      amount: journey.pricing.amount,
      currency: journey.pricing.currency,
    },
  };
}

// -----------------------------------------------------------------------------
// Public Traveller Demand
// -----------------------------------------------------------------------------

/**
 * Maps the public journey-demand activity projection.
 *
 * The public pricing field is `maxAmount`, representing the maximum amount
 * the traveller has publicly indicated for one seat.
 */
function mapPublicTravellerDemand(
  demand: PublicTravellerDemand,
): PublicTravellerDemand {
  return {
    publicId: demand.publicId,

    route: {
      origin: demand.route.origin,
      destination: demand.route.destination,
    },

    schedule: {
      earliestDepartureAt:
        demand.schedule.earliestDepartureAt,

      latestDepartureAt:
        demand.schedule.latestDepartureAt,

      timezone:
        demand.schedule.timezone,

      flexibleDeparture:
        demand.schedule.flexibleDeparture,
    },

    capacity: {
      seatsNeeded:
        demand.capacity.seatsNeeded,
    },

    pricing: {
      maxAmount:
        demand.pricing.maxAmount ?? null,

      currency:
        demand.pricing.currency,
    },
  };
}

// -----------------------------------------------------------------------------
// Public Traveller Activity
// -----------------------------------------------------------------------------

/**
 * Maps an individual public traveller activity.
 *
 * The discriminated union is preserved so consumers can safely narrow on
 * activity.type.
 *
 * The exhaustive check ensures that introducing another activity type requires
 * this mapper to be updated at compile time.
 */
function mapPublicTravellerActivity(
  activity: PublicTravellerActivity,
): PublicTravellerActivity {
  switch (activity.type) {
    case 'JOURNEY':
      return {
        publicId: activity.publicId,
        type: 'JOURNEY',
        isActive: activity.isActive,
        journey: mapPublicTravellerJourney(
          activity.journey,
        ),
      };

    case 'DEMAND':
      return {
        publicId: activity.publicId,
        type: 'DEMAND',
        isActive: activity.isActive,
        demand: mapPublicTravellerDemand(
          activity.demand,
        ),
      };

    default: {
      const exhaustiveCheck: never = activity;
      return exhaustiveCheck;
    }
  }
}

// -----------------------------------------------------------------------------
// Discovery Result
// -----------------------------------------------------------------------------

/**
 * Maps one traveller discovery result.
 *
 * Traveller identity, Trust, and activities remain separate projections while
 * being composed into a single discovery read model.
 */
function mapPublicTravellerDiscoveryResult(
  result: PublicTravellerDiscoveryResult,
): PublicTravellerDiscoveryResult {
  return {
    traveller: mapPublicTraveller(
      result.traveller,
    ),

    trust: mapPublicTravellerTrust(
      result.trust,
    ),

    activities: result.activities.map(
      mapPublicTravellerActivity,
    ),
  };
}

// -----------------------------------------------------------------------------
// Pagination
// -----------------------------------------------------------------------------

/**
 * Maps public discovery pagination.
 *
 * Pagination is server-authoritative and is not inferred from the result
 * collection.
 */
function mapPublicTravellerDiscoveryPagination(
  pagination: PublicTravellerDiscoveryPagination,
): PublicTravellerDiscoveryPagination {
  return {
    nextCursor:
      pagination.nextCursor ?? null,

    hasNextPage:
      pagination.hasNextPage,
  };
}

// -----------------------------------------------------------------------------
// Discovery
// -----------------------------------------------------------------------------

/**
 * Maps the complete public traveller-discovery response.
 *
 * The resulting model contains only the public read-model information required
 * by traveller discovery.
 */
export function mapPublicTravellerDiscovery(
  response: PublicTravellerDiscoveryResponse,
): PublicTravellerDiscovery {
  return {
    results: response.results.map(
      mapPublicTravellerDiscoveryResult,
    ),

    pagination:
      mapPublicTravellerDiscoveryPagination(
        response.pagination,
      ),
  };
}

// -----------------------------------------------------------------------------
// Public Mapper
// -----------------------------------------------------------------------------

export const publicTravellerDiscoveryMapper = {
  map: mapPublicTravellerDiscovery,
};