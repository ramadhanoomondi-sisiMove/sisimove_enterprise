'use client';

/**
 * sisiMove — Journey Mutation Hooks
 *
 * Handles administrative journey lifecycle operations:
 * - Start
 * - Complete
 * - Cancel
 * - Expire
 *
 * The backend remains responsible for validating lifecycle transitions.
 * Successful mutations invalidate the canonical journey query keys.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { journeysApi } from '../api/journeys.api';

import { journeyQueryKeys } from './journey-query.hooks';

import type {
  StartJourneyRequest,
  CompleteJourneyRequest,
  CancelJourneyRequest,
  ExpireJourneyRequest,
} from '../api/journeys.api';

// -----------------------------------------------------------------------------
// Shared cache invalidation
// -----------------------------------------------------------------------------

async function invalidateJourneyQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  journeyPublicId: string,
): Promise<void> {
  const normalizedPublicId = journeyPublicId.trim();

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: journeyQueryKeys.adminDetail(normalizedPublicId),
    }),

    queryClient.invalidateQueries({
      queryKey: journeyQueryKeys.detail(normalizedPublicId),
    }),

    // Also refresh journey lists and other queries under ['journeys'].
    queryClient.invalidateQueries({
      queryKey: journeyQueryKeys.all,
    }),
  ]);
}

// -----------------------------------------------------------------------------
// Start journey
// -----------------------------------------------------------------------------

export function useStartJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyPublicId,
      request,
    }: {
      journeyPublicId: string;
      request?: StartJourneyRequest;
    }) => {
      const id = journeyPublicId.trim();

      if (!id) {
        throw new Error('Journey public ID is required.');
      }

      await journeysApi.start(id, request ?? {});
    },

    onSuccess: async (_data, variables) => {
      await invalidateJourneyQueries(
        queryClient,
        variables.journeyPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Complete journey
// -----------------------------------------------------------------------------

export function useCompleteJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyPublicId,
      request,
    }: {
      journeyPublicId: string;
      request?: CompleteJourneyRequest;
    }) => {
      const id = journeyPublicId.trim();

      if (!id) {
        throw new Error('Journey public ID is required.');
      }

      await journeysApi.complete(id, request ?? {});
    },

    onSuccess: async (_data, variables) => {
      await invalidateJourneyQueries(
        queryClient,
        variables.journeyPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Cancel journey
// -----------------------------------------------------------------------------

export function useCancelJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyPublicId,
      request,
    }: {
      journeyPublicId: string;
      request: CancelJourneyRequest;
    }) => {
      const id = journeyPublicId.trim();

      if (!id) {
        throw new Error('Journey public ID is required.');
      }

      const reason = request.reason.trim();

      if (!reason) {
        throw new Error('A cancellation reason is required.');
      }

      await journeysApi.cancel(id, {
        ...request,
        reason,
      });
    },

    onSuccess: async (_data, variables) => {
      await invalidateJourneyQueries(
        queryClient,
        variables.journeyPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Expire journey
// -----------------------------------------------------------------------------

export function useExpireJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyPublicId,
      request,
    }: {
      journeyPublicId: string;
      request?: ExpireJourneyRequest;
    }) => {
      const id = journeyPublicId.trim();

      if (!id) {
        throw new Error('Journey public ID is required.');
      }

      await journeysApi.expire(id, request ?? {});
    },

    onSuccess: async (_data, variables) => {
      await invalidateJourneyQueries(
        queryClient,
        variables.journeyPublicId,
      );
    },
  });
}
