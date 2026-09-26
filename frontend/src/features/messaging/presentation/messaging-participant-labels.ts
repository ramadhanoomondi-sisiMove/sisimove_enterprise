// -----------------------------------------------------------------------------
// SisiMove — Messaging Participant Presentation Labels
// -----------------------------------------------------------------------------
//
// Stable human-readable labels for Messaging participant values.
// -----------------------------------------------------------------------------

import type { MessagingParticipantRole } from '../models/messaging-participant-role';
import type { MessagingParticipantStatus } from '../models/messaging-participant-status';

import { MESSAGING_PARTICIPANT_ROLES } from '../models/messaging-participant-role';
import { MESSAGING_PARTICIPANT_STATUSES } from '../models/messaging-participant-status';

// =============================================================================
// Participant Role Labels
// =============================================================================

export const MESSAGING_PARTICIPANT_ROLE_LABELS: Record<
  MessagingParticipantRole,
  string
> = {
  [MESSAGING_PARTICIPANT_ROLES.PROVIDER]: 'Provider',
  [MESSAGING_PARTICIPANT_ROLES.PASSENGER]: 'Passenger',
};

// =============================================================================
// Participant Status Labels
// =============================================================================

export const MESSAGING_PARTICIPANT_STATUS_LABELS: Record<
  MessagingParticipantStatus,
  string
> = {
  [MESSAGING_PARTICIPANT_STATUSES.ACTIVE]: 'Active',
  [MESSAGING_PARTICIPANT_STATUSES.LEFT]: 'Left',
  [MESSAGING_PARTICIPANT_STATUSES.REMOVED]: 'Removed',
};

// =============================================================================
// Label Helpers
// =============================================================================

export function getMessagingParticipantRoleLabel(
  role: MessagingParticipantRole,
): string {
  return MESSAGING_PARTICIPANT_ROLE_LABELS[role];
}

export function getMessagingParticipantStatusLabel(
  status: MessagingParticipantStatus,
): string {
  return MESSAGING_PARTICIPANT_STATUS_LABELS[status];
}