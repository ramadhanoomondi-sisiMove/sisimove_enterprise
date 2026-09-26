// -----------------------------------------------------------------------------
// sisiMove — useDeleteMessagingMessage
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the delete-message command.
// - Map the resulting message.
// - Update the individual message cache.
// - Invalidate the affected conversation message collection.
//
// Non-responsibilities:
// - Determining delete permissions.
// - Message lifecycle validation.
// - Conversation membership validation.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  deleteMessagingMessage,
} from '../../api';

import {
  messagingMessageMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
  messagingMessageKeys,
} from '../query-keys';

export function useDeleteMessagingMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      messagePublicId: string,
    ) => {
      const response = await deleteMessagingMessage(
        messagePublicId,
      );

      return messagingMessageMapper.map(response);
    },

    onSuccess: async (message) => {
      queryClient.setQueryData(
        messagingMessageKeys.detail(
          message.publicId,
        ),
        message,
      );

      await queryClient.invalidateQueries({
        queryKey: messagingConversationKeys.messages(
          message.conversationPublicId,
        ),
      });
    },
  });
}