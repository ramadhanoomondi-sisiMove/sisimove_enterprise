// -----------------------------------------------------------------------------
// sisiMove — Get Messaging Conversation Participant API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Define the raw HTTP response contract for one participant.
// - Call the authenticated Messaging HTTP endpoint.
// - Preserve backend-provided serialized values.
//
// Non-responsibilities:
// - Domain/model mapping.
// - Date conversion.
// - Authorization decisions.
// - Participant lifecycle logic.
// - React Query caching.
// - Identity/profile resolution.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Raw participant response
// -----------------------------------------------------------------------------

export interface GetMessagingConversationParticipantApiResponse {
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

export async function getMessagingConversationParticipant(
  conversationPublicId: string,
  participantPublicId: string,
): Promise<GetMessagingConversationParticipantApiResponse> {
  return authenticatedApiClient.get<
    GetMessagingConversationParticipantApiResponse
  >(
    `/messaging/conversations/${encodeURIComponent(
      conversationPublicId,
    )}/participants/${encodeURIComponent(participantPublicId)}`,
  );
}