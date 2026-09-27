// -----------------------------------------------------------------------------
// sisiMove — Delete Support Case Message Mutation Hook
// -----------------------------------------------------------------------------
//
// React Query mutation boundary for deleting a Support Case message.
//
// The backend owns the deletion lifecycle. The frontend therefore does not
// locally set isDeleted or deletedAt.
//
// After success, both the message collection and parent Support Case projection
// are invalidated so the server-provided state is re-read.
// -----------------------------------------------------------------------------

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteSupportCaseMessage } from '../../api/messages/delete-support-case-message.api';
import { mapSupportCaseMessage } from '../../mappers/support-case-message.mapper';

import { supportCaseQueryKey } from '../queries/use-support-case';
import { supportCaseMessagesQueryKey } from '../queries/use-support-case-messages';

// =============================================================================
// Variables
// =============================================================================

export interface DeleteSupportCaseMessageVariables {
  supportCasePublicId: string;
  messagePublicId: string;
}

// =============================================================================
// Mutation Hook
// =============================================================================

/**
 * Deletes a Support Case message.
 */
export function useDeleteSupportCaseMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      supportCasePublicId,
      messagePublicId,
    }: DeleteSupportCaseMessageVariables) => {
      const response = await deleteSupportCaseMessage(
        supportCasePublicId,
        messagePublicId,
      );

      return mapSupportCaseMessage(response);
    },

    onSuccess: async (_message, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: supportCaseMessagesQueryKey(
            variables.supportCasePublicId,
          ),
        }),

        queryClient.invalidateQueries({
          queryKey: supportCaseQueryKey(
            variables.supportCasePublicId,
          ),
        }),
      ]);
    },
  });
}