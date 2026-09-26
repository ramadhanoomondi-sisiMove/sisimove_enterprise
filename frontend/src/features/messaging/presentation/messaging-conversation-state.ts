// -----------------------------------------------------------------------------
// SisiMove — Messaging Conversation Presentation State
// -----------------------------------------------------------------------------
//
// Presentation-only interpretation of MessagingConversation state.
//
// Responsibilities:
// - classify conversation lifecycle state for UI;
// - expose backend-provided capability predicates;
// - provide stable presentation helpers.
//
// Non-responsibilities:
// - authorization;
// - business-rule enforcement;
// - state mutation;
// - API calls;
// - data fetching;
// - lifecycle transitions.
//
// The backend remains authoritative for conversation state and capabilities.
// -----------------------------------------------------------------------------

import type { MessagingConversation } from '../models';

import { MESSAGING_CONVERSATION_STATUSES } from '../models/messaging-conversation-status';

// =============================================================================
// Presentation State
// =============================================================================

export type MessagingConversationPresentationState =
  | 'active'
  | 'closed';

// =============================================================================
// State Resolution
// =============================================================================

export function getMessagingConversationPresentationState(
  conversation: MessagingConversation,
): MessagingConversationPresentationState {
  if (
    conversation.status === MESSAGING_CONVERSATION_STATUSES.CLOSED ||
    conversation.isClosed
  ) {
    return 'closed';
  }

  return 'active';
}

// =============================================================================
// Lifecycle Predicates
// =============================================================================

export function isMessagingConversationActive(
  conversation: MessagingConversation,
): boolean {
  return conversation.isActive;
}

export function isMessagingConversationClosed(
  conversation: MessagingConversation,
): boolean {
  return conversation.isClosed;
}

export function canMessagingConversationReceiveMessages(
  conversation: MessagingConversation,
): boolean {
  return conversation.canReceiveMessages;
}

export function canMessagingConversationBeClosed(
  conversation: MessagingConversation,
): boolean {
  return conversation.canBeClosed;
}

export function canMessagingConversationBeModified(
  conversation: MessagingConversation,
): boolean {
  return conversation.canBeModified;
}