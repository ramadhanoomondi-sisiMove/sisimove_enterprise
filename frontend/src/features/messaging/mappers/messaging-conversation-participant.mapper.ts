// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Participant Mapper
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Convert raw participant HTTP responses into the canonical
//   MessagingConversationParticipant model.
// - Convert serialized timestamps into Date instances.
// - Convert backend role/status values into frontend union types.
//
// Non-responsibilities:
// - HTTP requests.
// - Authentication.
// - Authorization.
// - Participant lifecycle decisions.
// - React Query.
// - Identity/profile resolution.
// -----------------------------------------------------------------------------

import type {
  GetMessagingConversationParticipantApiResponse,
  GetMessagingConversationParticipantsApiResponse,
  AddMessagingConversationParticipantApiResponse,
  LeaveMessagingConversationApiResponse,
  RemoveMessagingConversationParticipantApiResponse,
} from '../api';

import {
  MESSAGING_PARTICIPANT_ROLES,
  MESSAGING_PARTICIPANT_STATUSES,
  type MessagingConversationParticipant,
  type MessagingParticipantRole,
  type MessagingParticipantStatus,
} from '../models';

// -----------------------------------------------------------------------------
// Type guards / normalization
// -----------------------------------------------------------------------------

function toMessagingParticipantRole(
  value: string,
): MessagingParticipantRole {
  if (
    value === MESSAGING_PARTICIPANT_ROLES.PROVIDER ||
    value === MESSAGING_PARTICIPANT_ROLES.PASSENGER
  ) {
    return value;
  }

  throw new Error(
    `Unsupported Messaging participant role received from API: ${value}`,
  );
}

function toMessagingParticipantStatus(
  value: string,
): MessagingParticipantStatus {
  if (
    value === MESSAGING_PARTICIPANT_STATUSES.ACTIVE ||
    value === MESSAGING_PARTICIPANT_STATUSES.LEFT ||
    value === MESSAGING_PARTICIPANT_STATUSES.REMOVED
  ) {
    return value;
  }

  throw new Error(
    `Unsupported Messaging participant status received from API: ${value}`,
  );
}

// -----------------------------------------------------------------------------
// Raw response compatibility
// -----------------------------------------------------------------------------

type MessagingConversationParticipantApiResponse =
  | GetMessagingConversationParticipantApiResponse
  | GetMessagingConversationParticipantsApiResponse
  | AddMessagingConversationParticipantApiResponse
  | LeaveMessagingConversationApiResponse
  | RemoveMessagingConversationParticipantApiResponse;

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export const messagingConversationParticipantMapper = {
  map(
    response: MessagingConversationParticipantApiResponse,
  ): MessagingConversationParticipant {
    return {
      publicId: response.publicId,

      conversationPublicId: response.conversationPublicId,

      memberPublicId: response.memberPublicId,

      role: toMessagingParticipantRole(response.role),

      isProvider: response.isProvider,

      isPassenger: response.isPassenger,

      status: toMessagingParticipantStatus(response.status),

      isActive: response.isActive,

      hasLeft: response.hasLeft,

      isRemoved: response.isRemoved,

      isUsable: response.isUsable,

      canBeModified: response.canBeModified,

      canLeave: response.canLeave,

      canBeRemoved: response.canBeRemoved,

      canReadMessages: response.canReadMessages,

      canSendMessages: response.canSendMessages,

      hasReadPosition: response.hasReadPosition,

      lastReadAt: response.lastReadAt
        ? new Date(response.lastReadAt)
        : undefined,

      joinedAt: new Date(response.joinedAt),

      leftAt: response.leftAt
        ? new Date(response.leftAt)
        : undefined,

      removedAt: response.removedAt
        ? new Date(response.removedAt)
        : undefined,

      createdAt: new Date(response.createdAt),

      updatedAt: new Date(response.updatedAt),
    };
  },

  mapMany(
    responses: MessagingConversationParticipantApiResponse[],
  ): MessagingConversationParticipant[] {
    return responses.map((response) => this.map(response));
  },
};