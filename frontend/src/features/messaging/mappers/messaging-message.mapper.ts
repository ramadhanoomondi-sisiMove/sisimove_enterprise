// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Mapper
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Convert the raw Messaging message HTTP response into the canonical
//   frontend MessagingMessage model.
// - Convert serialized timestamps into Date instances.
// - Convert backend string enum values into frontend union types.
//
// Non-responsibilities:
// - HTTP requests.
// - Authentication.
// - Authorization.
// - Business-rule validation.
// - React Query.
// - Asset resolution.
// - Mutation.
// -----------------------------------------------------------------------------

import type {
  GetMessagingMessageApiResponse,
  SendMessagingMessageApiResponse,
  EditMessagingMessageApiResponse,
  DeleteMessagingMessageApiResponse,
  ModerateMessagingMessageApiResponse,
  GetMessagingConversationMessagesApiResponse,
} from '../api';

import {
  MESSAGING_MESSAGE_STATUSES,
  MESSAGING_MESSAGE_TYPES,
  type MessagingMessage,
  type MessagingMessageStatus,
  type MessagingMessageType,
} from '../models';

// -----------------------------------------------------------------------------
// Type guards / normalization
// -----------------------------------------------------------------------------

function toMessagingMessageType(
  value: string,
): MessagingMessageType {
  if (
    value === MESSAGING_MESSAGE_TYPES.TEXT ||
    value === MESSAGING_MESSAGE_TYPES.IMAGE ||
    value === MESSAGING_MESSAGE_TYPES.FILE ||
    value === MESSAGING_MESSAGE_TYPES.SYSTEM
  ) {
    return value;
  }

  throw new Error(
    `Unsupported Messaging message type received from API: ${value}`,
  );
}

function toMessagingMessageStatus(
  value: string,
): MessagingMessageStatus {
  if (
    value === MESSAGING_MESSAGE_STATUSES.SENT ||
    value === MESSAGING_MESSAGE_STATUSES.EDITED ||
    value === MESSAGING_MESSAGE_STATUSES.DELETED ||
    value === MESSAGING_MESSAGE_STATUSES.MODERATED
  ) {
    return value;
  }

  throw new Error(
    `Unsupported Messaging message status received from API: ${value}`,
  );
}

// -----------------------------------------------------------------------------
// Raw response compatibility
// -----------------------------------------------------------------------------

type MessagingMessageApiResponse =
  | GetMessagingMessageApiResponse
  | SendMessagingMessageApiResponse
  | EditMessagingMessageApiResponse
  | DeleteMessagingMessageApiResponse
  | ModerateMessagingMessageApiResponse
  | GetMessagingConversationMessagesApiResponse;

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export const messagingMessageMapper = {
  map(
    response: MessagingMessageApiResponse,
  ): MessagingMessage {
    return {
      publicId: response.publicId,

      conversationPublicId: response.conversationPublicId,

      senderPublicId: response.senderPublicId,

      type: toMessagingMessageType(response.type),

      status: toMessagingMessageStatus(response.status),

      content: response.content,

      assetPublicId: response.assetPublicId,

      isText: response.isText,

      isImage: response.isImage,

      isFile: response.isFile,

      isSystem: response.isSystem,

      isSent: response.isSent,

      isEdited: response.isEdited,

      isDeleted: response.isDeleted,

      isModerated: response.isModerated,

      isUsable: response.isUsable,

      canBeModified: response.canBeModified,

      canBeEdited: response.canBeEdited,

      canBeDeleted: response.canBeDeleted,

      canBeModerated: response.canBeModerated,

      hasContent: response.hasContent,

      hasAsset: response.hasAsset,

      sentAt: new Date(response.sentAt),

      editedAt: response.editedAt
        ? new Date(response.editedAt)
        : undefined,

      deletedAt: response.deletedAt
        ? new Date(response.deletedAt)
        : undefined,

      moderatedAt: response.moderatedAt
        ? new Date(response.moderatedAt)
        : undefined,

      createdAt: new Date(response.createdAt),

      updatedAt: new Date(response.updatedAt),
    };
  },

  mapMany(
    responses: MessagingMessageApiResponse[],
  ): MessagingMessage[] {
    return responses.map((response) => this.map(response));
  },
};