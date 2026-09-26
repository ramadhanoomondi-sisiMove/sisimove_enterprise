// -----------------------------------------------------------------------------
// sisiMove — useMessagingConversation
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch one Messaging conversation.
// - Map the raw API response into MessagingConversation.
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
  getMessagingConversation,
} from '../../api';

import {
  messagingConversationMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
} from '../query-keys';

export function useMessagingConversation(
  conversationPublicId: string | undefined,
) {
  return useQuery({
    queryKey: conversationPublicId
      ? messagingConversationKeys.detail(conversationPublicId)
      : messagingConversationKeys.details(),

    queryFn: async () => {
      if (!conversationPublicId) {
        throw new Error(
          'conversationPublicId is required to load a Messaging conversation.',
        );
      }

      const response = await getMessagingConversation(
        conversationPublicId,
      );

      return messagingConversationMapper.map(response);
    },

    enabled: Boolean(conversationPublicId),
  });
}