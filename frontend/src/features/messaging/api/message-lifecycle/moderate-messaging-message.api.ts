// -----------------------------------------------------------------------------
// sisiMove — Moderate Messaging Message API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Define the moderation command payload.
// - Define the raw backend response contract.
// - Call the authenticated Messaging HTTP endpoint.
//
// Non-responsibilities:
// - Performing moderation itself.
// - Deciding moderation policy.
// - Authorization decisions.
// - Message lifecycle orchestration.
// - Domain/model mapping.
// - Date conversion.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export interface ModerateMessagingMessageCommand {
  /**
   * Optional moderation reason supplied by the moderation workflow.
   *
   * The backend remains responsible for deciding whether a reason is required,
   * accepted, persisted, or exposed.
   */
  reason?: string;
}

// -----------------------------------------------------------------------------
// Raw response
// -----------------------------------------------------------------------------

export interface ModerateMessagingMessageApiResponse {
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

export async function moderateMessagingMessage(
  messagePublicId: string,
  command?: ModerateMessagingMessageCommand,
): Promise<ModerateMessagingMessageApiResponse> {
  return authenticatedApiClient.post<ModerateMessagingMessageApiResponse>(
    `/messaging/messages/${encodeURIComponent(messagePublicId)}/moderate`,
    command,
  );
}