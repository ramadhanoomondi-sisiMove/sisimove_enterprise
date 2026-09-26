// -----------------------------------------------------------------------------
// sisiMove — Add Messaging Conversation Participant API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Define the command payload for adding a participant.
// - Define the raw backend response contract.
// - Call the authenticated Messaging HTTP endpoint.
//
// Non-responsibilities:
// - Participant authorization.
// - Conversation membership rules.
// - Role validation.
// - Aggregate orchestration.
// - Domain/model mapping.
// - Date conversion.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export interface AddMessagingConversationParticipantCommand {
  /**
   * Identity/member public identifier being added to the conversation.
   */
  memberPublicId: string;

  /**
   * Participant role assigned by the backend/domain.
   */
  role: string;
}

// -----------------------------------------------------------------------------
// Raw response
// -----------------------------------------------------------------------------

export interface AddMessagingConversationParticipantApiResponse {
  publicId: string;

  conversationPublicId: string;

  memberPublicId: string;

  role: string;

  isProvider: boolean;

  isPassenger: boolean;

  status: string;

  isActive: boolean;

  hasLeft: boolean;

  isRemoved: boolean;

  isUsable: boolean;

  canBeModified: boolean;

  canLeave: boolean;

  canBeRemoved: boolean;

  canReadMessages: boolean;

  canSendMessages: boolean;

  hasReadPosition: boolean;

  lastReadAt?: string;

  joinedAt: string;

  leftAt?: string;

  removedAt?: string;

  createdAt: string;

  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function addMessagingConversationParticipant(
  conversationPublicId: string,
  command: AddMessagingConversationParticipantCommand,
): Promise<AddMessagingConversationParticipantApiResponse> {
  return authenticatedApiClient.post<
    AddMessagingConversationParticipantApiResponse
  >(
    `/messaging/conversations/${encodeURIComponent(
      conversationPublicId,
    )}/participants`,
    command,
  );
}