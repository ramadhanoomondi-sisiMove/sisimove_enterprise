// -----------------------------------------------------------------------------
// sisiMove — useMessagingMessage
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch one Messaging message.
// - Map the raw API response into MessagingMessage.
// - Provide React Query cache/state management.
//
// Non-responsibilities:
// - Message lifecycle mutations.
// - Authorization.
// - Conversation membership validation.
// - Asset resolution.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  getMessagingMessage,
} from '../../api';

import {
  messagingMessageMapper,
} from '../../mappers';

import {
  messagingMessageKeys,
} from '../query-keys';

export function useMessagingMessage(
  messagePublicId: string | undefined,
) {
  return useQuery({
    queryKey: messagePublicId
      ? messagingMessageKeys.detail(messagePublicId)
      : messagingMessageKeys.details(),

    queryFn: async () => {
      if (!messagePublicId) {
        throw new Error(
          'messagePublicId is required to load a Messaging message.',
        );
      }

      const response = await getMessagingMessage(
        messagePublicId,
      );

      return messagingMessageMapper.map(response);
    },

    enabled: Boolean(messagePublicId),
  });
}