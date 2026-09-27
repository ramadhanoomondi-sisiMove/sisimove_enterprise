// -----------------------------------------------------------------------------
// sisiMove — Support Case Messages Query Hook
// -----------------------------------------------------------------------------
//
// React Query boundary for Support Case messages.
//
// Responsibilities:
//
// - retrieve messages through the Support message API;
// - map transport responses into SupportCaseMessage models;
// - expose React Query state.
//
// Non-responsibilities:
//
// - determining whether a message is editable/deletable;
// - resolving sender profiles;
// - resolving message Assets;
// - managing message mutations;
// - implementing Support aggregate rules.
// -----------------------------------------------------------------------------

'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getSupportCaseMessages,
  type SupportCaseMessageResponse,
} from '../../api/messages/get-support-case-messages.api';
import { mapSupportCaseMessage } from '../../mappers/support-case-message.mapper';

// =============================================================================
// Query Key
// =============================================================================

export function supportCaseMessagesQueryKey(
  supportCasePublicId: string,
) {
  return ['support', 'case', supportCasePublicId, 'messages'] as const;
}

// =============================================================================
// Query Hook
// =============================================================================

/**
 * Loads messages belonging to a Support Case.
 */
export function useSupportCaseMessages(
  supportCasePublicId: string | undefined,
) {
  return useQuery({
    queryKey: supportCasePublicId
      ? supportCaseMessagesQueryKey(supportCasePublicId)
      : ['support', 'case', 'disabled', 'messages'] as const,

    queryFn: async () => {
      if (!supportCasePublicId) {
        throw new Error(
          'Support Case public ID is required to fetch messages.',
        );
      }

      const responses: SupportCaseMessageResponse[] =
        await getSupportCaseMessages(supportCasePublicId);

      return responses.map(mapSupportCaseMessage);
    },

    enabled: Boolean(supportCasePublicId),
  });
}