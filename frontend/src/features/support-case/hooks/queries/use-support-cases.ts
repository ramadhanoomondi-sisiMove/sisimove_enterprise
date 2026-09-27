// -----------------------------------------------------------------------------
// sisiMove — Support Cases Query Hook
// -----------------------------------------------------------------------------
//
// React Query boundary for retrieving Support Cases.
//
// Responsibilities:
//
// - execute the Support Cases API query;
// - map transport responses into frontend SupportCase models;
// - expose React Query lifecycle state;
// - provide explicit refetch support through React Query.
//
// Non-responsibilities:
//
// - authentication;
// - authorization;
// - requester filtering;
// - Support business rules;
// - Identity/Profile resolution;
// - UI rendering.
//
// IMPORTANT:
//
// GET /support-cases is intentionally not client-filtered to "my cases" here.
// The backend query/authorization boundary owns visibility and scoping.
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getSupportCases,
  type SupportCaseResponse,
} from '../../api/cases/get-support-cases.api';
import { mapSupportCase } from '../../mappers/support-case.mapper';

const SUPPORT_CASES_QUERY_KEY = ['support', 'cases'] as const;

// =============================================================================
// Query Hook
// =============================================================================

/**
 * Loads Support Cases available through the backend Support query boundary.
 */
export function useSupportCases() {
  return useQuery({
    queryKey: SUPPORT_CASES_QUERY_KEY,

    queryFn: async () => {
      const responses: SupportCaseResponse[] =
        await getSupportCases();

      return responses.map(mapSupportCase);
    },
  });
}

/**
 * Stable query key for Support Case collection consumers.
 *
 * This is exported so mutations can invalidate the exact collection cache
 * without duplicating the key structure.
 */
export const supportCasesQueryKey = SUPPORT_CASES_QUERY_KEY;