// -----------------------------------------------------------------------------
// sisiMove — Support Case Evidence Query Hook
// -----------------------------------------------------------------------------
//
// React Query boundary for Support Case evidence.
//
// Evidence references Assets through opaque asset IDs. Asset resolution is
// intentionally not performed by this hook.
//
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getSupportCaseEvidence,
  type SupportCaseEvidenceResponse,
} from '../../api/evidence/get-support-case-evidence.api';
import { mapSupportCaseEvidence } from '../../mappers/support-case-evidence.mapper';

// =============================================================================
// Query Key
// =============================================================================

export function supportCaseEvidenceQueryKey(
  supportCasePublicId: string,
) {
  return ['support', 'case', supportCasePublicId, 'evidence'] as const;
}

// =============================================================================
// Query Hook
// =============================================================================

/**
 * Loads evidence belonging to a Support Case.
 */
export function useSupportCaseEvidence(
  supportCasePublicId: string | undefined,
) {
  return useQuery({
    queryKey: supportCasePublicId
      ? supportCaseEvidenceQueryKey(supportCasePublicId)
      : ['support', 'case', 'disabled', 'evidence'] as const,

    queryFn: async () => {
      if (!supportCasePublicId) {
        throw new Error(
          'Support Case public ID is required to fetch evidence.',
        );
      }

      const responses: SupportCaseEvidenceResponse[] =
        await getSupportCaseEvidence(supportCasePublicId);

      return responses.map(mapSupportCaseEvidence);
    },

    enabled: Boolean(supportCasePublicId),
  });
}