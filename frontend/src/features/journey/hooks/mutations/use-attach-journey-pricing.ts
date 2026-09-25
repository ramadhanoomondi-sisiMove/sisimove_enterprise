// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneyPricing
// -----------------------------------------------------------------------------
//
// React Query mutation hook for configuring and attaching Pricing to a
// Journey.
//
// API boundary:
//     POST /api/v1/journeys/:journeyPublicId/pricing
//
// Request body:
//     {
//       amount: number;
//       currency: string;
//     }
//
// IMPORTANT:
//
// Journey Pricing is Journey-owned configuration.
//
// The frontend does NOT create a standalone Pricing resource before this
// mutation. The backend application handler:
//
//   1. Resolves the Journey aggregate.
//   2. Creates the JourneyPricing entity from the supplied configuration.
//   3. Attaches the pricing to the Journey aggregate.
//   4. Persists the Journey aggregate.
//
// Therefore this hook accepts the pricing configuration itself.
//
// The backend remains authoritative for:
// - monetary validation;
// - currency validation;
// - Journey pricing invariants;
// - Journey lifecycle rules;
// - authorization;
// - aggregate persistence.
//
// Monetary/business rules such as commission calculation remain outside this
// hook. The frontend only submits the Journey's configured price and currency.
//
// This hook is responsible for:
// - Executing the Pricing configuration API.
// - Managing mutation state through React Query.
// - Invalidating affected Journey Pricing queries.
// - Invalidating authenticated Journey collections.
//
// This hook intentionally does NOT:
// - Create domain entities.
// - Generate pricing public identifiers.
// - Calculate commission.
// - Calculate provider income.
// - Convert currencies.
// - Format monetary values.
// - Validate Journey lifecycle rules.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------
//
// Architectural flow:
//
//   JourneyPricingStep
//          │
//          ▼
//   useAttachJourneyPricing()
//          │
//          ▼
//   attachJourneyPricing()
//          │
//          ▼
//   Journey HTTP Controller
//          │
//          ▼
//   AttachPricingCommand
//          │
//          ▼
//   Journey Aggregate
//          │
//          ▼
//        save()
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { attachJourneyPricing } from '../../api/components/pricing';

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
 * Variables accepted by the Pricing configuration mutation.
 *
 * `journeyPublicId` identifies the Journey being modified.
 *
 * The remaining fields represent the pricing configuration that the backend
 * will create and attach to the Journey aggregate.
 */
export interface AttachJourneyPricingVariables {
  /**
   * Public identifier of the Journey being modified.
   */
  journeyPublicId: string;

  /**
   * Journey price amount.
   *
   * The value is forwarded to the backend without frontend-side commission
   * calculation or monetary transformation.
   */
  amount: number;

  /**
   * ISO-style currency code used for the Journey price.
   */
  currency: string;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Configures and attaches Pricing to a Journey.
 *
 * The backend creates the JourneyPricing entity, attaches it to the
 * Journey aggregate, and persists the aggregate.
 */
export function useAttachJourneyPricing() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    AttachJourneyPricingVariables
  >({
    mutationFn: async ({
      journeyPublicId,
      amount,
      currency,
    }) => {
      await attachJourneyPricing(journeyPublicId, {
        amount,
        currency,
      });
    },

    onSuccess: async () => {
      /**
       * Configuring Pricing changes the Journey's composed representation.
       *
       * `JOURNEY_PRICING_QUERY_KEY` is intentionally a static namespace:
       *
       *     ['journeys', 'pricing']
       *
       * It is therefore passed directly to React Query rather than invoked
       * as a function.
       *
       * React Query will invalidate queries whose keys begin with this
       * namespace, including Journey-specific pricing queries such as:
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