// -----------------------------------------------------------------------------
// SisiMove — Messaging Conversation API
// -----------------------------------------------------------------------------
//
// Central export surface for Messaging Conversation HTTP adapters.
//
// Responsibilities:
//
// - Re-export conversation API functions.
// - Re-export conversation API contracts.
// - Provide a stable import boundary.
//
// Non-responsibilities:
//
// - HTTP implementation.
// - Response mapping.
// - Domain logic.
// - React Query integration.
// - Business rules.
//
// This barrel contains no business logic.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Get Conversation
// =============================================================================

export {
  getMessagingConversation,
  type GetMessagingConversationApiResponse,
  type GetMessagingConversationParticipantApiResponse,
  type GetMessagingConversationMessageApiResponse,
} from './get-messaging-conversation.api';

// =============================================================================
// List Conversations
// =============================================================================

export {
  listMessagingConversations,
  type ListMessagingConversationsQuery,
  type ListMessagingConversationsApiResponse,
  type ListMessagingConversationsParticipantResponse,
  type ListMessagingConversationsMessageResponse,
} from './list-messaging-conversations.api';

