// -----------------------------------------------------------------------------
// sisiMove — My Journeys API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operations for Journeys belonging to the currently
// authenticated traveller.
//
// Backend route:
//
//   GET /journeys/me
//
// Authenticated Journey architecture:
//
//   Authenticated session
//        ↓
//   AuthenticatedIdentity
//        ↓
//   JourneyController
//        ↓
//   GetJourneysByProviderQuery
//        ↓
//   JourneyRepository
//        ↓
//   MyJourneyMapper
//        ↓
//   MyJourneyResponse[]
//        ↓
//   MyJourney[]
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API is intentionally separate from:
//
//   public-journeys.api.ts
//
// Public Journey discovery answers:
//
//   "Which Journeys are publicly discoverable?"
//
// This API answers:
//
//   "Which Journeys belong to me?"
//
// The current identity is determined by the backend from the authenticated
// access token.
//
// The frontend MUST NOT provide a providerPublicId for this operation.
//
// Therefore this module does NOT:
//
// - accept or construct a providerPublicId;
// - determine the current identity;
// - inspect Journey ownership;
// - determine authorization;
// - perform public visibility checks;
// - recreate Journey domain rules;
// - load Traveller Profile or Trust Profile independently.
//
// Authentication, authorization, ownership, and lifecycle rules belong to
// the backend.
//
// Authentication rule:
//
//   Public Journey reads
//        → apiClient
//
//   Authenticated "my Journeys" reads
//        → authenticatedApiClient
//
// The authenticated API client obtains the current AuthSession and injects:
//
//   Authorization: Bearer <accessToken>
//
// into the request.
//
// Empty collection rule:
//
//   []
//
// is a successful response and means that the authenticated traveller has
// no Journeys.
//
// It is NOT an API error and must not be converted into an exception here.
// The presentation layer is responsible for displaying the appropriate
// empty state.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Journey — Models
// -----------------------------------------------------------------------------

import type { MyJourney } from '../models';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

/**
 * Base route for the Journey HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('journeys')
 *
 * The authenticated current-identity collection is exposed as:
 *
 *     GET /journeys/me
 */
const JOURNEYS_PATH = '/journeys';

// =============================================================================
// My Journeys
// =============================================================================

/**
 * Retrieve Journeys belonging to the currently authenticated identity.
 *
 * Backend route:
 *
 *     GET /journeys/me
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * The authenticated API client obtains the access token from the
 * Authentication feature's current AuthSession.
 *
 * The backend derives the provider identity from the authenticated request:
 *
 *     access token
 *          ↓
 *     JwtAuthGuard
 *          ↓
 *     AuthenticatedIdentity
 *          ↓
 *     identityPublicId
 *          ↓
 *     GetJourneysByProviderQuery
 *          ↓
 *     MyJourneyMapper
 *          ↓
 *     MyJourneyResponse[]
 *
 * The frontend therefore does not send a provider identifier.
 *
 * This prevents the client from selecting another traveller's Journeys by
 * manipulating a provider identifier.
 *
 * The response is the authenticated My Journey projection rather than the
 * public Journey projection.
 *
 * MyJourney may therefore contain:
 *
 * - draft Journeys;
 * - incomplete Journeys;
 * - lifecycle timestamps;
 * - nullable Journey components;
 * - management-oriented Journey state.
 *
 * The backend remains the source of truth for:
 *
 * - authentication;
 * - authorization;
 * - ownership;
 * - lifecycle state;
 * - domain rules.
 *
 * Empty collection:
 *
 *     []
 *
 * is a valid successful response and means that the authenticated traveller
 * currently has no Journeys.
 */
export async function getMyJourneys(): Promise<readonly MyJourney[]> {
  return authenticatedApiClient.get<readonly MyJourney[]>(
    `${JOURNEYS_PATH}/me`,
  );
}