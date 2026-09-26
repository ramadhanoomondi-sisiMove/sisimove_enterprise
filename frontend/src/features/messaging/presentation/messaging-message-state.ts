// -----------------------------------------------------------------------------
// SisiMove — Messaging Message Presentation State
// -----------------------------------------------------------------------------
//
// Presentation-only interpretation of MessagingMessage state.
//
// The backend remains authoritative for lifecycle and capability predicates.
// The frontend does not reconstruct message lifecycle rules.
// -----------------------------------------------------------------------------

import type { MessagingMessage } from '../models';

import { MESSAGING_MESSAGE_STATUSES } from '../models/messaging-message-status';

// =============================================================================
// Presentation State
// =============================================================================

export type MessagingMessagePresentationState =
  | 'sent'
  | 'edited'
  | 'moderated'
  | 'deleted';

// =============================================================================
// State Resolution
// =============================================================================

export function getMessagingMessagePresentationState(
  message: MessagingMessage,
): MessagingMessagePresentationState {
  if (
    message.status === MESSAGING_MESSAGE_STATUSES.DELETED ||
    message.isDeleted
  ) {
    return 'deleted';
  }

  if (
    message.status === MESSAGING_MESSAGE_STATUSES.MODERATED ||
    message.isModerated
  ) {
    return 'moderated';
  }

  if (
    message.status === MESSAGING_MESSAGE_STATUSES.EDITED ||
    message.isEdited
  ) {
    return 'edited';
  }

  return 'sent';
}

// =============================================================================
// Message Type Predicates
// =============================================================================

export function isMessagingTextMessage(
  message: MessagingMessage,
): boolean {
  return message.isText;
}

export function isMessagingImageMessage(
  message: MessagingMessage,
): boolean {
  return message.isImage;
}

export function isMessagingFileMessage(
  message: MessagingMessage,
): boolean {
  return message.isFile;
}

export function isMessagingSystemMessage(
  message: MessagingMessage,
): boolean {
  return message.isSystem;
}

// =============================================================================
// Lifecycle Predicates
// =============================================================================

export function isMessagingMessageDeleted(
  message: MessagingMessage,
): boolean {
  return message.isDeleted;
}

export function isMessagingMessageEdited(
  message: MessagingMessage,
): boolean {
  return message.isEdited;
}

export function isMessagingMessageModerated(
  message: MessagingMessage,
): boolean {
  return message.isModerated;
}

export function isMessagingMessageUsable(
  message: MessagingMessage,
): boolean {
  return message.isUsable;
}

// =============================================================================
// Capability Predicates
// =============================================================================
//
// These are backend-provided capabilities.
// The frontend must not recreate authorization rules.
//

export function canMessagingMessageBeModified(
  message: MessagingMessage,
): boolean {
  return message.canBeModified;
}

export function canMessagingMessageBeEdited(
  message: MessagingMessage,
): boolean {
  return message.canBeEdited;
}

export function canMessagingMessageBeDeleted(
  message: MessagingMessage,
): boolean {
  return message.canBeDeleted;
}

export function canMessagingMessageBeModerated(
  message: MessagingMessage,
): boolean {
  return message.canBeModerated;
}