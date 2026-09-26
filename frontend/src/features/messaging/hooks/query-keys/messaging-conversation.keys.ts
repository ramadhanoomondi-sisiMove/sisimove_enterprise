// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Query Keys
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide stable React Query keys for Messaging conversation resources.
// - Establish the canonical cache-key hierarchy for the feature.
//
// Non-responsibilities:
// - HTTP requests.
// - Data fetching.
// - Mapping.
// - Cache invalidation itself.
// - Business/domain logic.
//
// Query-key hierarchy:
//
//   ['messaging', 'conversations']
//   ['messaging', 'conversations', 'list', query]
//   ['messaging', 'conversations', 'detail', conversationPublicId]
//   ['messaging', 'conversations', conversationPublicId, 'participants']
//   ['messaging', 'conversations', conversationPublicId, 'participant', id]
//   ['messaging', 'conversations', conversationPublicId, 'messages', query]
//
// Keeping the hierarchy explicit allows mutations to invalidate either a
// specific resource or a broader Messaging resource family.
// -----------------------------------------------------------------------------

import type {
  ListMessagingConversationsQuery,
} from '../../api';

// -----------------------------------------------------------------------------
// Query key factory
// -----------------------------------------------------------------------------

export const messagingConversationKeys = {
  /**
   * Root key for the entire Messaging conversation cache.
   */
  all: ['messaging', 'conversations'] as const,

  /**
   * Root key for conversation collections.
   */
  lists: () =>
    [...messagingConversationKeys.all, 'list'] as const,

  /**
   * Key for one paginated/filterable conversation collection.
   *
   * The query object is intentionally included in the key because different
   * pagination parameters represent different cached resources.
   */
  list: (query?: ListMessagingConversationsQuery) =>
    [
      ...messagingConversationKeys.lists(),
      query ?? {},
    ] as const,

  /**
   * Root key for individual conversation resources.
   */
  details: () =>
    [...messagingConversationKeys.all, 'detail'] as const,

  /**
   * Key for one conversation.
   */
  detail: (conversationPublicId: string) =>
    [
      ...messagingConversationKeys.details(),
      conversationPublicId,
    ] as const,

  /**
   * Root key for resources nested under one conversation.
   */
  conversation: (conversationPublicId: string) =>
    [
      ...messagingConversationKeys.all,
      conversationPublicId,
    ] as const,

  /**
   * Participant collection belonging to a conversation.
   */
  participants: (conversationPublicId: string) =>
    [
      ...messagingConversationKeys.conversation(conversationPublicId),
      'participants',
    ] as const,

  /**
   * Individual participant belonging to a conversation.
   */
  participant: (
    conversationPublicId: string,
    participantPublicId: string,
  ) =>
    [
      ...messagingConversationKeys.participants(conversationPublicId),
      participantPublicId,
    ] as const,

  /**
   * Message collection belonging to a conversation.
   */
  messages: (
    conversationPublicId: string,
    query?: {
      page?: number;
      limit?: number;
    },
  ) =>
    [
      ...messagingConversationKeys.conversation(conversationPublicId),
      'messages',
      query ?? {},
    ] as const,
};