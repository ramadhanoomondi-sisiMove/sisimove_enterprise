// src/features/journeys/mappers/map-public-journey.ts

// -----------------------------------------------------------------------------
// sisiMove — Public Journey Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend public Journey HTTP representation into the frontend
// PublicJourney model.
//
// Architectural boundary
// ----------------------
//
// The backend public Journey endpoint returns an already-composed public
// Journey read model:
//
//   Journey
//     ├── provider
//     │     ├── traveller
//     │     └── trust
//     ├── route
//     ├── schedule
//     ├── vehicle
//     ├── capacity
//     ├── pricing
//     ├── preferences
//     └── assets
//
// Journey remains the primary domain object. Traveller and Trust do not own
// the Journey and are not reconstructed here.
//
// This mapper only translates the external HTTP representation into the
// frontend model consumed by the Journey feature.
//
// Responsibilities:
// - define the API/frontend boundary;
// - preserve the public Journey provider composition;
// - normalize API values into the frontend model;
// - prevent API response details from leaking into UI components.
//
// This mapper does NOT:
// - fetch Traveller Profile data;
// - fetch Trust data;
// - fetch Assets;
// - compose Journey Demand;
// - perform marketplace composition;
// - reconstruct a provider from separate objects;
// - apply business rules.
//
// The backend public read boundary is responsible for composing the public
// Journey response. The frontend mapper must not duplicate that composition.
//
// -----------------------------------------------------------------------------

import type { PublicJourney } from '../models';

// -----------------------------------------------------------------------------
// API Representation
// -----------------------------------------------------------------------------

/**
 * Public Journey HTTP response.
 *
 * Keep the API representation local to this mapper. This creates an explicit
 * translation boundary between the backend contract and the frontend model.
 *
 * The backend controller currently flattens the Journey entity into the
 * public HTTP response while retaining the composed provider:
 *
 * {
 *   publicId,
 *   provider: {
 *     traveller,
 *     trust,
 *   },
 *   route,
 *   schedule,
 *   vehicle,
 *   capacity,
 *   pricing,
 *   preferences,
 *   assets,
 * }
 *
 * We intentionally describe the API shape structurally instead of aliasing
 * it to PublicJourney. An alias would make the mapper a no-op and would
 * remove the value of having this boundary.
 */
interface PublicJourneyApiResponse {
  readonly publicId: string;

  readonly provider: {
    readonly traveller: PublicJourney['provider']['traveller'];
    readonly trust: PublicJourney['provider']['trust'];
  };

  readonly route: PublicJourney['route'];
  readonly schedule: PublicJourney['schedule'];
  readonly vehicle: PublicJourney['vehicle'];
  readonly capacity: PublicJourney['capacity'];
  readonly pricing: PublicJourney['pricing'];
  readonly preferences: PublicJourney['preferences'];
  readonly assets: PublicJourney['assets'];
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps one public Journey API response into the frontend PublicJourney model.
 *
 * The provider composition is preserved exactly as supplied by the backend:
 *
 *   response.provider.traveller
 *   response.provider.trust
 *
 * This is important because Journey owns the provider reference at the domain
 * level, while the public marketplace read boundary enriches that reference
 * with public Traveller and Trust information.
 */
export function mapPublicJourney(
  response: PublicJourneyApiResponse,
): PublicJourney {
  return {
    publicId: response.publicId,

    provider: {
      traveller: response.provider.traveller,
      trust: response.provider.trust,
    },

    route: response.route,
    schedule: response.schedule,
    vehicle: response.vehicle,
    capacity: response.capacity,
    pricing: response.pricing,
    preferences: response.preferences,
    assets: response.assets,
  };
}
