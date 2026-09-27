// -----------------------------------------------------------------------------
// sisiMove — Support Case Evidence Mapper
// -----------------------------------------------------------------------------
//
// Maps Support Case evidence transport data into the frontend application
// model.
//
// Boundary:
//
//     SupportCaseEvidenceResponse
//             ↓
//     SupportCaseEvidence
//
// Responsibilities:
//
// - convert the serialized creation timestamp;
// - preserve opaque submitter and Asset references;
// - preserve the optional description.
//
// Non-responsibilities:
//
// - uploading Assets;
// - resolving Asset URLs;
// - resolving submitter profiles;
// - determining evidence authorization;
// - validating Support aggregate rules.
// -----------------------------------------------------------------------------

import type { SupportCaseEvidenceResponse } from '../api/evidence/get-support-case-evidence.api';
import type { SupportCaseEvidence } from '../models/support-case-evidence';

// =============================================================================
// Mapper
// =============================================================================

/**
 * Maps Support Case evidence HTTP data into the frontend model.
 */
export function mapSupportCaseEvidence(
  response: SupportCaseEvidenceResponse,
): SupportCaseEvidence {
  return {
    publicId: response.publicId,
    submittedByPublicId: response.submittedByPublicId,
    assetId: response.assetId,
    description: response.description,
    createdAt: new Date(response.createdAt),
  };
}

/**
 * Maps a collection of Support Case evidence records.
 */
export function mapSupportCaseEvidenceList(
  responses: SupportCaseEvidenceResponse[],
): SupportCaseEvidence[] {
  return responses.map(mapSupportCaseEvidence);
}