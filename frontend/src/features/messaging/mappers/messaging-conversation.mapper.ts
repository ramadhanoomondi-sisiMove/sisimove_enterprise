
import type {
  CloseMessagingConversationApiResponse,
  CreateMessagingConversationApiResponse,
  GetMessagingConversationApiResponse,
  ListMessagingConversationsApiResponse,
} from '../api';

import {
  MESSAGING_CONVERSATION_STATUSES,
  MESSAGING_CONVERSATION_TYPES,
  type MessagingConversation,
  type MessagingConversationStatus,
  type MessagingConversationType,
} from '../models';

import { messagingConversationParticipantMapper } from './messaging-conversation-participant.mapper';
import { messagingMessageMapper } from './messaging-message.mapper';

// =============================================================================
// Conversation Type
// =============================================================================

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

// =============================================================================
// Conversation Status
// =============================================================================

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

// =============================================================================
// Raw Response Compatibility
// =============================================================================

type MessagingConversationApiResponse =
  | GetMessagingConversationApiResponse
  | ListMessagingConversationsApiResponse
  | CreateMessagingConversationApiResponse
  | CloseMessagingConversationApiResponse;

// =============================================================================
// Nested Mapper Input Types
// =============================================================================
//
// IMPORTANT:
//
// Do not duplicate the participant/message API response types here.
//
// The dedicated mappers are the authoritative frontend mapping boundaries.
// Their `mapMany()` parameters therefore define exactly which transport
// response types this conversation mapper must produce.
//
// For example, if the participant mapper currently accepts:
//
//   RemoveMessagingConversationParticipantApiResponse[]
//
// then the type below resolves to:
//
//   RemoveMessagingConversationParticipantApiResponse
//
// Likewise, if the message mapper accepts:
//
//   GetMessagingConversationMessagesApiResponse[]
//
// the derived type resolves to that exact response type.
//
// This keeps the conversation mapper synchronized with the nested mappers
// without creating another competing API contract.
// =============================================================================

type MessagingConversationParticipantApiResponse =
  Parameters<
    typeof messagingConversationParticipantMapper.mapMany
  >[0][number];

type MessagingMessageApiResponse =
  Parameters<
    typeof messagingMessageMapper.mapMany
  >[0][number];

// =============================================================================
// Generic Runtime Object Guard
// =============================================================================

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null
  );
}

// =============================================================================
// Participant Response Guard
// =============================================================================

/**
 * Validates and narrows an unknown participant response to the exact
 * participant transport type accepted by the dedicated participant mapper.
 *
 * The backend remains the source of truth for the actual response.
 *
 * This guard exists only because some frozen write-response contracts expose
 * the nested collection as `unknown[]`.
 */
function isMessagingConversationParticipantResponse(
  value: unknown,
): value is MessagingConversationParticipantApiResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.publicId === 'string' &&
    typeof value.conversationPublicId === 'string' &&
    typeof value.memberPublicId === 'string' &&
    typeof value.role === 'string' &&
    typeof value.isProvider === 'boolean' &&
    typeof value.isPassenger === 'boolean' &&
    typeof value.status === 'string' &&
    typeof value.isActive === 'boolean' &&
    typeof value.hasLeft === 'boolean' &&
    typeof value.isRemoved === 'boolean' &&
    typeof value.isUsable === 'boolean' &&
    typeof value.canBeModified === 'boolean' &&
    typeof value.canLeave === 'boolean' &&
    typeof value.canBeRemoved === 'boolean' &&
    typeof value.canReadMessages === 'boolean' &&
    typeof value.canSendMessages === 'boolean' &&
    typeof value.hasReadPosition === 'boolean' &&
    typeof value.joinedAt === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  );
}

// =============================================================================
// Message Response Guard
// =============================================================================

/**
 * Validates and narrows an unknown message response to the exact message
 * transport type accepted by the dedicated message mapper.
 *
 * The backend remains the source of truth for the actual response.
 *
 * This guard exists only because some frozen write-response contracts expose
 * the nested collection as `unknown[]`.
 */
function isMessagingMessageResponse(
  value: unknown,
): value is MessagingMessageApiResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.publicId === 'string' &&
    typeof value.conversationPublicId === 'string' &&
    typeof value.senderPublicId === 'string' &&
    typeof value.type === 'string' &&
    typeof value.status === 'string' &&
    typeof value.isText === 'boolean' &&
    typeof value.isImage === 'boolean' &&
    typeof value.isFile === 'boolean' &&
    typeof value.isSystem === 'boolean' &&
    typeof value.isSent === 'boolean' &&
    typeof value.isEdited === 'boolean' &&
    typeof value.isDeleted === 'boolean' &&
    typeof value.isModerated === 'boolean' &&
    typeof value.isUsable === 'boolean' &&
    typeof value.canBeModified === 'boolean' &&
    typeof value.canBeEdited === 'boolean' &&
    typeof value.canBeDeleted === 'boolean' &&
    typeof value.canBeModerated === 'boolean' &&
    typeof value.hasContent === 'boolean' &&
    typeof value.hasAsset === 'boolean' &&
    typeof value.sentAt === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  );
}

