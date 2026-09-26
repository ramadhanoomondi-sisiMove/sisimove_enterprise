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
  type ListMessagingConversationParticipantApiResponse,
  type ListMessagingConversationMessageApiResponse,
} from './list-messaging-conversations.api';