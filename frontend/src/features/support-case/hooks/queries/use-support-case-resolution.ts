// -----------------------------------------------------------------------------
// sisiMove — Support Case Resolution Query Hook
// -----------------------------------------------------------------------------
//
// React Query boundary for the read-only Support Case resolution.
//
// A Support Case may legitimately have no resolution, therefore the successful
// query result can be undefined after mapping a backend null response.
//
// The hook does not infer case status from resolution existence.
//
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getSupportCaseResolution,
  type SupportCaseResolutionResponse,
} from '../../api/resolution/get-support-case-resolution.api';
import { mapSupportCaseResolution } from '../../mappers/support-case-resolution.mapper';

// =============================================================================
// Query Key
// =============================================================================

export function supportCaseResolutionQueryKey(
  supportCasePublicId: string,
) {
  return ['support', 'case', supportCasePublicId, 'resolution'] as const;
}

// =============================================================================
// Query Hook
// =============================================================================

/**
 * Loads the read-only resolution associated with a Support Case.
 *
 * Result:
 *
 *     SupportCaseResolution | undefined
 *
 * `undefined` means the backend returned null and no resolution currently
 * exists. React Query's loading state remains available separately through
 * the returned query object.
 */
export function useSupportCaseResolution(
  supportCasePublicId: string | undefined,
) {
  return useQuery({
    queryKey: supportCasePublicId
      ? supportCaseResolutionQueryKey(supportCasePublicId)
      : ['support', 'case', 'disabled', 'resolution'] as const,

    queryFn: async () => {
      if (!supportCasePublicId) {
        throw new Error(
          'Support Case public ID is required to fetch resolution.',
        );
      }

      const response: SupportCaseResolutionResponse | null =
        await getSupportCaseResolution(supportCasePublicId);

      return response
        ? mapSupportCaseResolution(response)
        : undefined;
    },

    enabled: Boolean(supportCasePublicId),
  });
}