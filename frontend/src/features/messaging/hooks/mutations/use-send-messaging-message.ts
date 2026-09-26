// -----------------------------------------------------------------------------
// sisiMove — useSendMessagingMessage
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the send-message command.
// - Map the created message.
// - Update the individual message cache.
// - Invalidate the affected conversation message collection/conversation.
//
// Non-responsibilities:
// - Conversation membership validation.
// - Sender authorization.
// - Message lifecycle rules.
// - Real-time delivery.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  sendMessagingMessage,
  type SendMessagingMessageCommand,
} from '../../api';

import {
  messagingMessageMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
  messagingMessageKeys,
} from '../query-keys';

export function useSendMessagingMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationPublicId,
      command,
    }: {
      conversationPublicId: string;
      command: SendMessagingMessageCommand;
    }) => {
      const response = await sendMessagingMessage(
        conversationPublicId,
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

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: messagingConversationKeys.messages(
            message.conversationPublicId,
          ),
        }),

        queryClient.invalidateQueries({
          queryKey: messagingConversationKeys.detail(
            message.conversationPublicId,
          ),
        }),
      ]);
    },
  });
}