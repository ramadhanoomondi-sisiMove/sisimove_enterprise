// -----------------------------------------------------------------------------
// sisiMove — useMessagingConversationMessages
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch messages belonging to one Messaging conversation.
// - Map raw message responses into MessagingMessage models.
// - Provide React Query cache/state management.
//
// Non-responsibilities:
// - Sending/editing/deleting messages.
// - Authorization.
// - Conversation membership validation.
// - Pagination business rules.
// - Real-time transport.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getMessagingConversationMessages,
  type GetMessagingConversationMessagesQuery,
} from '../../api';

import {
  messagingMessageMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
} from '../query-keys';

export function useMessagingConversationMessages(
  conversationPublicId: string | undefined,
  query?: GetMessagingConversationMessagesQuery,
) {
  return useQuery({
    queryKey: conversationPublicId
      ? messagingConversationKeys.messages(
          conversationPublicId,
          query,
        )
      : messagingConversationKeys.all,

    queryFn: async () => {
      if (!conversationPublicId) {
        throw new Error(
          'conversationPublicId is required to load Messaging messages.',
        );
      }

      const response =
        await getMessagingConversationMessages(
          conversationPublicId,
          query,
        );

      return messagingMessageMapper.mapMany(response);
    },

    enabled: Boolean(conversationPublicId),
  });
}