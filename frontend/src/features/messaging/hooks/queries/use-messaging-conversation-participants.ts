// -----------------------------------------------------------------------------
// sisiMove — useMessagingConversationParticipants
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch participants belonging to one Messaging conversation.
// - Map raw participant responses into MessagingConversationParticipant models.
// - Provide React Query cache/state management.
//
// Non-responsibilities:
// - Participant lifecycle decisions.
// - Authorization.
// - Identity/profile resolution.
// - Conversation mutation.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getMessagingConversationParticipants,
} from '../../api';

import {
  messagingConversationParticipantMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
} from '../query-keys';

export function useMessagingConversationParticipants(
  conversationPublicId: string | undefined,
) {
  return useQuery({
    queryKey: conversationPublicId
      ? messagingConversationKeys.participants(conversationPublicId)
      : messagingConversationKeys.all,

    queryFn: async () => {
      if (!conversationPublicId) {
        throw new Error(
          'conversationPublicId is required to load Messaging conversation participants.',
        );
      }

      const response =
        await getMessagingConversationParticipants(
          conversationPublicId,
        );

      return messagingConversationParticipantMapper.mapMany(
        response,
      );
    },

    enabled: Boolean(conversationPublicId),
  });
}