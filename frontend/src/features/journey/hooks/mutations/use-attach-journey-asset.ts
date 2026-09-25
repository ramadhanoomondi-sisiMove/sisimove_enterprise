// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneyAsset
// -----------------------------------------------------------------------------
//
// React Query mutation hook for attaching an existing Asset to a Journey.
//
// API boundary:
//     POST /api/v1/journeys/:journeyPublicId/assets
//
// Request body:
//     {
//       assetPublicId: string;
//       type: JourneyAssetType;
//       sortOrder: number;
//     }
//
// IMPORTANT:
//
// An Asset is owned by the Assets domain and therefore already exists before
// this mutation is executed.
//
// The Journey application handler creates the Journey-side asset attachment:
//
//   1. Resolve the Journey aggregate.
//   2. Create the JourneyAsset attachment from the Asset reference and
//      Journey-specific configuration.
//   3. Attach it to the Journey aggregate.
//   4. Persist the aggregate.
//
// Therefore this hook accepts:
//
// - assetPublicId — reference to the existing external Asset;
// - type — how the Asset is used by the Journey;
// - sortOrder — its position within the Journey's assets.
//
// This hook is responsible for:
// - Executing the Journey Asset attachment API.
// - Managing mutation state through React Query.
// - Invalidating affected Journey Asset queries.
// - Invalidating authenticated Journey collections.
//
// This hook intentionally does NOT:
// - Upload an Asset.
// - Create an Asset.
// - Modify Asset metadata.
// - Generate Asset identifiers.
// - Validate Asset ownership.
// - Validate Journey lifecycle rules.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------
//
// Architectural flow:
//
//   Asset Selection / Photos Form
//             │
//             ▼
//   useAttachJourneyAsset()
//             │
//             ▼
//   attachJourneyAsset()
//             │
//             ▼
//   Journey HTTP Controller
//             │
//             ▼
//   AttachJourneyAssetCommand
//             │
//             ▼
//   Journey Aggregate
//             │
//             ▼
//          save()
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { attachJourneyAsset } from '../../api/components/assets';

import type { JourneyAssetType } from '../../models';

import {
  JOURNEY_ASSETS_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Asset attachment mutation.
 *
 * `assetPublicId` references an existing Asset owned by the Assets domain.
 *
 * `type` and `sortOrder` configure the Journey-side attachment.
 */
export interface AttachJourneyAssetVariables {
  /**
   * Public identifier of the Journey being modified.
   */
  journeyPublicId: string;

  /**
   * Public identifier of the existing Asset.
   */
  assetPublicId: string;

  /**
   * Type of Asset attachment within the Journey.
   */
  type: JourneyAssetType;

  /**
   * Ordering of the Asset within the Journey's assets.
   */
  sortOrder: number;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Attaches an existing Asset to a Journey.
 *
 * The Asset itself remains owned by the Assets domain. The backend creates
 * and persists the Journey-side attachment as part of the Journey aggregate.
 */
export function useAttachJourneyAsset() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    AttachJourneyAssetVariables
  >({
    mutationFn: async ({
      journeyPublicId,
      assetPublicId,
      type,
      sortOrder,
    }) => {
      await attachJourneyAsset(journeyPublicId, {
        assetPublicId,
        type,
        sortOrder,
      });
    },

    onSuccess: async () => {
      /**
       * `JOURNEY_ASSETS_QUERY_KEY` is a static query-key namespace:
       *
       *     ['journeys', 'assets']
       *
       * It is intentionally passed directly to React Query rather than
       * invoked as a function.
       *
       * This invalidates Journey-specific Asset queries such as:
       *
       *     ['journeys', 'assets', journeyPublicId]
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: JOURNEY_ASSETS_QUERY_KEY,
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