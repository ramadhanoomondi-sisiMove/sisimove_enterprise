// -----------------------------------------------------------------------------
// sisiMove — Leave Messaging Conversation API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Call the authenticated endpoint that transitions the current participant
//   out of a conversation.
//
// Non-responsibilities:
// - Determining whether the current member may leave.
// - Mutating local participant state.
// - Aggregate lifecycle logic.
// - Authorization decisions.
// - Domain/model mapping.
// - Date conversion.
//
// The current authenticated member is intentionally not supplied as a
// memberPublicId. The backend should derive the acting identity from the
// authenticated session.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Raw response
// -----------------------------------------------------------------------------
//
// Leaving a conversation returns the resulting participant representation.
// -----------------------------------------------------------------------------

export interface LeaveMessagingConversationApiResponse {
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

export async function leaveMessagingConversation(
  conversationPublicId: string,
): Promise<LeaveMessagingConversationApiResponse> {
  return authenticatedApiClient.post<LeaveMessagingConversationApiResponse>(
    `/messaging/conversations/${encodeURIComponent(
      conversationPublicId,
    )}/participants/leave`,
  );
}