// -----------------------------------------------------------------------------
// sisiMove — Edit Support Case Message API
// -----------------------------------------------------------------------------
//
// Feature API adapter for editing an existing Support Case message.
//
// Backend endpoint:
//
//     PATCH /support-cases/:supportCasePublicId/messages/:messagePublicId/edit
//
// Current backend request contract:
//
//     content
//
// The backend aggregate/application layer owns the actual edit authorization
// and lifecycle rules. The frontend must not decide whether a message is
// editable merely from its timestamps or sender identity.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { SupportCaseMessageResponse } from './get-support-case-messages.api';

// =============================================================================
// Request
// =============================================================================

/**
 * HTTP request payload for editing a Support Case message.
 */
export interface EditSupportCaseMessageRequest {
  /**
   * Replacement message content.
   */
  content: string;
}

// =============================================================================
// API
// =============================================================================

/**
 * Edits a Support Case message by its public identity.
 */
export async function editSupportCaseMessage(
  supportCasePublicId: string,
  messagePublicId: string,
  request: EditSupportCaseMessageRequest,
): Promise<SupportCaseMessageResponse> {
  return authenticatedApiClient.patch<SupportCaseMessageResponse>(
    `/support-cases/${encodeURIComponent(supportCasePublicId)}/messages/${encodeURIComponent(messagePublicId)}/edit`,
    request,
  );
}