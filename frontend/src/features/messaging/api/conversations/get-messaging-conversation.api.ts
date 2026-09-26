// -----------------------------------------------------------------------------
// SisiMove — Get Messaging Conversation API
// -----------------------------------------------------------------------------
//
// Protected HTTP adapter for retrieving a single Messaging Conversation.
//
// Responsibilities:
//
// - Call the authenticated Messaging Conversation endpoint.
// - Pass the conversation public identifier to the backend.
// - Return the backend application response.
// - Keep HTTP concerns inside the API feature boundary.
//
// Non-responsibilities:
//
// - Authentication/session storage.
// - Authorization.
// - Conversation business rules.
// - Participant resolution.
// - Message resolution.
// - Response mapping into frontend domain models.
// - React Query caching.
// - UI state.
//
// HTTP flow:
//
//   Feature
//      │
//      ▼
//   getMessagingConversation()
//      │
//      ▼
//   authenticatedApiClient
//      │
//      ▼
//   GET /messaging/conversations/:conversationPublicId
//      │
//      ▼
//   SisiMove API
//
// IMPORTANT:
//
// This adapter deliberately returns the raw API response shape.
//
// The API response contains serialized timestamps, normally ISO strings.
// Conversion into the frontend MessagingConversation model is the mapper's
// responsibility.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// =============================================================================
// API Response Contract
// =============================================================================

/**
 * Raw Messaging Conversation response returned by the backend.
 *
 * This is intentionally separate from the frontend `MessagingConversation`
 * model because HTTP JSON responses contain serialized Date values.
 *
 * The mapper layer is responsible for converting this contract into the
 * frontend model.
 */
export interface GetMessagingConversationApiResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Messaging Conversation.
   */
  publicId: string;

  // ---------------------------------------------------------------------------
  // Context References
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the associated Journey.
   */
  journeyPublicId: string;

  /**
   * Optional public identifier of the associated Booking.
   */
  bookingPublicId?: string;

  // ---------------------------------------------------------------------------
  // Conversation
  // ---------------------------------------------------------------------------

  /**
   * Messaging Conversation type.
   */
  type: string;

  /**
   * Current Messaging Conversation lifecycle status.
   */
  status: string;

  // ---------------------------------------------------------------------------
  // Conversation Type Predicates
  // ---------------------------------------------------------------------------

  isJourneyConversation: boolean;

  isDirectConversation: boolean;

  // ---------------------------------------------------------------------------
  // Conversation Lifecycle Predicates
  // ---------------------------------------------------------------------------

  isActive: boolean;

  isClosed: boolean;

  isUsable: boolean;

  canBeModified: boolean;

  canReceiveMessages: boolean;

  canBeClosed: boolean;

  // ---------------------------------------------------------------------------
  // Booking
  // ---------------------------------------------------------------------------

  hasBooking: boolean;

  // ---------------------------------------------------------------------------
  // Participants
  // ---------------------------------------------------------------------------

  participants: GetMessagingConversationParticipantApiResponse[];

  participantCount: number;

  hasParticipants: boolean;

  // ---------------------------------------------------------------------------
  // Messages
  // ---------------------------------------------------------------------------

  messages: GetMessagingConversationMessageApiResponse[];

  messageCount: number;

  hasMessages: boolean;

  // ---------------------------------------------------------------------------
  // Activity
  // ---------------------------------------------------------------------------

  /**
   * Serialized timestamp of the most recent message activity.
   */
  lastMessageAt?: string;

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Serialized conversation closure timestamp.
   */
  closedAt?: string;

  /**
   * Serialized creation timestamp.
   */
  createdAt: string;

  /**
   * Serialized last-update timestamp.
   */
  updatedAt: string;
}

// =============================================================================
// Nested API Response Contracts
// =============================================================================

/**
 * Raw participant response embedded in a Messaging Conversation response.
 *
 * This mirrors the backend application response and intentionally keeps
 * timestamps serialized.
 */
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

/**
 * Raw message response embedded in a Messaging Conversation response.
 *
 * This mirrors the backend application response and intentionally keeps
 * timestamps serialized.
 */
export interface GetMessagingConversationMessageApiResponse {
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

// =============================================================================
// Function
// =============================================================================

/**
 * Retrieves one Messaging Conversation by its public identifier.
 *
 * This function performs no local authorization or lifecycle validation.
 *
 * The backend remains authoritative for whether the authenticated member may
 * access the requested conversation.
 */
export async function getMessagingConversation(
  conversationPublicId: string,
): Promise<GetMessagingConversationApiResponse> {
  return authenticatedApiClient.get<GetMessagingConversationApiResponse>(
    `/messaging/conversations/${encodeURIComponent(conversationPublicId)}`,
  );
}