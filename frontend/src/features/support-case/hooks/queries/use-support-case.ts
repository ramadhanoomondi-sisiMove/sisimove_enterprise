// -----------------------------------------------------------------------------
// sisiMove — Support Case Query Hook
// -----------------------------------------------------------------------------
//
// React Query boundary for retrieving one Support Case.
//
// The hook accepts the public Support Case identity and delegates retrieval to
// the Support API adapter. Transport data is mapped into the frontend
// SupportCase application model before being exposed to consumers.
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getSupportCase,
  type SupportCaseResponse,
} from '../../api/cases/get-support-case.api';
import { mapSupportCase } from '../../mappers/support-case.mapper';

// =============================================================================
// Query Key
// =============================================================================

export function supportCaseQueryKey(
  supportCasePublicId: string,
) {
  return ['support', 'case', supportCasePublicId] as const;
}

// =============================================================================
// Query Hook
// =============================================================================

/**
 * Loads one Support Case by public identity.
 *
 * The query is disabled until a valid public identity is supplied.
 */
export function useSupportCase(
  supportCasePublicId: string | undefined,
) {
  return useQuery({
    queryKey: supportCasePublicId
      ? supportCaseQueryKey(supportCasePublicId)
      : ['support', 'case', 'disabled'] as const,

    queryFn: async () => {
      /**
       * `enabled` guarantees that the query function is not executed without
       * a public ID. The guard remains explicit so the function itself does
       * not silently construct an invalid URL.
       */
      if (!supportCasePublicId) {
        throw new Error(
          'Support Case public ID is required to fetch a Support Case.',
        );
      }

      const response: SupportCaseResponse =
        await getSupportCase(supportCasePublicId);

      return mapSupportCase(response);
    },

    enabled: Boolean(supportCasePublicId),
  });
}