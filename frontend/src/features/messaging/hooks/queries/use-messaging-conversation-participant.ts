// -----------------------------------------------------------------------------
// sisiMove — useMessagingConversationParticipant
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch one participant belonging to a Messaging conversation.
// - Map the raw response into MessagingConversationParticipant.
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
  getMessagingConversationParticipant,
} from '../../api';

import {
  messagingConversationParticipantMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
} from '../query-keys';

export function useMessagingConversationParticipant(
  conversationPublicId: string | undefined,
  participantPublicId: string | undefined,
) {
  return useQuery({
    queryKey:
      conversationPublicId && participantPublicId
        ? messagingConversationKeys.participant(
            conversationPublicId,
            participantPublicId,
          )
        : messagingConversationKeys.all,

    queryFn: async () => {
      if (!conversationPublicId) {
        throw new Error(
          'conversationPublicId is required to load a Messaging participant.',
        );
      }

      if (!participantPublicId) {
        throw new Error(
          'participantPublicId is required to load a Messaging participant.',
        );
      }

      const response =
        await getMessagingConversationParticipant(
          conversationPublicId,
          participantPublicId,
        );

      return messagingConversationParticipantMapper.map(
        response,
      );
    },

    enabled: Boolean(
      conversationPublicId && participantPublicId,
    ),
  });
}