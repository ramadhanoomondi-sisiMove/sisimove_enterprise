// -----------------------------------------------------------------------------
// sisiMove — Support Case Resolution Mapper
// -----------------------------------------------------------------------------
//
// Maps Support Case resolution transport data into the frontend application
// model.
//
// Boundary:
//
//     SupportCaseResolutionResponse
//             ↓
//     SupportCaseResolution
//
// Resolution is member-facing read-only data.
//
// The mapper does not infer SupportCase status from the existence of a
// resolution. Resolution creation and case resolution are separate backend
// aggregate operations.
// -----------------------------------------------------------------------------

import type { SupportCaseResolutionResponse } from '../api/resolution/get-support-case-resolution.api';
import type { SupportCaseResolution } from '../models/support-case-resolution';

// =============================================================================
// Mapper
// =============================================================================

/**
 * Maps a Support Case resolution HTTP response into the frontend model.
 */
export function mapSupportCaseResolution(
  response: SupportCaseResolutionResponse,
): SupportCaseResolution {
  return {
    publicId: response.publicId,

    type: response.type as SupportCaseResolution['type'],

    summary: response.summary,
    resolvedByPublicId: response.resolvedByPublicId,

    resolvedAt: new Date(response.resolvedAt),
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}

/**
 * Maps an optional resolution response.
 *
 * The dedicated backend endpoint returns null when the case has no resolution.
 */
export function mapSupportCaseResolutionOrUndefined(
  response: SupportCaseResolutionResponse | null,
): SupportCaseResolution | undefined {
  return response
    ? mapSupportCaseResolution(response)
    : undefined;
}