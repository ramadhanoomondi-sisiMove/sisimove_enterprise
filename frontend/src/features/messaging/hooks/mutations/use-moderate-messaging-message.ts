// -----------------------------------------------------------------------------
// sisiMove — useModerateMessagingMessage
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Execute the moderate-message command.
// - Map the resulting message.
// - Update the individual message cache.
// - Invalidate the affected conversation message collection.
//
// Non-responsibilities:
// - Moderation policy.
// - Determining moderation permissions.
// - Message lifecycle validation.
// - External moderation.
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  moderateMessagingMessage,
  type ModerateMessagingMessageCommand,
} from '../../api';

import {
  messagingMessageMapper,
} from '../../mappers';

import {
  messagingConversationKeys,
  messagingMessageKeys,
} from '../query-keys';

export function useModerateMessagingMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messagePublicId,
      command,
    }: {
      messagePublicId: string;
      command?: ModerateMessagingMessageCommand;
    }) => {
      const response = await moderateMessagingMessage(
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