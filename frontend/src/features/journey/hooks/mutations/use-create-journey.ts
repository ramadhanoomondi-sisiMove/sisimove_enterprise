// -----------------------------------------------------------------------------
// sisiMove — useCreateJourney
// -----------------------------------------------------------------------------
//
// React Query mutation hook for creating a Journey.
//
// API boundary:
//     POST /api/v1/journeys
//
// IMPORTANT:
// The frozen Journey controller accepts NO request body for Journey creation.
//
// The authenticated identity is obtained by the backend from the JWT:
//
//     CurrentIdentity
//          │
//          ▼
//     identity.identityPublicId
//          │
//          ▼
//     CreateJourneyCommand
//
// Therefore the frontend MUST NOT submit:
// - providerPublicId
// - identityPublicId
// - Journey component data
// - lifecycle state
//
// Journey creation establishes the Journey aggregate. Corridor, schedule,
// vehicle, capacity, pricing, preferences, and assets are attached through
// their dedicated controller endpoints afterward.
//
// This hook is responsible for:
// - Executing the Journey creation API.
// - Managing mutation state through React Query.
// - Mapping the returned Journey aggregate into the frontend Journey model.
// - Invalidating the authenticated My Journeys collection after creation.
//
// This hook intentionally does NOT:
// - Build a request body.
// - Accept provider identity from the caller.
// - Create Journey components.
// - Publish the Journey.
// - Perform authorization checks.
// - Navigate to a UI route.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createJourney } from '../../api/lifecycle';

import {
  mapJourney,
  type JourneyApiResponse,
} from '../../mappers';

import type { Journey } from '../../models';

import {
  MY_JOURNEYS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Creates a new Journey for the currently authenticated identity.
 *
 * No variables are required because the backend derives the provider identity
 * from the authenticated JWT and generates the command's public identifier
 * server-side/application-side according to the frozen controller contract.
 */
export function useCreateJourney() {
  const queryClient = useQueryClient();

  return useMutation<Journey, Error, void>({
    mutationFn: async () => {
      const response = await createJourney();

      return mapJourney(
        response as JourneyApiResponse,
      );
    },

    onSuccess: async () => {
      /**
       * The newly created Journey belongs to the authenticated user's
       * management collection, so invalidate `/journeys/me`.
       *
       * We intentionally do not manually insert the returned Journey into the
       * cache. The backend remains authoritative for the collection response.
       */
      await queryClient.invalidateQueries({
        queryKey: MY_JOURNEYS_QUERY_KEY,
      });
    },
  });
}