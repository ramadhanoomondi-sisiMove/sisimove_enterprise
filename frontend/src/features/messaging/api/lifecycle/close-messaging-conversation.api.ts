// -----------------------------------------------------------------------------
// sisiMove — Close Messaging Conversation API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Call the authenticated endpoint that closes a conversation.
// - Preserve the raw backend response.
//
// Non-responsibilities:
// - Determining whether the conversation can be closed.
// - Local lifecycle transitions.
// - Aggregate orchestration.
// - Authorization decisions.
// - Domain/model mapping.
// - Date conversion.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Raw response
// -----------------------------------------------------------------------------

export interface CloseMessagingConversationApiResponse {
  publicId: string;

  journeyPublicId: string;

  bookingPublicId?: string;

  type: string;

  status: string;

  isJourneyConversation: boolean;

  isDirectConversation: boolean;

  isActive: boolean;

  isClosed: boolean;

  isUsable: boolean;

  canBeModified: boolean;

  canReceiveMessages: boolean;

  canBeClosed: boolean;

  hasBooking: boolean;

  participantCount: number;

  hasParticipants: boolean;

  participants: unknown[];

  messageCount: number;

  hasMessages: boolean;

  messages: unknown[];

  lastMessageAt?: string;

  closedAt?: string;

  createdAt: string;

  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function closeMessagingConversation(
  conversationPublicId: string,
): Promise<CloseMessagingConversationApiResponse> {
  return authenticatedApiClient.post<CloseMessagingConversationApiResponse>(
    `/messaging/conversations/${encodeURIComponent(
      conversationPublicId,
    )}/close`,
  );
}