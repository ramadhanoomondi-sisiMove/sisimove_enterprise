// -----------------------------------------------------------------------------
// sisiMove — useRemoveMessagingConversationParticipant
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the remove-participant command.
// - Map the resulting participant.
// - Invalidate affected participant/conversation caches.
//
// Non-responsibilities:
// - Authorization.
// - Determining whether removal is permitted.
// - Participant lifecycle decisions.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  removeMessagingConversationParticipant,
  type RemoveMessagingConversationParticipantCommand,
} from '../../api';

import {
  messagingConversationParticipantMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
} from '../query-keys';

export function useRemoveMessagingConversationParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationPublicId,
      command,
    }: {
      conversationPublicId: string;
      command: RemoveMessagingConversationParticipantCommand;
    }) => {
      const response =
        await removeMessagingConversationParticipant(
          conversationPublicId,
          command,
        );

      return messagingConversationParticipantMapper.map(
        response,
      );
    },

    onSuccess: async (
      participant,
      variables,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: messagingConversationKeys.participants(
            variables.conversationPublicId,
          ),
        }),

        queryClient.invalidateQueries({
          queryKey: messagingConversationKeys.detail(
            variables.conversationPublicId,
          ),
        }),
      ]);

      queryClient.setQueryData(
        messagingConversationKeys.participant(
          variables.conversationPublicId,
          participant.publicId,
        ),
        participant,
      );
    },
  });
}