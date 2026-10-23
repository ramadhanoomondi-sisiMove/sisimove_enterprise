
/**
 * sisiMove — Journey Response Mapper
 *
 * Maps the backend JourneyResponse contract into frontend-friendly data.
 *
 * Responsibilities:
 * - Convert Date values into ISO strings.
 * - Preserve nullable nested objects and lifecycle timestamps.
 * - Preserve backend field names.
 * - Map nested corridor waypoints and journey assets.
 *
 * This mapper does not fetch data, infer missing values, or calculate
 * operational metrics.
 */

import type {
  Journey,
  JourneyAsset,
  JourneyCapacity,
  JourneyCorridor,
  JourneyPreferences,
  JourneyPricing,
  JourneySchedule,
  JourneyVehicle,
  JourneyWaypoint,
} from '../models/journey.model';

// -----------------------------------------------------------------------------
// Backend response primitives
// -----------------------------------------------------------------------------

type BackendDate = Date | string;

interface JourneyWaypointResponse {
  id: string;
  publicId: string;
  type: string;
  sequence: number;
  name: string;
  latitude: number;
  longitude: number;
  pickupAllowed: boolean;
  dropoffAllowed: boolean;
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

interface JourneyCorridorResponse {
  id: string;
  publicId: string;
  originName: string;
  destinationName: string;
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  corridorKey: string | null;
  waypoints: JourneyWaypointResponse[];
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

interface JourneyScheduleResponse {
  id: string;
  publicId: string;
  departureAt: BackendDate;
  arrivalAt: BackendDate | null;
  timezone: string;
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

interface JourneyVehicleResponse {
  id: string;
  publicId: string;
  make: string;
  model: string;
  year: number | null;
  color: string | null;
  registration: string | null;
  assetPublicId: string | null;
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

interface JourneyCapacityResponse {
  id: string;
  publicId: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

interface JourneyPricingResponse {
  id: string;
  publicId: string;
  amount: number;
  currency: string;
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

interface JourneyPreferencesResponse {
  id: string;
  publicId: string;
  smoking: string;
  pets: string;
  luggage: string;
  conversation: string;
  music: string;
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

interface JourneyAssetResponse {
  id: string;
  publicId: string;
  assetPublicId: string;
  type: string;
  sortOrder: number;
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

/**
 * Mirrors the supplied backend JourneyResponse.
 *
 * Nested aggregate components may be null when they are not present.
 */
export interface JourneyBackendResponse {
  id: string;
  publicId: string;
  providerPublicId: string;
  status: string;

  publishedAt: BackendDate | null;
  startedAt: BackendDate | null;
  completionRequestedAt: BackendDate | null;
  completedAt: BackendDate | null;
  cancelledAt: BackendDate | null;
  expiredAt: BackendDate | null;

  version: number;

  corridor: JourneyCorridorResponse | null;
  schedule: JourneyScheduleResponse | null;
  vehicle: JourneyVehicleResponse | null;
  capacity: JourneyCapacityResponse | null;
  pricing: JourneyPricingResponse | null;
  preferences: JourneyPreferencesResponse | null;
  assets: JourneyAssetResponse[];

