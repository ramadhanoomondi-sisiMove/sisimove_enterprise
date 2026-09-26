// -----------------------------------------------------------------------------
// sisiMove — useMessagingConversations
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch the authenticated user's Messaging conversation collection.
// - Map raw API responses into MessagingConversation models.
// - Provide React Query cache/state management.
//
// Non-responsibilities:
// - Authentication/session management.
// - Authorization decisions.
// - Conversation lifecycle mutations.
// - Domain/business rules.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  listMessagingConversations,
  type ListMessagingConversationsQuery,
} from '../../api';

import {
  messagingConversationMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
} from '../query-keys';

export function useMessagingConversations(
  query?: ListMessagingConversationsQuery,
) {
  return useQuery({
    queryKey: messagingConversationKeys.list(query),

    queryFn: async () => {
      const response = await listMessagingConversations(query);

      return messagingConversationMapper.mapMany(response);
    },
  });
}