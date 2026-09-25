// -----------------------------------------------------------------------------
// sisiMove — useRemoveJourneyPricing
// -----------------------------------------------------------------------------
//
// React Query mutation hook for removing the attached Pricing from a Journey.
//
// API boundary:
//     DELETE /api/v1/journeys/:journeyPublicId/pricing
//
// Request body:
//     None
//
// IMPORTANT:
//
// The frozen Journey controller removes the Journey-side Pricing attachment.
// It does NOT delete the underlying Pricing resource.
//
// Therefore this hook:
// - Identifies the Journey using its public identifier.
// - Sends no request body.
// - Delegates the removal operation to the backend.
//
// The backend remains authoritative for whether the Pricing can be removed.
//
// This hook is responsible for:
// - Executing the Pricing removal API.
// - Managing mutation state through React Query.
// - Invalidating affected Journey Pricing queries.
// - Invalidating authenticated Journey collections.
//
// This hook intentionally does NOT:
// - Delete the Pricing resource itself.
// - Modify the monetary amount.
// - Convert or format currency.
// - Validate Journey lifecycle rules.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeJourneyPricing } from '../../api/components/pricing';

import {
  JOURNEY_PRICING_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Pricing removal mutation.
 *
 * `journeyPublicId` identifies the Journey whose Pricing attachment should
 * be removed.
 */
export interface RemoveJourneyPricingVariables {
  journeyPublicId: string;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Removes the attached Pricing from a Journey.
 */
export function useRemoveJourneyPricing() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    RemoveJourneyPricingVariables
  >({
    mutationFn: async ({
      journeyPublicId,
    }) => {
      return removeJourneyPricing(
        journeyPublicId,
      );
    },

    onSuccess: async () => {
      /**
       * `JOURNEY_PRICING_QUERY_KEY` is a static query-key namespace:
       *
       *     ['journeys', 'pricing']
       *
       * It is intentionally passed directly to React Query rather than
       * invoked as a function.
       *
       * This invalidates Journey-specific Pricing queries such as:
       *
       *     ['journeys', 'pricing', journeyPublicId]
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: JOURNEY_PRICING_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: MY_JOURNEYS_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
        }),
      ]);
    },
  });
}