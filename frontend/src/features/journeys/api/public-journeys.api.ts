// src/features/journeys/api/public-journeys.api.ts

// -----------------------------------------------------------------------------
// sisiMove — Public Journeys API
// -----------------------------------------------------------------------------
//
// Public HTTP operations for Journey discovery.
//
// Backend routes:
//
//   GET /journeys/public
//       Public Journey marketplace collection.
//
//   GET /journeys/:journeyPublicId
//       Public Journey detail.
//
// Public Journey architecture:
//
//   JourneyController
//        ↓
//   GetPublicJourneysQuery
//        ↓
//   GetPublicJourneysQueryHandler
//        ↓
//   PublicJourneyResponse
//        ├── Journey
//        └── provider
//              ├── traveller
//              └── trust
//
// The frontend receives the completed public Journey representation.
//
// IMPORTANT
// ---------
//
// Journey owns Journey creation and Journey state.
//
// Traveller Profile and Trust Profile do NOT own Journey and are not
// independently composed by this API module.
//
// The backend public-read boundary performs that composition.
//
// This module therefore:
//
// - retrieves publicly discoverable Journeys;
// - retrieves one publicly discoverable Journey;
// - passes optional marketplace discovery filters to the backend;
// - translates frontend query state into HTTP query parameters;
// - preserves the backend public Journey representation.
//
// This module does NOT:
//
// - own Journey domain models;
// - compose Traveller Profile or Trust Profile data;
// - implement marketplace business rules;
// - perform authentication;
// - inspect Journey lifecycle/status;
// - determine public visibility;
// - recreate backend public-read rules.
//
// Public visibility belongs to the backend Journey public-read boundary.
//
// The Marketplace feature may consume these operations when composing the
// public marketplace with Journey Demand.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — HTTP
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http/api-client';

// -----------------------------------------------------------------------------
// Journey — Public Models
// -----------------------------------------------------------------------------

import type {
  PublicJourney,
  PublicJourneyQuery,
} from '../models';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

/**
 * Base route for the Journey HTTP controller.
 *
 * The NestJS JourneyController is mounted at:
 *
 *     /journeys
 *
 * Public discovery is exposed beneath that controller:
 *
 *     GET /journeys/public
 *     GET /journeys/:journeyPublicId
 */
const JOURNEYS_PATH = '/journeys';

// =============================================================================
// Public Journey Collection
// =============================================================================

/**
 * Retrieve publicly discoverable Journeys.
 *
 * This is the primary public Journey marketplace collection.
 *
 * An omitted query is intentional and valid:
 *
 *     getPublicJourneys()
 *
 * means:
 *
 *     "Return the currently publicly discoverable Journey inventory."
 *
 * Optional filters narrow the collection:
 *
 *     from
 *     to
 *     date
 *
 * Example:
 *
 *     getPublicJourneys({
 *       from: 'Nairobi',
 *       to: 'Kisumu',
 *       date: '2026-09-18',
 *     })
 *
 * The frontend does not determine public visibility.
 *
 * The backend:
 *
 *     GetPublicJourneysQuery
 *          ↓
 *     GetPublicJourneysQueryHandler
 *          ↓
 *     Journey public-read boundary
 *
 * determines which Journeys are eligible for public discovery.
 *
 * The backend also performs the public provider composition, so the returned
 * PublicJourney already contains:
 *
 *     provider.traveller
 *     provider.trust
 *
 * No additional profile/trust request belongs here.
 */
export async function getPublicJourneys(
  query?: PublicJourneyQuery,
): Promise<readonly PublicJourney[]> {
  return apiClient.get<readonly PublicJourney[]>(
    `${JOURNEYS_PATH}/public`,
    {
      query: {
        from: query?.from,
        to: query?.to,
        date: query?.date,
      },
    },
  );
}

// =============================================================================
// Public Journey Detail
// =============================================================================

/**
 * Retrieve one publicly discoverable Journey by public identifier.
 *
 * Backend route:
 *
 *     GET /journeys/:journeyPublicId
 *
 * The backend deliberately uses the same GetPublicJourneysQuery architecture
 * for both collection and detail:
 *
 *     Collection:
 *
 *         new GetPublicJourneysQuery(
 *           undefined,
 *           from,
 *           to,
 *           date,
 *         )
 *
 *     Detail:
 *
 *         new GetPublicJourneysQuery(journeyPublicId)
 *
 * There is intentionally no separate frontend concept such as:
 *
 *     GetPublicJourneyQuery
 *
 * The API operation is simply the detail form of the same public Journey
 * read boundary.
 *
 * The backend is responsible for determining whether the requested Journey
 * is publicly discoverable.
 *
 * The frontend intentionally does not:
 *
 * - inspect Journey status;
 * - filter lifecycle states;
 * - perform a separate visibility check;
 * - load Traveller Profile independently;
 * - load Trust Profile independently;
 * - reconstruct the provider object;
 * - recreate public-read business rules.
 *
 * `encodeURIComponent` protects the dynamic public ID path segment.
 */
export async function getPublicJourneyByPublicId(
  journeyPublicId: string,
): Promise<PublicJourney | null> {
  return apiClient.get<PublicJourney>(
    `${JOURNEYS_PATH}/${encodeURIComponent(journeyPublicId)}`,
  );
}

