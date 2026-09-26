// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Query Keys
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide stable React Query keys for Messaging message resources.
// - Establish the canonical cache-key hierarchy for individual messages.
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
//   ['messaging', 'messages']
//   ['messaging', 'messages', 'detail', messagePublicId]
//
// Conversation message collections remain owned by the conversation query-key
// hierarchy because they are resources scoped to a conversation.
// -----------------------------------------------------------------------------

export const messagingMessageKeys = {
  /**
   * Root key for the entire Messaging message cache.
   */
  all: ['messaging', 'messages'] as const,

  /**
   * Root key for individual message resources.
   */
  details: () =>
    [...messagingMessageKeys.all, 'detail'] as const,

  /**
   * Key for one message.
   */
  detail: (messagePublicId: string) =>
    [
      ...messagingMessageKeys.details(),
      messagePublicId,
    ] as const,
};