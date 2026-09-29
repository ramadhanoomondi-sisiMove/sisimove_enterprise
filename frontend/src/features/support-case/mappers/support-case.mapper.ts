// -----------------------------------------------------------------------------
// sisiMove — Support Case Mapper
// -----------------------------------------------------------------------------
//
// Maps the HTTP transport representation of a Support Case into the
// frontend SupportCase application model.
//
// Boundary:
//
//     SupportCaseResponse
//             ↓
//     SupportCase
//
// Responsibilities:
//
// - convert serialized timestamps into Date instances;
// - map supported enum strings into frontend enum types;
// - map member-facing child resources;
// - preserve backend-provided convenience flags and counts;
// - narrow the Support Case resolution transport contract before delegating
//   resolution mapping;
// - intentionally exclude internal Support Case notes.
//
// Non-responsibilities:
//
// - authorization;
// - validation of Support aggregate rules;
// - deriving lifecycle state;
// - resolving Identity or Asset references;
// - fetching referenced domain resources;
// - deciding whether a case is visible to the current member.
//
// IMPORTANT:
//
// The backend SupportCaseResponse contains notes because the response mapper
// is broader than the member-facing Support UI. Notes are internal Support
// records and therefore MUST NOT cross into the frontend SupportCase model.
//
// The Support Case list/detail HTTP response currently exposes the resolution
// `type` as a generic string, while the dedicated resolution API exposes the
// canonical finite resolution type. The mapper narrows that transport value
// before delegating to mapSupportCaseResolution().
//
// -----------------------------------------------------------------------------

import type { SupportCaseResponse } from '../api/cases/get-support-cases.api';
import type { SupportCaseResolutionResponse as CanonicalSupportCaseResolutionResponse } from '../api/resolution/get-support-case-resolution.api';
import type { SupportCase } from '../models/support-case';

import { mapSupportCaseEvidence } from './support-case-evidence.mapper';
import { mapSupportCaseMessage } from './support-case-message.mapper';
import { mapSupportCaseParticipant } from './support-case-participant.mapper';
import { mapSupportCaseResolution } from './support-case-resolution.mapper';

// =============================================================================
// Resolution Contract Narrowing
// =============================================================================

/**
 * Canonical Support Case resolution types exposed by the dedicated
 * resolution API.
 *
 * The cases API currently types its resolution `type` as `string`, so the
 * mapper must narrow that transport value before passing the response to the
 * resolution mapper.
 */
const SUPPORT_CASE_RESOLUTION_TYPES = [
  'OTHER',
  'INFORMATION_PROVIDED',
  'ACTION_TAKEN',
  'REFUND_ISSUED',
  'BOOKING_CANCELLED',
  'JOURNEY_CANCELLED',
  'ACCOUNT_RESTRICTED',
  'TRUST_ACTION',
  'VERIFICATION_ACTION',
  'NO_ACTION_REQUIRED',
  'REFERRED',
] as const;

type SupportCaseResolutionType =
  (typeof SUPPORT_CASE_RESOLUTION_TYPES)[number];

/**
 * Determines whether a raw resolution type is one of the canonical
 * Support Case resolution types.
 */
function isSupportCaseResolutionType(
  value: string,
): value is SupportCaseResolutionType {
  return (
    SUPPORT_CASE_RESOLUTION_TYPES.includes(
      value as SupportCaseResolutionType,
    )
  );
}

/**
 * Narrows the broader SupportCaseResponse resolution contract into the
 * canonical resolution API response contract.
 *
 * The remaining properties are intentionally preserved from the backend
 * response rather than reconstructed in the mapper.
 */
function mapSupportCaseResolutionResponse(
  response: SupportCaseResponse['resolution'],
): CanonicalSupportCaseResolutionResponse | undefined {
  if (!response) {
    return undefined;
  }

  if (!isSupportCaseResolutionType(response.type)) {
    return undefined;
  }

  return {
    ...response,
    type: response.type,
  };
}

// =============================================================================
// Mapper
// =============================================================================

/**
 * Maps a Support Case HTTP response into the frontend application model.
 */
export function mapSupportCase(
  response: SupportCaseResponse,
): SupportCase {
  const resolutionResponse =
    mapSupportCaseResolutionResponse(response.resolution);

  return {
    publicId: response.publicId,
    requesterPublicId: response.requesterPublicId,

    status: response.status as SupportCase['status'],
    priority: response.priority as SupportCase['priority'],
    category: response.category as SupportCase['category'],

    subject: response.subject,
    description: response.description,

    referenceType: response.referenceType,
    referencePublicId: response.referencePublicId,

    assignedToPublicId: response.assignedToPublicId,
    isAssigned: response.isAssigned,

    openedAt: new Date(response.openedAt),

    resolvedAt: response.resolvedAt
      ? new Date(response.resolvedAt)
      : undefined,

    closedAt: response.closedAt
      ? new Date(response.closedAt)
      : undefined,

    cancelledAt: response.cancelledAt
      ? new Date(response.cancelledAt)
      : undefined,

    /**
     * These lifecycle flags are supplied by the backend.
     *
     * Do not recreate them from `status` or timestamps in the frontend.
     */
    isResolved: response.isResolved,
    isClosed: response.isClosed,
    isCancelled: response.isCancelled,
    isOpen: response.isOpen,

    version: response.version,

    participantCount: response.participantCount,
    hasParticipants: response.hasParticipants,
    participants: response.participants.map(
      mapSupportCaseParticipant,
    ),

    messageCount: response.messageCount,
    hasMessages: response.hasMessages,
    messages: response.messages.map(
      mapSupportCaseMessage,
    ),

    evidenceCount: response.evidenceCount,
    hasEvidence: response.hasEvidence,
    evidence: response.evidence.map(
      mapSupportCaseEvidence,
    ),

    hasResolution: response.hasResolution,
    resolution: resolutionResponse
      ? mapSupportCaseResolution(resolutionResponse)
      : undefined,
  };
}

/**
 * Maps an optional Support Case response.
 *
 * Useful for query boundaries where the backend may return no case.
 */
export function mapSupportCaseOrUndefined(
  response: SupportCaseResponse | undefined,
): SupportCase | undefined {
  return response
    ? mapSupportCase(response)
    : undefined;
}

