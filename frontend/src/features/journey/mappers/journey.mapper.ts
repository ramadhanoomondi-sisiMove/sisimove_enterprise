// -----------------------------------------------------------------------------
// sisiMove — Journey Mapper
// -----------------------------------------------------------------------------
//
// Maps the transport/API representation of a Journey into the frontend
// Journey model.
//
// Architectural responsibility:
// - Normalize the Journey API response.
// - Compose already-returned Journey component data.
// - Delegate component normalization to the component mappers.
// - Preserve opaque public identifiers.
// - Keep API transport details outside UI components.
//
// This mapper intentionally does NOT:
// - Fetch Traveller Profile or Trust Profile data.
// - Resolve providerPublicId into a traveller.
// - Perform additional API requests.
// - Derive marketplace/public presentation models.
// - Format dates, currency, labels, or status text.
// - Apply lifecycle transitions.
// - Infer missing Journey components.
//
// The authenticated Journey model may contain providerPublicId because the
// authenticated management API can expose the provider reference.
//
// Public marketplace responses MUST use a separate public mapper/model so
// providerPublicId is never accidentally exposed through the public
// presentation boundary.
// -----------------------------------------------------------------------------

import type {
  Journey,
  JourneyStatus,
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
// API Response
// -----------------------------------------------------------------------------

/**
 * Transport representation of a Journey returned by the authenticated
 * Journey management endpoints.
 */
export interface JourneyApiResponse {
  publicId: string;
  providerPublicId: string;

  status: JourneyStatus;

  publishedAt?: string | null;
  startedAt?: string | null;
  completionRequestedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  expiredAt?: string | null;

  version?: number;

  corridor?: JourneyCorridorApiResponse | null;
  schedule?: JourneyScheduleApiResponse | null;
  vehicle?: JourneyVehicleApiResponse | null;
  capacity?: JourneyCapacityApiResponse | null;
  pricing?: JourneyPricingApiResponse | null;
  preferences?: JourneyPreferencesApiResponse | null;

  assets?: JourneyAssetApiResponse[];

  createdAt?: string;
  updatedAt?: string;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps a Journey API response into the authenticated frontend Journey model.
 *
 * Component mappings are delegated to their dedicated mappers rather than
 * duplicating normalization logic here.
 */
export function mapJourney(journey: JourneyApiResponse): Journey {
  return {
    publicId: journey.publicId,
    providerPublicId: journey.providerPublicId,

    status: journey.status,

    publishedAt: journey.publishedAt,
    startedAt: journey.startedAt,
    completionRequestedAt: journey.completionRequestedAt,
    completedAt: journey.completedAt,
    cancelledAt: journey.cancelledAt,
    expiredAt: journey.expiredAt,

    version: journey.version,

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

    createdAt: journey.createdAt,
    updatedAt: journey.updatedAt,
  };
}