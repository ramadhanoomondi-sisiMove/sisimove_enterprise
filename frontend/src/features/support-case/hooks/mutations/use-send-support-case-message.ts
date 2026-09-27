// -----------------------------------------------------------------------------
// sisiMove — Send Support Case Message Mutation Hook
// -----------------------------------------------------------------------------
//
// React Query mutation boundary for sending a Support Case message.
//
// A successful message changes both:
//
// - the case's message collection/count state;
// - the case's aggregate response.
//
// Therefore both the message query and parent case query are invalidated.
//
// The hook does not perform optimistic message insertion. The backend response
// remains authoritative for message identity, timestamps, lifecycle flags, and
// aggregate state.
// -----------------------------------------------------------------------------

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  sendSupportCaseMessage,
  type SendSupportCaseMessageRequest,
} from '../../api/messages/send-support-case-message.api';
import { mapSupportCaseMessage } from '../../mappers/support-case-message.mapper';

import { supportCaseQueryKey } from '../queries/use-support-case';
import { supportCaseMessagesQueryKey } from '../queries/use-support-case-messages';

// =============================================================================
// Variables
// =============================================================================

export interface SendSupportCaseMessageVariables {
  supportCasePublicId: string;
  request: SendSupportCaseMessageRequest;
}

// =============================================================================
// Mutation Hook
// =============================================================================

/**
 * Sends a message to a Support Case.
 */
export function useSendSupportCaseMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      supportCasePublicId,
      request,
    }: SendSupportCaseMessageVariables) => {
      const response = await sendSupportCaseMessage(
        supportCasePublicId,
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