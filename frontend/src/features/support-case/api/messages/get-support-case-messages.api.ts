// -----------------------------------------------------------------------------
// sisiMove — Get Support Case Messages API
// -----------------------------------------------------------------------------
//
// Feature API adapter for retrieving the messages belonging to a Support Case.
//
// Backend endpoint:
//
//     GET /support-cases/:supportCasePublicId/messages
//
// Backend responsibilities:
//
// - authenticate the caller;
// - authorize `support-case-message:read`;
// - load messages through the Support aggregate/application boundary;
// - return SupportCaseMessageResponse[].
//
// Frontend responsibilities:
//
// - invoke the authenticated HTTP boundary;
// - preserve the JSON transport representation;
// - leave timestamp conversion to the Support message mapper.
//
// This adapter does not:
//
// - filter messages locally;
// - resolve sender identities;
// - resolve message assets;
// - decide which messages a member is allowed to see;
// - recreate Support aggregate rules.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

// =============================================================================
// Transport Response
// =============================================================================

/**
 * JSON representation of a Support Case Message.
 *
 * The backend mapper uses Date internally, but JSON transport serializes those
 * values as ISO-8601 strings.
 */
export interface SupportCaseMessageResponse {
  publicId: string;
  senderPublicId: string;
  type: string;
  content?: string;
  assetId?: string;

  sentAt: string;
  editedAt?: string;
  deletedAt?: string;

  /**
   * Server-provided convenience flags.
   *
   * The frontend must consume these rather than reconstructing message state
   * from editedAt/deletedAt.
   */
  isEdited: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// API
// =============================================================================

/**
 * Retrieves the messages belonging to a Support Case.
 */
export async function getSupportCaseMessages(
  supportCasePublicId: string,
): Promise<SupportCaseMessageResponse[]> {
  return authenticatedApiClient.get<SupportCaseMessageResponse[]>(
    `/support-cases/${encodeURIComponent(supportCasePublicId)}/messages`,
  );
}