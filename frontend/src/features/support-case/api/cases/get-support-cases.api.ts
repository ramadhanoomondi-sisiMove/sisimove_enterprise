// -----------------------------------------------------------------------------
// sisiMove — Get Support Cases API
// -----------------------------------------------------------------------------
//
// Feature API adapter for retrieving Support Case aggregates.
//
// Backend endpoint:
//
//     GET /support-cases
//
// Backend contract:
//
// - requires authentication;
// - requires `support-case:read`;
// - executes GetSupportCasesQuery;
// - returns SupportCaseResponse[];
// - response timestamps are serialized as ISO-8601 strings over HTTP.
//
// IMPORTANT:
//
// This endpoint must NOT be interpreted by the frontend as "my support cases"
// merely because it is used from the authenticated Support experience.
//
// The controller delegates to GetSupportCasesQuery without supplying a
// requester identity. Therefore the actual visibility/scoping behavior belongs
// to the application query handler and authorization boundary.
//
// This API adapter therefore performs no client-side requester filtering.
//
// Architectural boundary:
//
// - authentication is delegated to authenticatedApiClient;
// - HTTP transport is handled here;
// - transport response typing stays faithful to JSON;
// - mapping into frontend SupportCase models belongs to the mapper boundary;
// - no authorization or business rules are implemented here.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

// =============================================================================
// Transport Response
// =============================================================================

/**
 * JSON representation of a Support Case returned by the HTTP API.
 *
 * The backend SupportCaseResponse contains Date instances internally, but
 * JSON transport serializes those values as ISO-8601 strings.
 *
 * This transport type therefore deliberately does not reuse the frontend
 * `SupportCase` model, whose timestamp properties are represented by `Date`.
 */
export interface SupportCaseResponse {
  publicId: string;
  requesterPublicId: string;

  status: string;
  priority: string;
  category: string;

  subject: string;
  description?: string;

  referenceType?: string;
  referencePublicId?: string;

  assignedToPublicId?: string;
  isAssigned: boolean;

  openedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  cancelledAt?: string;

  isResolved: boolean;
  isClosed: boolean;
  isCancelled: boolean;
  isOpen: boolean;

  version: number;

  participantCount: number;
  hasParticipants: boolean;
  participants: SupportCaseParticipantResponse[];

  messageCount: number;
  hasMessages: boolean;
  messages: SupportCaseMessageResponse[];

  /**
   * Notes are present in the backend aggregate response but are deliberately
   * retained only at the transport boundary.
   *
   * Member-facing Support models and UI do not expose internal notes.
   */
  noteCount: number;
  hasNotes: boolean;
  notes: SupportCaseNoteResponse[];

  evidenceCount: number;
  hasEvidence: boolean;
  evidence: SupportCaseEvidenceResponse[];

  hasResolution: boolean;
  resolution?: SupportCaseResolutionResponse;
}

export interface SupportCaseParticipantResponse {
  publicId: string;
  memberPublicId: string;
  role: string;
  joinedAt: string;
  leftAt?: string;
  isActive: boolean;
  hasLeft: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupportCaseMessageResponse {
  publicId: string;
  senderPublicId: string;
  type: string;
  content?: string;
  assetId?: string;
  sentAt: string;
  editedAt?: string;
  deletedAt?: string;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupportCaseNoteResponse {
  publicId: string;
  authorPublicId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportCaseEvidenceResponse {
  publicId: string;
  submittedByPublicId: string;
  assetId: string;
  description?: string;
  createdAt: string;
}

export interface SupportCaseResolutionResponse {
  publicId: string;
  type: string;
  summary: string;
  resolvedByPublicId: string;
  resolvedAt: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// API
// =============================================================================

/**
 * Retrieves Support Cases available through the backend Support query
 * boundary.
 *
 * This function intentionally returns the transport representation.
 *
 * It does not:
 *
 * - filter by the current member;
 * - convert dates;
 * - remove internal-only response fields;
 * - resolve Identity references;
 * - resolve Journey/Booking/Payment/etc. references.
 */
export async function getSupportCases(): Promise<SupportCaseResponse[]> {
  return authenticatedApiClient.get<SupportCaseResponse[]>('/support-cases');
}