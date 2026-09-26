// -----------------------------------------------------------------------------
// sisiMove — useLeaveMessagingConversation
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the current-member leave command.
// - Map the resulting participant.
// - Invalidate affected participant/conversation caches.
//
// Non-responsibilities:
// - Determining whether leaving is permitted.
// - Local lifecycle transitions.
// - Authorization.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  leaveMessagingConversation,
} from '../../api';

import {
  messagingConversationParticipantMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
} from '../query-keys';

export function useLeaveMessagingConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      conversationPublicId: string,
    ) => {
      const response =
        await leaveMessagingConversation(
          conversationPublicId,
        );

      return messagingConversationParticipantMapper.map(
        response,
      );
    },

    onSuccess: async (
      participant,
      conversationPublicId,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: messagingConversationKeys.participants(
            conversationPublicId,
          ),
        }),

        queryClient.invalidateQueries({
          queryKey: messagingConversationKeys.detail(
            conversationPublicId,
          ),
        }),
      ]);

      queryClient.setQueryData(
        messagingConversationKeys.participant(
          conversationPublicId,
          participant.publicId,
        ),
        participant,
      );
    },
  });
}