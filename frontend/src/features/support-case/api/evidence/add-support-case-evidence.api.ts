// -----------------------------------------------------------------------------
// sisiMove — Add Support Case Evidence API
// -----------------------------------------------------------------------------
//
// Feature API adapter for adding evidence to a Support Case.
//
// Backend endpoint:
//
//     POST /support-cases/:supportCasePublicId/evidence
//
// Current backend request contract:
//
//     submittedByPublicId
//     assetId
//     description?
//
// Architectural boundary:
//
// - the Support aggregate/application layer owns evidence invariants;
// - the Assets domain owns the referenced asset;
// - this adapter only represents the HTTP contract;
// - authentication is supplied by authenticatedApiClient.
//
// IMPORTANT:
//
// `submittedByPublicId` is an opaque Identity-domain reference. It is required
// by the current backend DTO, but the member-facing UI must never present it
// as an arbitrary identity selector.
//
// The authenticated member identity should be supplied by the application
// context when this API is eventually invoked.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { SupportCaseEvidenceResponse } from './get-support-case-evidence.api';

// =============================================================================
// Request
// =============================================================================

/**
 * HTTP request payload for adding Support Case evidence.
 */
export interface AddSupportCaseEvidenceRequest {
  /**
   * Public identity of the member submitting the evidence.
   *
   * This is an opaque Identity-domain reference.
   */
  submittedByPublicId: string;

  /**
   * Public identity of the Asset associated with the evidence.
   *
   * This is intentionally not expanded into an Asset object here.
   */
  assetId: string;

  /**
   * Optional explanation describing why the asset is being submitted.
   */
  description?: string;
}

// =============================================================================
// API
// =============================================================================

/**
 * Adds an existing Asset as evidence to a Support Case.
 *
 * This endpoint does not upload binary content itself.
 *
 * Asset creation/upload remains an Assets-domain responsibility. The Support
 * feature receives the resulting opaque asset identity and associates it with
 * the case as evidence.
 */
export async function addSupportCaseEvidence(
  supportCasePublicId: string,
  request: AddSupportCaseEvidenceRequest,
): Promise<SupportCaseEvidenceResponse> {
  return authenticatedApiClient.post<SupportCaseEvidenceResponse>(
    `/support-cases/${encodeURIComponent(supportCasePublicId)}/evidence`,
    request,
  );
}