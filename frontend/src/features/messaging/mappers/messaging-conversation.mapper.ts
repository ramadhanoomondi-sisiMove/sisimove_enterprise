// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Mapper
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Convert raw conversation HTTP responses into the canonical
//   MessagingConversation model.
// - Convert serialized timestamps into Date instances.
// - Convert nested participants and messages through their dedicated mappers.
// - Convert backend conversation type/status values into frontend union types.
//
// Non-responsibilities:
// - HTTP requests.
// - Authentication.
// - Authorization.
// - Conversation lifecycle decisions.
// - Participant/message business rules.
// - React Query.
// - Identity, Journey, Booking, or Asset resolution.
// -----------------------------------------------------------------------------

import type {
  CreateMessagingConversationApiResponse,
  GetMessagingConversationApiResponse,
  ListMessagingConversationsApiResponse,
  CloseMessagingConversationApiResponse,
} from '../api';

import {
  MESSAGING_CONVERSATION_STATUSES,
  MESSAGING_CONVERSATION_TYPES,
  type MessagingConversation,
  type MessagingConversationStatus,
  type MessagingConversationType,
} from '../models';

import { messagingMessageMapper } from './messaging-message.mapper';
import { messagingConversationParticipantMapper } from './messaging-conversation-participant.mapper';

// -----------------------------------------------------------------------------
// Type guards / normalization
// -----------------------------------------------------------------------------

function toMessagingConversationType(
  value: string,
): MessagingConversationType {
  if (
    value === MESSAGING_CONVERSATION_TYPES.JOURNEY ||
    value === MESSAGING_CONVERSATION_TYPES.DIRECT
  ) {
    return value;
  }

  throw new Error(
    `Unsupported Messaging conversation type received from API: ${value}`,
  );
}

function toMessagingConversationStatus(
  value: string,
): MessagingConversationStatus {
  if (
    value === MESSAGING_CONVERSATION_STATUSES.ACTIVE ||
    value === MESSAGING_CONVERSATION_STATUSES.CLOSED
  ) {
    return value;
  }

  throw new Error(
    `Unsupported Messaging conversation status received from API: ${value}`,
  );
}

// -----------------------------------------------------------------------------
// Raw response compatibility
// -----------------------------------------------------------------------------

type MessagingConversationApiResponse =
  | GetMessagingConversationApiResponse
  | ListMessagingConversationsApiResponse
  | CreateMessagingConversationApiResponse
  | CloseMessagingConversationApiResponse;

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export const messagingConversationMapper = {
  map(
    response: MessagingConversationApiResponse,
  ): MessagingConversation {
    return {
      publicId: response.publicId,

      journeyPublicId: response.journeyPublicId,

      bookingPublicId: response.bookingPublicId,

      type: toMessagingConversationType(response.type),

      status: toMessagingConversationStatus(response.status),

      isJourneyConversation: response.isJourneyConversation,

      isDirectConversation: response.isDirectConversation,

      isActive: response.isActive,

      isClosed: response.isClosed,

      isUsable: response.isUsable,

      canBeModified: response.canBeModified,

      canReceiveMessages: response.canReceiveMessages,

      canBeClosed: response.canBeClosed,

      hasBooking: response.hasBooking,

      participantCount: response.participantCount,

      hasParticipants: response.hasParticipants,

      participants: messagingConversationParticipantMapper.mapMany(
        response.participants,
      ),

      messageCount: response.messageCount,

      hasMessages: response.hasMessages,

      messages: messagingMessageMapper.mapMany(response.messages),

      lastMessageAt: response.lastMessageAt
        ? new Date(response.lastMessageAt)
        : undefined,

      closedAt: response.closedAt
        ? new Date(response.closedAt)
        : undefined,

      createdAt: new Date(response.createdAt),

      updatedAt: new Date(response.updatedAt),
    };
  },

  mapMany(
    responses: MessagingConversationApiResponse[],
  ): MessagingConversation[] {
    return responses.map((response) => this.map(response));
  },
};