// -----------------------------------------------------------------------------
// sisiMove — useJourneyVehicle
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving the vehicle attached to a Journey.
//
// API boundary:
//     GET /api/v1/journeys/:journeyPublicId/vehicle
//
// This hook is responsible for:
// - Executing the authenticated Journey vehicle API.
// - Managing request state and caching through React Query.
// - Mapping the transport response into JourneyVehicle.
//
// The Journey controller attaches an existing vehicle through its public
// identifier. Vehicle creation and management therefore remain outside this
// Journey hook and outside the frozen Journey controller boundary.
//
// This hook intentionally does NOT:
// - Create or modify vehicle records.
// - Resolve vehicle assets.
// - Format registration or vehicle labels.
// - Infer vehicle details.
// - Perform authorization decisions.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import { getJourneyVehicle } from '../../api/components/vehicle';

import {
  mapJourneyVehicle,
  type JourneyVehicleApiResponse,
} from '../../mappers';

import type { JourneyVehicle } from '../../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

/**
 * Stable query-key namespace for the vehicle attached to a Journey.
 */
export const JOURNEY_VEHICLE_QUERY_KEY = [
  'journeys',
  'vehicle',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Fetches the vehicle currently attached to a Journey.
 *
 * A Journey may exist without a vehicle, so the result can be null.
 */
export function useJourneyVehicle(
  journeyPublicId: string,
) {
  return useQuery<JourneyVehicle | null, Error>({
    queryKey: [
      ...JOURNEY_VEHICLE_QUERY_KEY,
      journeyPublicId,
    ],

    queryFn: async () => {
      const response = await getJourneyVehicle(
        journeyPublicId,
      );

      if (response === null) {
        return null;
      }

      return mapJourneyVehicle(
        response as JourneyVehicleApiResponse,
      );
    },

    enabled: Boolean(journeyPublicId),
  });
}