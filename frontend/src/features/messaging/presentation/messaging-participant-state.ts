// -----------------------------------------------------------------------------
// SisiMove — Messaging Participant Presentation State
// -----------------------------------------------------------------------------
//
// Presentation-only interpretation of MessagingConversationParticipant.
//
// The backend remains authoritative for:
// - participant lifecycle;
// - participant capabilities;
// - participant role;
// - read state.
//
// This file does not perform authorization or lifecycle transitions.
// -----------------------------------------------------------------------------

import type { MessagingConversationParticipant } from '../models';

import { MESSAGING_PARTICIPANT_STATUSES } from '../models/messaging-participant-status';

// =============================================================================
// Presentation State
// =============================================================================

export type MessagingParticipantPresentationState =
  | 'active'
  | 'left'
  | 'removed';

// =============================================================================
// State Resolution
// =============================================================================

export function getMessagingParticipantPresentationState(
  participant: MessagingConversationParticipant,
): MessagingParticipantPresentationState {
  if (
    participant.status === MESSAGING_PARTICIPANT_STATUSES.REMOVED ||
    participant.isRemoved
  ) {
    return 'removed';
  }

  if (
    participant.status === MESSAGING_PARTICIPANT_STATUSES.LEFT ||
    participant.hasLeft
  ) {
    return 'left';
  }

  return 'active';
}

// =============================================================================
// Lifecycle Predicates
// =============================================================================

export function isMessagingParticipantActive(
  participant: MessagingConversationParticipant,
): boolean {
  return participant.isActive;
}

export function isMessagingParticipantLeft(
  participant: MessagingConversationParticipant,
): boolean {
  return participant.hasLeft;
}

export function isMessagingParticipantRemoved(
  participant: MessagingConversationParticipant,
): boolean {
  return participant.isRemoved;
}

export function isMessagingParticipantUsable(
  participant: MessagingConversationParticipant,
): boolean {
  return participant.isUsable;
}

// =============================================================================
// Role Predicates
// =============================================================================

export function isMessagingProviderParticipant(
  participant: MessagingConversationParticipant,
): boolean {
  return participant.isProvider;
}

export function isMessagingPassengerParticipant(
  participant: MessagingConversationParticipant,
): boolean {
  return participant.isPassenger;
}

// =============================================================================
// Capability Predicates
// =============================================================================
//
// These consume backend-provided capability flags.
// They do not recreate authorization rules.
//

export function canMessagingParticipantReadMessages(
  participant: MessagingConversationParticipant,
): boolean {
  return participant.canReadMessages;
}

export function canMessagingParticipantSendMessages(
  participant: MessagingConversationParticipant,
): boolean {
  return participant.canSendMessages;
}

export function canMessagingParticipantLeave(
  participant: MessagingConversationParticipant,
): boolean {
  return participant.canLeave;
}

export function canMessagingParticipantBeRemoved(
  participant: MessagingConversationParticipant,
): boolean {
  return participant.canBeRemoved;
}

export function hasMessagingParticipantReadPosition(
  participant: MessagingConversationParticipant,
): boolean {
  return participant.hasReadPosition;
}