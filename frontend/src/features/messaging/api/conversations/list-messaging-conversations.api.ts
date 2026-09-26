// -----------------------------------------------------------------------------
// sisiMove — List Messaging Conversations API
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Define the frontend-facing query contract for listing conversations.
// - Call the authenticated Messaging HTTP endpoint.
// - Preserve the raw backend response shape.
// - Pass pagination parameters through to the HTTP client.
//
// Non-responsibilities:
// - Domain mapping.
// - Date transformation.
// - Authentication/session management.
// - Authorization decisions.
// - React Query caching.
// - Business rules.
//
// The HTTP client intentionally accepts a generic Record<string, ...> for
// query parameters. We therefore adapt the strongly typed feature query object
// into that infrastructure shape at this boundary.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export interface ListMessagingConversationsQuery {
  /**
   * Requested result page.
   *
   * The backend remains responsible for validating the actual pagination
   * constraints.
   */
  page?: number;

  /**
   * Maximum number of conversations requested for the page.
   *
   * The backend remains responsible for validating the actual limit.
   */
  limit?: number;
}

// -----------------------------------------------------------------------------
// Raw participant response
// -----------------------------------------------------------------------------

export interface ListMessagingConversationsParticipantResponse {
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
// Raw message response
// -----------------------------------------------------------------------------

export interface ListMessagingConversationsMessageResponse {
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
// Raw conversation response
// -----------------------------------------------------------------------------

export interface ListMessagingConversationsApiResponse {
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

  participants: ListMessagingConversationsParticipantResponse[];

  messageCount: number;
  hasMessages: boolean;

  messages: ListMessagingConversationsMessageResponse[];

  lastMessageAt?: string;
  closedAt?: string;

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export async function listMessagingConversations(
  query?: ListMessagingConversationsQuery,
): Promise<ListMessagingConversationsApiResponse[]> {
  /**
   * The feature-level query is intentionally strongly typed.
   *
   * authenticatedApiClient.get() accepts a generic Record<string, primitive>
   * query object instead. Creating the object explicitly here keeps that
   * infrastructure concern out of the rest of the Messaging feature.
   *
   * We also omit undefined values rather than serializing them ourselves.
   * This leaves query-string serialization to the shared ApiClient.
   */
  const queryParameters: Record<
    string,
    string | number | boolean | null | undefined
  > = {
    page: query?.page,
    limit: query?.limit,
  };

  return authenticatedApiClient.get<
    ListMessagingConversationsApiResponse[]
  >('/messaging/conversations', {
    query: queryParameters,
  });
}