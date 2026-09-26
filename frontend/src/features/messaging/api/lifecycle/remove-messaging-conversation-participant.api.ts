// -----------------------------------------------------------------------------
// sisiMove — Remove Messaging Conversation Participant API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Define the command payload for removing a participant.
// - Define the raw backend response contract.
// - Call the authenticated Messaging HTTP endpoint.
//
// Non-responsibilities:
// - Deciding whether the acting member may remove the participant.
// - Participant lifecycle orchestration.
// - Aggregate validation.
// - Domain/model mapping.
// - Date conversion.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Raw response
// -----------------------------------------------------------------------------

export interface RemoveMessagingConversationParticipantApiResponse {
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
// Command
// -----------------------------------------------------------------------------

export interface RemoveMessagingConversationParticipantCommand {
  /**
   * Public identifier of the participant being removed.
   */
  participantPublicId: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function removeMessagingConversationParticipant(
  conversationPublicId: string,
  command: RemoveMessagingConversationParticipantCommand,
): Promise<RemoveMessagingConversationParticipantApiResponse> {
  return authenticatedApiClient.post<
    RemoveMessagingConversationParticipantApiResponse
  >(
    `/messaging/conversations/${encodeURIComponent(
      conversationPublicId,
    )}/participants/${encodeURIComponent(
      command.participantPublicId,
    )}/remove`,
  );
}