// -----------------------------------------------------------------------------
// sisiMove — useAddMessagingConversationParticipant
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the add-participant command.
// - Map the raw participant response.
// - Invalidate affected participant/conversation caches.
//
// Non-responsibilities:
// - Authorization.
// - Participant lifecycle validation.
// - Role validation.
// - Aggregate orchestration.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  addMessagingConversationParticipant,
  type AddMessagingConversationParticipantCommand,
} from '../../api';

import {
  messagingConversationParticipantMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
} from '../query-keys';

export function useAddMessagingConversationParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationPublicId,
      command,
    }: {
      conversationPublicId: string;
      command: AddMessagingConversationParticipantCommand;
    }) => {
      const response =
        await addMessagingConversationParticipant(
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