// -----------------------------------------------------------------------------
// sisiMove — Delete Support Case Message API
// -----------------------------------------------------------------------------
//
// Feature API adapter for deleting a Support Case message.
//
// Backend endpoint:
//
//     DELETE /support-cases/:supportCasePublicId/messages/:messagePublicId/delete
//
// The backend supports an optional deletedAt value, but the member-facing
// frontend does not need to manufacture lifecycle timestamps. The server
// should establish the deletion timestamp when none is supplied.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type { SupportCaseMessageResponse } from './get-support-case-messages.api';

// =============================================================================
// API
// =============================================================================

/**
 * Deletes a Support Case message by its public identity.
 */
export async function deleteSupportCaseMessage(
  supportCasePublicId: string,
  messagePublicId: string,
): Promise<SupportCaseMessageResponse> {
  return authenticatedApiClient.delete<SupportCaseMessageResponse>(
    `/support-cases/${encodeURIComponent(supportCasePublicId)}/messages/${encodeURIComponent(messagePublicId)}/delete`,
  );
}