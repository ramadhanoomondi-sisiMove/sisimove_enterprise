// -----------------------------------------------------------------------------
// sisiMove — Get Support Case Resolution API
// -----------------------------------------------------------------------------
//
// Feature API adapter for retrieving the resolution associated with a
// Support Case.
//
// Backend endpoint:
//
//     GET /support-cases/:supportCasePublicId/resolution
//
// Backend responsibilities:
//
// - authenticate the caller;
// - authorize `support-case-resolution:read`;
// - retrieve the aggregate's resolution;
// - return the mapped resolution or null when no resolution exists.
//
// Member-facing boundary:
//
// - resolution is read-only;
// - members do not create, edit, or delete resolutions;
// - resolution lifecycle is owned by the Support aggregate/application layer.
//
// Transport boundary:
//
// The backend mapper uses Date instances internally, but JSON serialization
// produces ISO-8601 strings. Therefore this API adapter deliberately exposes
// a transport response rather than the frontend SupportCaseResolution model.
//
// Date conversion belongs to support-case-resolution.mapper.ts.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { SupportResolutionType } from '../../models/support-resolution-type';

// =============================================================================
// Transport Response
// =============================================================================

/**
 * JSON representation of a Support Case resolution.
 *
 * This mirrors the serialized SupportCaseResolutionResponse returned by the
 * backend controller.
 */
export interface SupportCaseResolutionResponse {
  /**
   * Public identity of the resolution record.
   */
  publicId: string;

  /**
   * Resolution classification.
   */
  type: SupportResolutionType;

  /**
   * Human-readable resolution summary.
   */
  summary: string;

  /**
   * Opaque public identity of the member/support actor that resolved the case.
   */
  resolvedByPublicId: string;

  /**
   * Resolution timestamp in JSON transport format.
   */
  resolvedAt: string;

  /**
   * Creation timestamp in JSON transport format.
   */
  createdAt: string;

  /**
   * Last update timestamp in JSON transport format.
   */
  updatedAt: string;
}

// =============================================================================
// API
// =============================================================================

/**
 * Retrieves the resolution associated with a Support Case.
 *
 * `null` is a valid response because a Support Case can exist without a
 * resolution.
 *
 * Importantly, the frontend must not interpret the existence of this response
 * as meaning that the case status is RESOLVED. Resolution creation and case
 * resolution are separate aggregate operations in the backend.
 */
export async function getSupportCaseResolution(
  supportCasePublicId: string,
): Promise<SupportCaseResolutionResponse | null> {
  return authenticatedApiClient.get<SupportCaseResolutionResponse | null>(
    `/support-cases/${encodeURIComponent(supportCasePublicId)}/resolution`,
  );
}