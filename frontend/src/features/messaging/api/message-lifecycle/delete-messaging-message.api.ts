// -----------------------------------------------------------------------------
// sisiMove — Delete Messaging Message API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Call the authenticated endpoint that deletes a message.
// - Preserve the raw backend response.
//
// Non-responsibilities:
// - Determining whether the message may be deleted.
// - Message lifecycle orchestration.
// - Authorization decisions.
// - Domain/model mapping.
// - Date conversion.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Raw response
// -----------------------------------------------------------------------------

export interface DeleteMessagingMessageApiResponse {
  publicId: string;

  conversationPublicId: string;

  senderPublicId: string;

  type: string;

  status: string;

  content?: string;

  assetPublicId?: string;

  isText: boolean;

  isImage: boolean;

  isFile: boolean;

  isSystem: boolean;

  isSent: boolean;

  isEdited: boolean;

  isDeleted: boolean;

  isModerated: boolean;

  isUsable: boolean;

  canBeModified: boolean;

  canBeEdited: boolean;

  canBeDeleted: boolean;

  canBeModerated: boolean;

  hasContent: boolean;

  hasAsset: boolean;

  sentAt: string;

  editedAt?: string;

  deletedAt?: string;

  moderatedAt?: string;

  createdAt: string;

  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function deleteMessagingMessage(
  messagePublicId: string,
): Promise<DeleteMessagingMessageApiResponse> {
  return authenticatedApiClient.delete<DeleteMessagingMessageApiResponse>(
    `/messaging/messages/${encodeURIComponent(messagePublicId)}`,
  );
}