// -----------------------------------------------------------------------------
// sisiMove — Send Messaging Message API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Define the command payload for sending a message.
// - Define the raw backend response contract.
// - Call the authenticated Messaging HTTP endpoint.
//
// Non-responsibilities:
// - Conversation membership validation.
// - Message lifecycle orchestration.
// - Asset validation/resolution.
// - Authorization decisions.
// - Domain/model mapping.
// - Date conversion.
// - React Query caching.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export interface SendMessagingMessageCommand {
  /**
   * Message type accepted by the Messaging backend.
   *
   * Expected domain values currently include:
   * TEXT, IMAGE, FILE, SYSTEM.
   */
  type: string;

  /**
   * Textual message content.
   *
   * Required by the backend for TEXT and SYSTEM messages.
   * Optional for IMAGE and FILE messages.
   */
  content?: string;

  /**
   * Optional public Asset identifier.
   *
   * Required by the backend for IMAGE and FILE messages.
   */
  assetPublicId?: string;
}

// -----------------------------------------------------------------------------
// Raw response
// -----------------------------------------------------------------------------

export interface SendMessagingMessageApiResponse {
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

export async function sendMessagingMessage(
  conversationPublicId: string,
  command: SendMessagingMessageCommand,
): Promise<SendMessagingMessageApiResponse> {
  return authenticatedApiClient.post<SendMessagingMessageApiResponse>(
    `/messaging/conversations/${encodeURIComponent(
      conversationPublicId,
    )}/messages`,
    command,
  );
}