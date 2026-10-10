
// -----------------------------------------------------------------------------
// sisiMove — Create Journey Support Case Mutation Hook
// -----------------------------------------------------------------------------
//
// React Query mutation boundary for creating a Support Case associated with
// a Journey.
//
// Responsibilities:
//
// - invoke the Journey-specific Support Case creation API;
// - map the transport response into the frontend SupportCase model;
// - invalidate the Support Case collection cache after success.
//
// Non-responsibilities:
//
// - determining the requester identity;
// - authorizing case creation;
// - validating Support aggregate rules;
// - resolving the referenced Journey;
// - deciding navigation after creation.
//
// The consuming page/component owns presentation and navigation behavior.
// -----------------------------------------------------------------------------

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createJourneySupportCase,
  type CreateJourneySupportCaseRequest,
} from '../../api/cases/create-journey-support-case.api';

import { mapSupportCase } from '../../mappers/support-case.mapper';

import { supportCasesQueryKey } from '../queries/use-support-cases';

// =============================================================================
// Mutation Hook
// =============================================================================

/**
 * Creates a Support Case associated with a Journey.
 */
export function useCreateJourneySupportCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyPublicId,
      request,
    }: {
      journeyPublicId: string;
      request: CreateJourneySupportCaseRequest;
    }) => {
      const response = await createJourneySupportCase(
        journeyPublicId,
        request,
      );

      return mapSupportCase(response);
    },

    onSuccess: async () => {
      /**
       * The new case changes the Support Case collection.
       *
       * Invalidate rather than manually inserting the response because the
       * backend remains authoritative for visibility, ordering, counts,
       * and server-side projections.
       */
      await queryClient.invalidateQueries({
        queryKey: supportCasesQueryKey,
      });
    },
  });
}
