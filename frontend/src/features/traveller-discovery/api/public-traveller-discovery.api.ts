// -----------------------------------------------------------------------------
// Public Traveller Discovery API
// -----------------------------------------------------------------------------
//
// Public read API for discovering travellers, journeys, and journey demands.
//
// Endpoint:
//
//   GET /public/traveller-discovery
//
// Authentication is intentionally not required.
//
// Public discovery exposes decision-support information only. Private actions
// and sensitive information remain protected by authentication and
// authorization.
//
// HTTP transport, error handling, timeout handling, response unwrapping,
// correlation IDs, and authentication are delegated to the foundation
// ApiClient.
//
// Response normalization is delegated to the traveller-discovery mapper.
//
// -----------------------------------------------------------------------------

import { apiClient } from '../../../foundation/http/api-client';

import type {
  PublicTravellerDiscovery,
  PublicTravellerDiscoveryQuery,
} from '../models';

import {
  publicTravellerDiscoveryMapper,
} from '../mappers';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const PUBLIC_TRAVELLER_DISCOVERY_PATH =
  '/public/traveller-discovery';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Retrieves publicly discoverable travellers and their public activities.
 *
 * Supported filters:
 *
 * - from
 * - to
 * - date
 * - type
 *
 * Authentication is not required.
 *
 * The backend remains responsible for:
 *
 * - public visibility rules
 * - lifecycle filtering
 * - safe location exposure
 * - trust/read-model composition
 * - journey eligibility
 * - demand eligibility
 * - pagination
 *
 * The frontend does not calculate or infer any of these rules.
 */
export async function discoverPublicTravellers(
  query?: PublicTravellerDiscoveryQuery,
): Promise<PublicTravellerDiscovery> {
  const response =
    await apiClient.get<PublicTravellerDiscovery>(
      PUBLIC_TRAVELLER_DISCOVERY_PATH,
      {
        query: {
          from: query?.from,
          to: query?.to,
          date: query?.date,
          type: query?.type,
        },
      },
    );

  return publicTravellerDiscoveryMapper.map(response);
}

// -----------------------------------------------------------------------------
// API Object
// -----------------------------------------------------------------------------

/**
 * Public Traveller Discovery API.
 *
 * Feature consumers should depend on this API rather than importing the
 * foundation ApiClient directly.
 */
export const publicTravellerDiscoveryApi = {
  discover: discoverPublicTravellers,
};