  createdAt: BackendDate;
  updatedAt: BackendDate;
}

// -----------------------------------------------------------------------------
// Frontend mapped response
// -----------------------------------------------------------------------------

/**
 * Preserve the backend's permission fields while also exposing the frontend
 * model's isPickup/isDropoff fields.
 *
 * pickupAllowed/dropoffAllowed describe whether pickup/drop-off is permitted.
 * isPickup/isDropoff are mapped from those same backend values to satisfy
 * the existing JourneyWaypoint model contract.
 */
type MappedWaypoint = JourneyWaypoint & {
  pickupAllowed: boolean;
  dropoffAllowed: boolean;
};

type MappedCorridor = Omit<JourneyCorridor, 'waypoints'> & {
  waypoints: MappedWaypoint[];
};

export type MappedJourney = Omit<
  Journey,
  | 'publishedAt'
  | 'startedAt'
  | 'completionRequestedAt'
  | 'completedAt'
  | 'cancelledAt'
  | 'expiredAt'
  | 'createdAt'
  | 'updatedAt'
  | 'corridor'
  | 'schedule'
  | 'vehicle'
  | 'capacity'
  | 'pricing'
  | 'preferences'
  | 'assets'
> & {
  publishedAt: string | null;
  startedAt: string | null;
  completionRequestedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;

  corridor: MappedCorridor | null;
  schedule: JourneySchedule | null;
  vehicle: JourneyVehicle | null;
  capacity: JourneyCapacity | null;
  pricing: JourneyPricing | null;
  preferences: JourneyPreferences | null;
  assets: JourneyAsset[];
};

// -----------------------------------------------------------------------------
// Date conversion
// -----------------------------------------------------------------------------

function mapDate(value: BackendDate): string {
  return value instanceof Date ? value.toISOString() : value;
}

function mapNullableDate(
  value: BackendDate | null,
): string | null {
  return value === null ? null : mapDate(value);
}

// -----------------------------------------------------------------------------
// Nested component mappers
// -----------------------------------------------------------------------------

function mapWaypoint(
  waypoint: JourneyWaypointResponse,
): MappedWaypoint {
  return {
    id: waypoint.id,
    publicId: waypoint.publicId,
    type: waypoint.type,
    sequence: waypoint.sequence,
    name: waypoint.name,
    latitude: waypoint.latitude,
    longitude: waypoint.longitude,

    // Preserve the original backend response fields.
    pickupAllowed: waypoint.pickupAllowed,
    dropoffAllowed: waypoint.dropoffAllowed,

    // Provide the fields required by JourneyWaypoint.
    isPickup: waypoint.pickupAllowed,
    isDropoff: waypoint.dropoffAllowed,

    createdAt: mapDate(waypoint.createdAt),
    updatedAt: mapDate(waypoint.updatedAt),
  };
}

function mapCorridor(
  corridor: JourneyCorridorResponse,
): MappedCorridor {
  return {
    id: corridor.id,
    publicId: corridor.publicId,
    originName: corridor.originName,
    destinationName: corridor.destinationName,
    originLatitude: corridor.originLatitude,
    originLongitude: corridor.originLongitude,
    destinationLatitude: corridor.destinationLatitude,
    destinationLongitude: corridor.destinationLongitude,
    corridorKey: corridor.corridorKey,
    waypoints: corridor.waypoints.map(mapWaypoint),
    createdAt: mapDate(corridor.createdAt),
    updatedAt: mapDate(corridor.updatedAt),
  };
}

function mapSchedule(
  schedule: JourneyScheduleResponse,
): JourneySchedule {
  return {
    id: schedule.id,
    publicId: schedule.publicId,
    departureAt: mapDate(schedule.departureAt),
    arrivalAt: mapNullableDate(schedule.arrivalAt),
    timezone: schedule.timezone,
    createdAt: mapDate(schedule.createdAt),
    updatedAt: mapDate(schedule.updatedAt),
  };
}

function mapVehicle(
  vehicle: JourneyVehicleResponse,
): JourneyVehicle {
  return {
    id: vehicle.id,
    publicId: vehicle.publicId,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    registration: vehicle.registration,
    assetPublicId: vehicle.assetPublicId,
    createdAt: mapDate(vehicle.createdAt),
    updatedAt: mapDate(vehicle.updatedAt),
  };
}

function mapCapacity(
  capacity: JourneyCapacityResponse,
): JourneyCapacity {
  return {
    id: capacity.id,
    publicId: capacity.publicId,
    totalSeats: capacity.totalSeats,
    bookedSeats: capacity.bookedSeats,
    availableSeats: capacity.availableSeats,
    createdAt: mapDate(capacity.createdAt),
    updatedAt: mapDate(capacity.updatedAt),
  };
}

function mapPricing(
  pricing: JourneyPricingResponse,
): JourneyPricing {
  return {
    id: pricing.id,
    publicId: pricing.publicId,
    amount: pricing.amount,
    currency: pricing.currency,
    createdAt: mapDate(pricing.createdAt),
    updatedAt: mapDate(pricing.updatedAt),
  };
}

function mapPreferences(
  preferences: JourneyPreferencesResponse,
): JourneyPreferences {
  return {
    id: preferences.id,
    publicId: preferences.publicId,
    smoking: preferences.smoking,
    pets: preferences.pets,
    luggage: preferences.luggage,
    conversation: preferences.conversation,
    music: preferences.music,
    createdAt: mapDate(preferences.createdAt),
    updatedAt: mapDate(preferences.updatedAt),
  };
}

function mapAsset(asset: JourneyAssetResponse): JourneyAsset {
  return {
    id: asset.id,
    publicId: asset.publicId,
    assetPublicId: asset.assetPublicId,
    type: asset.type,
    sortOrder: asset.sortOrder,
    createdAt: mapDate(asset.createdAt),
    updatedAt: mapDate(asset.updatedAt),
  };
}

// -----------------------------------------------------------------------------
// Journey mapper
// -----------------------------------------------------------------------------

export class JourneyResponseMapper {
  static toModel(response: JourneyBackendResponse): MappedJourney {
    return {
      id: response.id,
      publicId: response.publicId,
      providerPublicId: response.providerPublicId,
      status: response.status as Journey['status'],

      publishedAt: mapNullableDate(response.publishedAt),
      startedAt: mapNullableDate(response.startedAt),
      completionRequestedAt: mapNullableDate(
        response.completionRequestedAt,
      ),
      completedAt: mapNullableDate(response.completedAt),
      cancelledAt: mapNullableDate(response.cancelledAt),
      expiredAt: mapNullableDate(response.expiredAt),

      version: response.version,

      corridor: response.corridor
        ? mapCorridor(response.corridor)
        : null,

      schedule: response.schedule
        ? mapSchedule(response.schedule)
        : null,

      vehicle: response.vehicle
        ? mapVehicle(response.vehicle)
        : null,

      capacity: response.capacity
        ? mapCapacity(response.capacity)
        : null,

      pricing: response.pricing
        ? mapPricing(response.pricing)
        : null,

      preferences: response.preferences
        ? mapPreferences(response.preferences)
        : null,

      assets: response.assets.map(mapAsset),

      createdAt: mapDate(response.createdAt),
      updatedAt: mapDate(response.updatedAt),
    };
  }

  static toModels(
    responses: readonly JourneyBackendResponse[],
  ): MappedJourney[] {
    return responses.map((response) => this.toModel(response));
  }
}

// -----------------------------------------------------------------------------
// Convenience exports
// -----------------------------------------------------------------------------

export const mapJourneyResponse = (
  response: JourneyBackendResponse,
): MappedJourney => JourneyResponseMapper.toModel(response);

export const mapJourneyResponses = (
  responses: readonly JourneyBackendResponse[],
): MappedJourney[] => JourneyResponseMapper.toModels(responses);

export default JourneyResponseMapper;
