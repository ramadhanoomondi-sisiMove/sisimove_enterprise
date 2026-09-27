// -----------------------------------------------------------------------------
// sisiMove — Edit Support Case Message Mutation Hook
// -----------------------------------------------------------------------------
//
// React Query mutation boundary for editing a Support Case message.
//
// A successful edit changes the message collection and the parent case's
// message projection. The server remains authoritative for editedAt,
// updatedAt, isEdited, and isDeleted.
//
// -----------------------------------------------------------------------------

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  editSupportCaseMessage,
  type EditSupportCaseMessageRequest,
} from '../../api/messages/edit-support-case-message.api';
import { mapSupportCaseMessage } from '../../mappers/support-case-message.mapper';

import { supportCaseQueryKey } from '../queries/use-support-case';
import { supportCaseMessagesQueryKey } from '../queries/use-support-case-messages';

// =============================================================================
// Variables
// =============================================================================

export interface EditSupportCaseMessageVariables {
  supportCasePublicId: string;
  messagePublicId: string;
  request: EditSupportCaseMessageRequest;
}

// =============================================================================
// Mutation Hook
// =============================================================================

/**
 * Edits an existing Support Case message.
 */
export function useEditSupportCaseMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      supportCasePublicId,
      messagePublicId,
      request,
    }: EditSupportCaseMessageVariables) => {
      const response = await editSupportCaseMessage(
        supportCasePublicId,
        messagePublicId,
        request,
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