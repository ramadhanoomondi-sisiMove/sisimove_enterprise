// -----------------------------------------------------------------------------
// sisiMove — Add Support Case Evidence Mutation Hook
// -----------------------------------------------------------------------------
//
// React Query mutation boundary for attaching an existing Asset as Support
// Case evidence.
//
// Asset creation/upload is outside this mutation. The request contains the
// already-created opaque Asset identity.
//
// A successful evidence operation changes:
//
// - the Support Case evidence collection;
// - evidenceCount;
// - hasEvidence;
// - the parent Support Case projection.
//
// Therefore both caches are invalidated.
// -----------------------------------------------------------------------------

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  addSupportCaseEvidence,
  type AddSupportCaseEvidenceRequest,
} from '../../api/evidence/add-support-case-evidence.api';
import { mapSupportCaseEvidence } from '../../mappers/support-case-evidence.mapper';

import { supportCaseQueryKey } from '../queries/use-support-case';
import { supportCaseEvidenceQueryKey } from '../queries/use-support-case-evidence';

// =============================================================================
// Variables
// =============================================================================

export interface AddSupportCaseEvidenceVariables {
  supportCasePublicId: string;
  request: AddSupportCaseEvidenceRequest;
}

// =============================================================================
// Mutation Hook
// =============================================================================

/**
 * Adds evidence to a Support Case.
 */
export function useAddSupportCaseEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      supportCasePublicId,
      request,
    }: AddSupportCaseEvidenceVariables) => {
      const response = await addSupportCaseEvidence(
        supportCasePublicId,
        request,
      );

      return mapSupportCaseEvidence(response);
    },

    onSuccess: async (_evidence, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: supportCaseEvidenceQueryKey(
            variables.supportCasePublicId,
          ),
        }),

        queryClient.invalidateQueries({
          queryKey: supportCaseQueryKey(
            variables.supportCasePublicId,
          ),
        }),
      ]);
    },
  });
}