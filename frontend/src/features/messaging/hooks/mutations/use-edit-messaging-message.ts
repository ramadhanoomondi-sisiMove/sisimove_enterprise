// -----------------------------------------------------------------------------
// sisiMove — useEditMessagingMessage
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the edit-message command.
// - Map the resulting message.
// - Update the individual message cache.
// - Invalidate the affected conversation message collection.
//
// Non-responsibilities:
// - Determining edit permissions.
// - Message lifecycle rules.
// - Conversation membership validation.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  editMessagingMessage,
  type EditMessagingMessageCommand,
} from '../../api';

import {
  messagingMessageMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
  messagingMessageKeys,
} from '../query-keys';

export function useEditMessagingMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messagePublicId,
      command,
    }: {
      messagePublicId: string;
      command: EditMessagingMessageCommand;
    }) => {
      const response = await editMessagingMessage(
        messagePublicId,
        command,
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