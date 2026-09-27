// -----------------------------------------------------------------------------
// sisiMove — Get Support Case Evidence API
// -----------------------------------------------------------------------------
//
// Feature API adapter for retrieving evidence attached to a Support Case.
//
// Backend endpoint:
//
//     GET /support-cases/:supportCasePublicId/evidence
//
// Backend responsibilities:
//
// - authenticate the caller;
// - authorize `support-case-evidence:read`;
// - retrieve evidence through the Support application boundary;
// - return SupportCaseEvidenceResponse[].
//
// Frontend responsibilities:
//
// - invoke the authenticated HTTP boundary;
// - preserve the JSON transport representation;
// - leave timestamp conversion to the evidence mapper.
//
// This adapter does not:
//
// - resolve Asset-domain references;
// - resolve submitter identities;
// - filter evidence locally;
// - determine whether evidence is visible to the current member;
// - recreate Support aggregate rules.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

// =============================================================================
// Transport Response
// =============================================================================

/**
 * JSON representation of Support Case evidence.
 *
 * The backend response mapper uses Date internally, while JSON transport
 * serializes the timestamp as an ISO-8601 string.
 */
export interface SupportCaseEvidenceResponse {
  /**
   * Public identity of the evidence record.
   */
  publicId: string;

  /**
   * Opaque public identity of the member who submitted the evidence.
   */
  submittedByPublicId: string;

  /**
   * Opaque Assets-domain public identity.
   *
   * The evidence API does not resolve this into an asset URL.
   */
  assetId: string;

  /**
   * Optional explanation describing the submitted evidence.
   */
  description?: string;

  /**
   * Evidence creation timestamp in JSON transport format.
   */
  createdAt: string;
}

// =============================================================================
// API
// =============================================================================

/**
 * Retrieves evidence belonging to a Support Case.
 */
export async function getSupportCaseEvidence(
  supportCasePublicId: string,
): Promise<SupportCaseEvidenceResponse[]> {
  return authenticatedApiClient.get<SupportCaseEvidenceResponse[]>(
    `/support-cases/${encodeURIComponent(supportCasePublicId)}/evidence`,
  );
}