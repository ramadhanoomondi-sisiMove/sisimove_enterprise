// -----------------------------------------------------------------------------
// sisiMove — Public Journey Mapper
// -----------------------------------------------------------------------------
//
// Maps the public Journey discovery response into a frontend-safe public
// Journey representation.
//
// Architectural boundary:
//
//     Journey API
//          │
//          ▼
//     Public Journey Mapper
//          │
//          ▼
//     Public marketplace presentation
//
// The public Journey API is intentionally different from the authenticated
// Journey management representation.
//
// In particular:
// - `providerPublicId` is NOT exposed by the public frontend model.
// - Provider information is supplied by the backend's public marketplace
//   composition.
// - Journey component data remains represented through the existing Journey
//   component models.
// - No authenticated-only lifecycle/provider fields are introduced.
//
// This mapper intentionally does NOT:
// - Resolve provider identity through another API call.
// - Fetch Traveller Profile or Trust Profile.
// - Expose providerPublicId.
// - Join Prisma/domain objects.
// - Format dates, prices, or status labels.
// - Infer missing provider information.
// - Make additional API requests.
//
// Public marketplace composition belongs to the backend
// `GetPublicJourneysQueryHandler`. The frontend only normalizes the response.
// -----------------------------------------------------------------------------

import type {
  JourneyAsset,
  JourneyCapacity,
  JourneyCorridor,
  JourneyPreferences,
  JourneyPricing,
  JourneySchedule,
  JourneyStatus,
  JourneyVehicle,
} from '../models';

import {
  mapJourneyAsset,
  type JourneyAssetApiResponse,
} from './journey-asset.mapper';

import {
  mapJourneyCapacity,
  type JourneyCapacityApiResponse,
} from './journey-capacity.mapper';

import {
  mapJourneyCorridor,
  type JourneyCorridorApiResponse,
} from './journey-corridor.mapper';

import {
  mapJourneyPreferences,
  type JourneyPreferencesApiResponse,
} from './journey-preferences.mapper';

import {
  mapJourneyPricing,
  type JourneyPricingApiResponse,
} from './journey-pricing.mapper';

import {
  mapJourneySchedule,
  type JourneyScheduleApiResponse,
} from './journey-schedule.mapper';

import {
  mapJourneyVehicle,
  type JourneyVehicleApiResponse,
} from './journey-vehicle.mapper';

// -----------------------------------------------------------------------------
// Public Provider
// -----------------------------------------------------------------------------

/**
 * Public provider composition returned by the backend marketplace boundary.
 *
 * The exact Traveller/Trust structures are owned by their respective domains.
 * The Journey feature therefore treats this object as an already-composed
 * public representation rather than attempting to reconstruct it locally.
 */
export interface PublicJourneyProviderApiResponse {
  traveller: Record<string, unknown>;
  trust: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// API Response
// -----------------------------------------------------------------------------

/**
 * Transport representation returned by the public Journey endpoints.
 *
 * `providerPublicId` is deliberately absent.
 *
 * The backend public query handler composes the provider's public Traveller
 * and Trust information before returning the marketplace representation.
 */
export interface PublicJourneyApiResponse {
  publicId: string;

  status: JourneyStatus;

  provider?: PublicJourneyProviderApiResponse | null;

  corridor?: JourneyCorridorApiResponse | null;
  schedule?: JourneyScheduleApiResponse | null;
  vehicle?: JourneyVehicleApiResponse | null;
  capacity?: JourneyCapacityApiResponse | null;
  pricing?: JourneyPricingApiResponse | null;
  preferences?: JourneyPreferencesApiResponse | null;

  assets?: JourneyAssetApiResponse[];

  publishedAt?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

// -----------------------------------------------------------------------------
// Public Journey Model
// -----------------------------------------------------------------------------

/**
 * Frontend-safe public Journey representation.
 *
 * This is intentionally separate from the authenticated `Journey` model.
 *
 * A public marketplace consumer must not receive the authenticated Journey
 * provider reference simply because the same Journey aggregate is being
 * represented in another context.
 */
export interface PublicJourney {
  publicId: string;

  status: JourneyStatus;

  provider?: PublicJourneyProviderApiResponse | null;

  corridor?: JourneyCorridor | null;
  schedule?: JourneySchedule | null;
  vehicle?: JourneyVehicle | null;
  capacity?: JourneyCapacity | null;
  pricing?: JourneyPricing | null;
  preferences?: JourneyPreferences | null;

  assets: JourneyAsset[];

  publishedAt?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps a public Journey API response into the frontend public Journey model.
 *
 * The mapper preserves the backend's public composition boundary and does not
 * attempt to enrich the response from authenticated endpoints.
 */
export function mapPublicJourney(
  journey: PublicJourneyApiResponse,
): PublicJourney {
  return {
    publicId: journey.publicId,

    status: journey.status,

    provider: journey.provider ?? null,

    corridor: journey.corridor
      ? mapJourneyCorridor(journey.corridor)
      : null,

    schedule: journey.schedule
      ? mapJourneySchedule(journey.schedule)
      : null,

    vehicle: journey.vehicle
      ? mapJourneyVehicle(journey.vehicle)
      : null,

    capacity: journey.capacity
      ? mapJourneyCapacity(journey.capacity)
      : null,

    pricing: journey.pricing
      ? mapJourneyPricing(journey.pricing)
      : null,

    preferences: journey.preferences
      ? mapJourneyPreferences(journey.preferences)
      : null,

    assets: (journey.assets ?? []).map(mapJourneyAsset),

    publishedAt: journey.publishedAt,

    createdAt: journey.createdAt,
    updatedAt: journey.updatedAt,
  };
}

/**
 * Maps a public Journey collection.
 */
export function mapPublicJourneys(
  journeys: PublicJourneyApiResponse[],
): PublicJourney[] {
  return journeys.map(mapPublicJourney);
}