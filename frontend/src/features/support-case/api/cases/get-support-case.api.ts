// -----------------------------------------------------------------------------
// sisiMove — Get Support Case API
// -----------------------------------------------------------------------------
//
// Feature API adapter for retrieving one Support Case aggregate.
//
// Backend endpoint:
//
//     GET /support-cases/:supportCasePublicId
//
// Backend contract:
//
// - requires authentication;
// - requires `support-case:read`;
// - identifies the Support Case by its public identity;
// - returns SupportCaseResponse.
//
// The API adapter represents the JSON transport shape. Conversion into the
// frontend SupportCase model belongs to the Support mapper boundary.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { SupportCaseResponse } from './get-support-cases.api';

// =============================================================================
// Transport Type Re-export
// =============================================================================
//
// This endpoint returns the same transport representation as the Support Case
// collection endpoint.
//
// Re-exporting the type from this endpoint keeps consumers able to import the
// response contract from the API adapter they are actually calling, without
// creating a duplicate transport interface.
//
// -----------------------------------------------------------------------------

export type { SupportCaseResponse } from './get-support-cases.api';

// =============================================================================
// API
// =============================================================================

/**
 * Retrieves a Support Case by its public identity.
 *
 * The public identifier is encoded because it becomes part of the URL path.
 */
export async function getSupportCase(
  supportCasePublicId: string,
): Promise<SupportCaseResponse> {
  return authenticatedApiClient.get<SupportCaseResponse>(
    `/support-cases/${encodeURIComponent(supportCasePublicId)}`,
  );
}