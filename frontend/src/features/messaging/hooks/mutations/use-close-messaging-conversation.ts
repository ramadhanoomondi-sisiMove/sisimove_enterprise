// -----------------------------------------------------------------------------
// sisiMove — useCloseMessagingConversation
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the close-conversation command.
// - Map the resulting conversation.
// - Update the individual conversation cache.
// - Invalidate conversation collections.
//
// Non-responsibilities:
// - Deciding whether closure is permitted.
// - Conversation lifecycle logic.
// - Authorization.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  closeMessagingConversation,
} from '../../api';

import {
  messagingConversationMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
} from '../query-keys';

export function useCloseMessagingConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      conversationPublicId: string,
    ) => {
      const response =
        await closeMessagingConversation(
          conversationPublicId,
        );

      return messagingConversationMapper.map(response);
    },

    onSuccess: async (conversation) => {
      queryClient.setQueryData(
        messagingConversationKeys.detail(
          conversation.publicId,
        ),
        conversation,
      );

      await queryClient.invalidateQueries({
        queryKey: messagingConversationKeys.lists(),
      });
    },
  });
}