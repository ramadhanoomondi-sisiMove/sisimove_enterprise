// -----------------------------------------------------------------------------
// sisiMove — Support Case Message Mapper
// -----------------------------------------------------------------------------
//
// Maps Support Case message transport data into the frontend application
// model.
//
// Boundary:
//
//     SupportCaseMessageResponse
//             ↓
//     SupportCaseMessage
//
// Responsibilities:
//
// - convert serialized timestamps into Date instances;
// - preserve server-provided message lifecycle flags;
// - preserve opaque sender and Asset references.
//
// Non-responsibilities:
//
// - determining whether a message may be edited/deleted;
// - determining whether a sender is the current member;
// - resolving sender profiles;
// - resolving Asset data;
// - deriving isEdited/isDeleted from timestamps.
// -----------------------------------------------------------------------------

import type { SupportCaseMessageResponse } from '../api/messages/get-support-case-messages.api';
import type { SupportCaseMessage } from '../models/support-case-message';

// =============================================================================
// Mapper
// =============================================================================

/**
 * Maps a Support Case message HTTP response into the frontend model.
 */
export function mapSupportCaseMessage(
  response: SupportCaseMessageResponse,
): SupportCaseMessage {
  return {
    publicId: response.publicId,
    senderPublicId: response.senderPublicId,

    type: response.type as SupportCaseMessage['type'],

    content: response.content,
    assetId: response.assetId,

    sentAt: new Date(response.sentAt),
    editedAt: response.editedAt
      ? new Date(response.editedAt)
      : undefined,
    deletedAt: response.deletedAt
      ? new Date(response.deletedAt)
      : undefined,

    /**
     * These flags are authoritative server state.
     *
     * The mapper deliberately does not derive them from editedAt/deletedAt.
     */
    isEdited: response.isEdited,
    isDeleted: response.isDeleted,

    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}

/**
 * Maps a collection of Support Case messages.
 */
export function mapSupportCaseMessages(
  responses: SupportCaseMessageResponse[],
): SupportCaseMessage[] {
  return responses.map(mapSupportCaseMessage);
}