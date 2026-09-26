// -----------------------------------------------------------------------------
// sisiMove — Create Messaging Conversation API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Define the command payload required to create a conversation.
// - Define the raw backend response contract.
// - Call the authenticated Messaging HTTP endpoint.
// - Preserve backend-provided serialized values.
//
// Non-responsibilities:
// - Conversation aggregate creation.
// - Participant creation.
// - Authorization decisions.
// - Journey/booking validation.
// - Domain/model mapping.
// - Date conversion.
// - React Query caching.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export interface CreateMessagingConversationCommand {
  /**
   * Conversation type as accepted by the backend.
   *
   * The API layer deliberately keeps this as a string because the backend
   * remains the source of truth for its HTTP contract. The mapper/model layer
   * is responsible for converting known values into MessagingConversationType.
   */
  type: string;

  /**
   * Journey public identifier associated with the conversation.
   */
  journeyPublicId: string;

  /**
   * Optional booking public identifier.
   */
  bookingPublicId?: string;
}

// -----------------------------------------------------------------------------
// Raw response
// -----------------------------------------------------------------------------

export interface CreateMessagingConversationApiResponse {
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

export async function createMessagingConversation(
  command: CreateMessagingConversationCommand,
): Promise<CreateMessagingConversationApiResponse> {
  return authenticatedApiClient.post<
    CreateMessagingConversationApiResponse
  >('/messaging/conversations', command);
}