// -----------------------------------------------------------------------------
// sisiMove — useCreateMessagingConversation
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the create-conversation command.
// - Map the raw response into MessagingConversation.
// - Invalidate affected conversation collections.
//
// Non-responsibilities:
// - Domain validation.
// - Authorization.
// - Participant orchestration.
// - Direct cache mutation.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createMessagingConversation,
  type CreateMessagingConversationCommand,
} from '../../api';

import {
  messagingConversationMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
} from '../query-keys';

export function useCreateMessagingConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      command: CreateMessagingConversationCommand,
    ) => {
      const response =
        await createMessagingConversation(command);

      return messagingConversationMapper.map(response);
    },

    onSuccess: async (conversation) => {
      await queryClient.invalidateQueries({
        queryKey: messagingConversationKeys.lists(),
      });

      queryClient.setQueryData(
        messagingConversationKeys.detail(
          conversation.publicId,
        ),
        conversation,
      );
    },
  });
}