// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneyVehicle
// -----------------------------------------------------------------------------
//
// React Query mutation hook for configuring and attaching a Vehicle to a
// Journey.
//
// API boundary:
//     POST /api/v1/journeys/:journeyPublicId/vehicle
//
// Request body:
//     {
//       make: string;
//       model: string;
//       year?: number;
//       color?: string;
//       registration?: string;
//       assetPublicId?: string;
//     }
//
// IMPORTANT:
//
// Journey Vehicle configuration is submitted through the Journey creation
// workflow.
//
// The frontend does NOT send a vehiclePublicId for this creation step.
//
// The backend application handler:
//
//   1. Resolves the Journey aggregate.
//   2. Creates/configures the JourneyVehicle from the supplied vehicle data.
//   3. Attaches the vehicle to the Journey aggregate.
//   4. Persists the Journey aggregate.
//
// Vehicle details therefore belong to this Journey configuration request.
//
// `assetPublicId` is the one external reference in this request. When
// supplied, it identifies an existing Asset owned by the Assets domain.
// The frontend does not create or upload that Asset through this mutation.
//
// The backend remains authoritative for:
// - vehicle validation;
// - vehicle data rules;
// - registration rules;
// - Asset reference validation;
// - Journey lifecycle rules;
// - authorization;
// - aggregate persistence.
//
// This hook is responsible for:
// - Executing the Vehicle configuration API.
// - Managing mutation state through React Query.
// - Invalidating affected Journey Vehicle queries.
// - Invalidating authenticated Journey collections.
//
// This hook intentionally does NOT:
// - Create domain entities directly.
// - Generate vehicle identifiers.
// - Upload vehicle assets.
// - Resolve Asset ownership.
// - Validate Journey lifecycle rules.
// - Perform authorization checks.
// - Navigate to another route.
// -----------------------------------------------------------------------------
//
// Architectural flow:
//
//   JourneyVehicleStep
//          │
//          ▼
//   useAttachJourneyVehicle()
//          │
//          ▼
//   attachJourneyVehicle()
//          │
//          ▼
//   Journey HTTP Controller
//          │
//          ▼
//   AttachJourneyVehicleCommand
//          │
//          ▼
//   Journey Aggregate
//          │
//          ▼
//        save()
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { attachJourneyVehicle } from '../../api/components/vehicle';

import {
  JOURNEY_VEHICLE_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Vehicle configuration mutation.
 *
 * `journeyPublicId` identifies the Journey being modified.
 *
 * The remaining fields represent the vehicle configuration that the backend
 * will create/configure and attach to the Journey aggregate.
 */
export interface AttachJourneyVehicleVariables {
  /**
   * Public identifier of the Journey being modified.
   */
  journeyPublicId: string;

  /**
   * Vehicle manufacturer.
   */
  make: string;

  /**
   * Vehicle model.
   */
  model: string;

  /**
   * Optional vehicle manufacturing/model year.
   */
  year?: number;

  /**
   * Optional vehicle colour.
   */
  color?: string;

  /**
   * Optional vehicle registration identifier.
   */
  registration?: string;

  /**
   * Optional public identifier of an existing Asset representing the vehicle.
   *
   * The Asset remains owned by the Assets domain. This value only establishes
   * the Journey-side reference to that existing asset.
   */
  assetPublicId?: string;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Configures and attaches a Vehicle to a Journey.
 *
 * The backend creates/configures the JourneyVehicle, attaches it to the
 * Journey aggregate, and persists the aggregate.
 */
export function useAttachJourneyVehicle() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    AttachJourneyVehicleVariables
  >({
    mutationFn: async ({
      journeyPublicId,
      make,
      model,
      year,
      color,
      registration,
      assetPublicId,
    }) => {
      await attachJourneyVehicle(journeyPublicId, {
        make,
        model,
        year,
        color,
        registration,
        assetPublicId,
      });
    },

    onSuccess: async () => {
      /**
       * Configuring the Vehicle changes the Journey's composed
       * representation.
       *
       * `JOURNEY_VEHICLE_QUERY_KEY` is intentionally a static namespace:
       *
       *     ['journeys', 'vehicle']
       *
       * It is therefore passed directly to React Query rather than invoked
       * as a function.
       *
       * React Query will invalidate queries whose keys begin with this
       * namespace, including Journey-specific vehicle queries such as:
       *
       *     ['journeys', 'vehicle', journeyPublicId]
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: JOURNEY_VEHICLE_QUERY_KEY,
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