// -----------------------------------------------------------------------------
// sisiMove — Edit Messaging Message API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Define the command payload for editing a message.
// - Define the raw backend response contract.
// - Call the authenticated Messaging HTTP endpoint.
//
// Non-responsibilities:
// - Determining whether the current member may edit the message.
// - Message lifecycle orchestration.
// - Conversation membership validation.
// - Domain/model mapping.
// - Date conversion.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export interface EditMessagingMessageCommand {
  /**
   * Replacement textual content.
   *
   * The Messaging message aggregate is responsible for validating the
   * resulting message content and lifecycle transition.
   */
  content: string;
}

// -----------------------------------------------------------------------------
// Raw response
// -----------------------------------------------------------------------------

export interface EditMessagingMessageApiResponse {
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

export async function editMessagingMessage(
  messagePublicId: string,
  command: EditMessagingMessageCommand,
): Promise<EditMessagingMessageApiResponse> {
  return authenticatedApiClient.patch<EditMessagingMessageApiResponse>(
    `/messaging/messages/${encodeURIComponent(messagePublicId)}`,
    command,
  );
}