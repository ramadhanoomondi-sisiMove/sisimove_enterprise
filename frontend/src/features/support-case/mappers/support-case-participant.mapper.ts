// -----------------------------------------------------------------------------
// sisiMove — Support Case Participant Mapper
// -----------------------------------------------------------------------------
//
// Maps Support Case participant transport data into the frontend application
// model.
//
// Boundary:
//
//     SupportCaseParticipantResponse
//             ↓
//     SupportCaseParticipant
//
// Responsibilities:
//
// - convert serialized timestamps into Date instances;
// - preserve the server-provided participant lifecycle flags;
// - preserve opaque member identity references.
//
// Non-responsibilities:
//
// - determining whether the participant is authorized;
// - deriving isActive/hasLeft;
// - resolving the member's Traveller Profile;
// - adding/removing participants.
// -----------------------------------------------------------------------------

import type { SupportCaseParticipantResponse } from '../api/cases/get-support-cases.api';
import type { SupportCaseParticipant } from '../models/support-case-participant';

// =============================================================================
// Mapper
// =============================================================================

/**
 * Maps a Support Case participant HTTP response into the frontend model.
 */
export function mapSupportCaseParticipant(
  response: SupportCaseParticipantResponse,
): SupportCaseParticipant {
  return {
    publicId: response.publicId,
    memberPublicId: response.memberPublicId,

    role: response.role as SupportCaseParticipant['role'],

    joinedAt: new Date(response.joinedAt),
    leftAt: response.leftAt
      ? new Date(response.leftAt)
      : undefined,

    /**
     * These lifecycle flags come directly from the backend.
     *
     * Do not derive them from leftAt.
     */
    isActive: response.isActive,
    hasLeft: response.hasLeft,

    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}

/**
 * Maps a collection of Support Case participants.
 */
export function mapSupportCaseParticipants(
  responses: SupportCaseParticipantResponse[],
): SupportCaseParticipant[] {
  return responses.map(mapSupportCaseParticipant);
}