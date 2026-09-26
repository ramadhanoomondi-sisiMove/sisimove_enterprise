// -----------------------------------------------------------------------------
// SisiMove — Messaging Message Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the application-facing Messaging Message
// response.
//
// Backend aggregate:
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// The frontend model intentionally contains only application-safe primitive
// values.
//
// The backend is authoritative for:
//
// - lifecycle state;
// - lifecycle capability predicates;
// - message type predicates;
// - payload predicates;
// - timestamps;
// - identity references.
//
// This model does NOT:
//
// - contain domain methods;
// - mutate message state;
// - implement lifecycle transitions;
// - perform authorization;
// - validate message payloads;
// - resolve members;
// - resolve conversations;
// - resolve assets.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Messaging Message Types
// -----------------------------------------------------------------------------

import type { MessagingMessageType } from './messaging-message-type';

// -----------------------------------------------------------------------------
// Messaging Message Status
// -----------------------------------------------------------------------------

import type { MessagingMessageStatus } from './messaging-message-status';

// =============================================================================
// Messaging Message
// =============================================================================

/**
 * Application-facing Messaging Message model.
 *
 * This model mirrors the backend MessagingMessageResponse contract.
 */
export interface MessagingMessage {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Messaging Message.
   */
  publicId: string;

  /**
   * Public identifier of the owning Messaging Conversation.
   */
  conversationPublicId: string;

  /**
   * Public identifier of the member who sent the message.
   */
  senderPublicId: string;

  // ---------------------------------------------------------------------------
  // Message
  // ---------------------------------------------------------------------------

  /**
   * Message type.
   */
  type: MessagingMessageType;

  /**
   * Current message lifecycle status.
   */
  status: MessagingMessageStatus;

  /**
   * Optional textual message content.
   *
   * Undefined when the message does not contain textual content.
   */
  content: string | undefined;

  /**
   * Optional public identifier of the referenced Asset.
   *
   * Messaging does not own the Asset itself.
   */
  assetPublicId: string | undefined;

  // ---------------------------------------------------------------------------
  // Message Type Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether this is a TEXT message.
   */
  isText: boolean;

  /**
   * Indicates whether this is an IMAGE message.
   */
  isImage: boolean;

  /**
   * Indicates whether this is a FILE message.
   */
  isFile: boolean;

  /**
   * Indicates whether this is a SYSTEM message.
   */
  isSystem: boolean;

  // ---------------------------------------------------------------------------
  // Lifecycle Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the message has been sent.
   */
  isSent: boolean;

  /**
   * Indicates whether the message has been edited.
   */
  isEdited: boolean;

  /**
   * Indicates whether the message has been deleted.
   */
  isDeleted: boolean;

  /**
   * Indicates whether the message has been moderated.
   */
  isModerated: boolean;

  /**
   * Indicates whether the message is currently usable.
   */
  isUsable: boolean;

  /**
   * Indicates whether the message can currently be modified.
   */
  canBeModified: boolean;

  /**
   * Indicates whether the message can currently be edited.
   */
  canBeEdited: boolean;

  /**
   * Indicates whether the message can currently be deleted.
   */
  canBeDeleted: boolean;

  /**
   * Indicates whether the message can currently be moderated.
   */
  canBeModerated: boolean;

  // ---------------------------------------------------------------------------
  // Payload Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the message contains textual content.
   */
  hasContent: boolean;

  /**
   * Indicates whether the message references an Asset.
   */
  hasAsset: boolean;

  // ---------------------------------------------------------------------------
  // Audit / Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the message was sent.
   */
  sentAt: Date;

  /**
   * Timestamp at which the message was edited.
   */
  editedAt: Date | undefined;

  /**
   * Timestamp at which the message was deleted.
   */
  deletedAt: Date | undefined;

  /**
   * Timestamp at which the message was moderated.
   */
  moderatedAt: Date | undefined;

  /**
   * Timestamp at which the message was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the message was last updated.
   */
  updatedAt: Date;
}