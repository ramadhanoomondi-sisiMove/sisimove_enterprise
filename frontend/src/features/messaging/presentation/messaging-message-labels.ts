// -----------------------------------------------------------------------------
// SisiMove — Messaging Message Presentation Labels
// -----------------------------------------------------------------------------
//
// Stable human-readable labels for Messaging Message values.
// -----------------------------------------------------------------------------

import type { MessagingMessageStatus } from '../models/messaging-message-status';
import type { MessagingMessageType } from '../models/messaging-message-type';

import { MESSAGING_MESSAGE_STATUSES } from '../models/messaging-message-status';
import { MESSAGING_MESSAGE_TYPES } from '../models/messaging-message-type';

// =============================================================================
// Message Type Labels
// =============================================================================

export const MESSAGING_MESSAGE_TYPE_LABELS: Record<
  MessagingMessageType,
  string
> = {
  [MESSAGING_MESSAGE_TYPES.TEXT]: 'Text',
  [MESSAGING_MESSAGE_TYPES.IMAGE]: 'Image',
  [MESSAGING_MESSAGE_TYPES.FILE]: 'File',
  [MESSAGING_MESSAGE_TYPES.SYSTEM]: 'System',
};

// =============================================================================
// Message Status Labels
// =============================================================================

export const MESSAGING_MESSAGE_STATUS_LABELS: Record<
  MessagingMessageStatus,
  string
> = {
  [MESSAGING_MESSAGE_STATUSES.SENT]: 'Sent',
  [MESSAGING_MESSAGE_STATUSES.EDITED]: 'Edited',
  [MESSAGING_MESSAGE_STATUSES.DELETED]: 'Deleted',
  [MESSAGING_MESSAGE_STATUSES.MODERATED]: 'Moderated',
};

// =============================================================================
// Label Helpers
// =============================================================================

export function getMessagingMessageTypeLabel(
  type: MessagingMessageType,
): string {
  return MESSAGING_MESSAGE_TYPE_LABELS[type];
}

export function getMessagingMessageStatusLabel(
  status: MessagingMessageStatus,
): string {
  return MESSAGING_MESSAGE_STATUS_LABELS[status];
}