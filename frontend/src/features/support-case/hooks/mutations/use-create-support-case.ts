// -----------------------------------------------------------------------------
// sisiMove — Create Support Case Mutation Hook
// -----------------------------------------------------------------------------
//
// React Query mutation boundary for creating a Support Case.
//
// Responsibilities:
//
// - invoke the Support Case creation API;
// - map the transport response into the frontend SupportCase model;
// - invalidate the Support Case collection cache after success.
//
// Non-responsibilities:
//
// - determining the requester identity;
// - authorizing case creation;
// - validating Support aggregate rules;
// - resolving referenced domain resources;
// - deciding navigation after creation.
//
// The consuming page/component owns presentation and navigation behavior.
// -----------------------------------------------------------------------------

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createSupportCase,
  type CreateSupportCaseRequest,
} from '../../api/cases/create-support-case.api';
import { mapSupportCase } from '../../mappers/support-case.mapper';

import { supportCasesQueryKey } from '../queries/use-support-cases';

// =============================================================================
// Mutation Hook
// =============================================================================

/**
 * Creates a Support Case.
 */
export function useCreateSupportCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateSupportCaseRequest) => {
      const response = await createSupportCase(request);

      return mapSupportCase(response);
    },

    onSuccess: async () => {
      /**
       * The new case changes the Support Case collection.
       *
       * We invalidate rather than manually inserting the response because the
       * backend remains authoritative for collection visibility, ordering,
       * counts, and any future server-side projection behavior.
       */
      await queryClient.invalidateQueries({
        queryKey: supportCasesQueryKey,
      });
    },
  });
}