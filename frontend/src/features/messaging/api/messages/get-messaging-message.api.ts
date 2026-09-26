// -----------------------------------------------------------------------------
// sisiMove — Get Messaging Message API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Define the raw HTTP response contract for one Messaging message.
// - Call the authenticated Messaging HTTP endpoint.
// - Preserve backend-provided serialized values.
//
// Non-responsibilities:
// - Domain/model mapping.
// - Date conversion.
// - Authorization decisions.
// - Message lifecycle logic.
// - React Query caching.
// - Asset resolution.
// - Conversation membership validation.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Raw message response
// -----------------------------------------------------------------------------

export interface GetMessagingMessageApiResponse {
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

export async function getMessagingMessage(
  messagePublicId: string,
): Promise<GetMessagingMessageApiResponse> {
  return authenticatedApiClient.get<GetMessagingMessageApiResponse>(
    `/messaging/messages/${encodeURIComponent(messagePublicId)}`,
  );
}