// =============================================================================
// Participant Collection Normalization
// =============================================================================

/**
 * Converts the raw participant collection into the exact array type accepted
 * by messagingConversationParticipantMapper.mapMany().
 *
 * No type assertion is used.
 */
function normalizeParticipants(
  values: unknown,
): MessagingConversationParticipantApiResponse[] {
  if (!Array.isArray(values)) {
    throw new Error(
      'Invalid Messaging conversation participants received from API.',
    );
  }

  return values.map((value, index) => {
    if (
      !isMessagingConversationParticipantResponse(
        value,
      )
    ) {
      throw new Error(
        `Invalid Messaging conversation participant received from API at index ${index}.`,
      );
    }

    return value;
  });
}

// =============================================================================
// Message Collection Normalization
// =============================================================================

/**
 * Converts the raw message collection into the exact array type accepted by
 * messagingMessageMapper.mapMany().
 *
 * No type assertion is used.
 */
function normalizeMessages(
  values: unknown,
): MessagingMessageApiResponse[] {
  if (!Array.isArray(values)) {
    throw new Error(
      'Invalid Messaging conversation messages received from API.',
    );
  }

  return values.map((value, index) => {
    if (!isMessagingMessageResponse(value)) {
      throw new Error(
        `Invalid Messaging conversation message received from API at index ${index}.`,
      );
    }

    return value;
  });
}

// =============================================================================
// Mapper
// =============================================================================

export const messagingConversationMapper = {
  // ===========================================================================
  // Single Response
  // ===========================================================================

  map(
    response: MessagingConversationApiResponse,
  ): MessagingConversation {
    const participants =
      normalizeParticipants(
        response.participants,
      );

    const messages =
      normalizeMessages(
        response.messages,
      );

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId:
        response.publicId,

      journeyPublicId:
        response.journeyPublicId,

      bookingPublicId:
        response.bookingPublicId,

      // -----------------------------------------------------------------------
      // Conversation
      // -----------------------------------------------------------------------

      type:
        toMessagingConversationType(
          response.type,
        ),

      status:
        toMessagingConversationStatus(
          response.status,
        ),

      // -----------------------------------------------------------------------
      // Conversation Type
      // -----------------------------------------------------------------------

      isJourneyConversation:
        response.isJourneyConversation,

      isDirectConversation:
        response.isDirectConversation,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      isActive:
        response.isActive,

      isClosed:
        response.isClosed,

      isUsable:
        response.isUsable,

      canBeModified:
        response.canBeModified,

      canReceiveMessages:
        response.canReceiveMessages,

      canBeClosed:
        response.canBeClosed,

      // -----------------------------------------------------------------------
      // Booking
      // -----------------------------------------------------------------------

      hasBooking:
        response.hasBooking,

      // -----------------------------------------------------------------------
      // Participants
      // -----------------------------------------------------------------------

      participantCount:
        response.participantCount,

      hasParticipants:
        response.hasParticipants,

      participants:
        messagingConversationParticipantMapper.mapMany(
          participants,
        ),

      // -----------------------------------------------------------------------
      // Messages
      // -----------------------------------------------------------------------

      messageCount:
        response.messageCount,

      hasMessages:
        response.hasMessages,

      messages:
        messagingMessageMapper.mapMany(
          messages,
        ),

      // -----------------------------------------------------------------------
      // Activity
      // -----------------------------------------------------------------------

      lastMessageAt:
        response.lastMessageAt
          ? new Date(
              response.lastMessageAt,
            )
          : undefined,

      // -----------------------------------------------------------------------
      // Closure
      // -----------------------------------------------------------------------

      closedAt:
        response.closedAt
          ? new Date(
              response.closedAt,
            )
          : undefined,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt:
        new Date(
          response.createdAt,
        ),

      updatedAt:
        new Date(
          response.updatedAt,
        ),
    };
  },

  // ===========================================================================
  // Collection
  // ===========================================================================

  mapMany(
    responses: MessagingConversationApiResponse[],
  ): MessagingConversation[] {
    return responses.map(
      (response) =>
        this.map(response),
    );
  },
};