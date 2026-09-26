// -----------------------------------------------------------------------------
// SisiMove — Messaging Conversation Presentation Labels
// -----------------------------------------------------------------------------
//
// Stable human-readable labels for Messaging Conversation values.
//
// This file contains presentation labels only.
// It does not implement business logic.
// -----------------------------------------------------------------------------

import type { MessagingConversationStatus } from '../models/messaging-conversation-status';
import type { MessagingConversationType } from '../models/messaging-conversation-type';

import { MESSAGING_CONVERSATION_STATUSES } from '../models/messaging-conversation-status';
import { MESSAGING_CONVERSATION_TYPES } from '../models/messaging-conversation-type';

// =============================================================================
// Conversation Type Labels
// =============================================================================

export const MESSAGING_CONVERSATION_TYPE_LABELS: Record<
  MessagingConversationType,
  string
> = {
  [MESSAGING_CONVERSATION_TYPES.JOURNEY]: 'Journey',
  [MESSAGING_CONVERSATION_TYPES.DIRECT]: 'Direct',
};

// =============================================================================
// Conversation Status Labels
// =============================================================================

export const MESSAGING_CONVERSATION_STATUS_LABELS: Record<
  MessagingConversationStatus,
  string
> = {
  [MESSAGING_CONVERSATION_STATUSES.ACTIVE]: 'Active',
  [MESSAGING_CONVERSATION_STATUSES.CLOSED]: 'Closed',
};

// =============================================================================
// Label Helpers
// =============================================================================

export function getMessagingConversationTypeLabel(
  type: MessagingConversationType,
): string {
  return MESSAGING_CONVERSATION_TYPE_LABELS[type];
}

export function getMessagingConversationStatusLabel(
  status: MessagingConversationStatus,
): string {
  return MESSAGING_CONVERSATION_STATUS_LABELS[status];
}