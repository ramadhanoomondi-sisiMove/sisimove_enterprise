// -----------------------------------------------------------------------------
// Messaging — Message Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the MessagingMessageAggregate / MessagingMessageEntity domain model
// into an application-facing MessagingMessageResponse.
//
// Aggregate:
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// Mapping principles:
//
// - Expose Messaging Message-safe state.
// - Serialize value objects into primitives.
// - Expose the Messaging Message public identity.
// - Expose the owning conversation public identity.
// - Expose the sender public identity.
// - Expose the message type.
// - Expose the message lifecycle status.
// - Expose message content when present.
// - Expose asset public identity when present.
// - Expose lifecycle timestamps.
// - Expose lifecycle capability predicates.
// - Expose message-state predicates.
// - Expose message-type predicates.
// - Do not expose internal persistence identifiers.
// - Do not expose internal conversationId.
// - Do not expose domain entities.
// - Do not expose value objects directly.
// - Do not access Prisma.
// - Do not access persistence models.
// - Do not resolve conversations.
// - Do not resolve members.
// - Do not resolve assets.
// - Do not evaluate authorization.
// - Do not perform business validation.
// - Do not mutate the aggregate.
// - Do not emit domain events.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map MessagingMessageAggregate -> MessagingMessageResponse.
// - Map MessagingMessageEntity -> MessagingMessageResponse.
// - Provide one canonical Messaging Message mapping implementation.
// - Convert Messaging Message value objects into primitive response values.
// - Expose safe lifecycle predicates.
// - Expose safe message-type predicates.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the Messaging Message aggregate.
// - Persist the Messaging Message.
// - Access Prisma.
// - Access repositories.
// - Resolve conversations.
// - Resolve members.
// - Resolve assets.
// - Perform authorization.
// - Perform business validation.
// - Emit domain events.
// - Change Messaging Message lifecycle state.
//
// -----------------------------------------------------------------------------
//
// Identity:
//
// publicId is the externally safe Messaging Message identifier.
//
// The internal entity identity (`id`) is intentionally excluded.
//
// conversationPublicId is exposed because it is already an explicit public
// reference owned by the Messaging Message domain model.
//
// senderPublicId is exposed because it is an explicit public member reference.
//
// assetPublicId is exposed when the message references an asset.
//
// -----------------------------------------------------------------------------
//
// Payload:
//
// Message payload follows the domain model:
//
// TEXT:
//
//     content required
//     asset forbidden
//
// SYSTEM:
//
//     content required
//     asset forbidden
//
// IMAGE:
//
//     asset required
//     content optional
//
// FILE:
//
//     asset required
//     content optional
//
// The response mapper does not validate these rules. It only projects the
// state already held by the domain entity.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
// The mapper exposes:
//
// - status;
// - isSent;
// - isEdited;
// - isDeleted;
// - isModerated;
// - isUsable;
// - canBeModified;
// - canBeEdited;
// - canBeDeleted;
// - canBeModerated.
//
// These are read-only projections of the entity/aggregate's existing domain
// predicates.
//
// The mapper does not calculate or alter lifecycle state.
//
// -----------------------------------------------------------------------------
//
// Message Type:
//
// The mapper exposes:
//
// - type;
// - isText;
// - isImage;
// - isFile;
// - isSystem.
//
// These are read-only projections of the domain model.
//
// -----------------------------------------------------------------------------
//
// Dates:
//
// Date values are returned as defensive copies so callers cannot mutate the
// domain entity's Date instances through the response object.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { MessagingMessageAggregate } from '../../../domain/aggregates/messaging-message.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { MessagingMessageEntity } from '../../../domain/entities/messaging-message.entity';

// =============================================================================
// Response
// =============================================================================

export interface MessagingMessageResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Messaging Message aggregate.
   *
   * This is the externally safe Messaging Message identifier.
   */
  publicId: string;

  /**
   * Public identifier of the owning Messaging Conversation.
   *
   * This is an externally safe conversation reference.
   */
  conversationPublicId: string;

  /**
   * Public identifier of the member who sent the message.
   *
   * This is an externally safe member reference.
   */
  senderPublicId: string;

  // ---------------------------------------------------------------------------
  // Message
  // ---------------------------------------------------------------------------

  /**
   * Messaging Message type.
   *
   * Examples:
   *
   * - TEXT
   * - IMAGE
   * - FILE
   * - SYSTEM
   */
  type: string;

  /**
   * Current Messaging Message lifecycle status.
   *
   * Examples:
   *
   * - SENT
   * - EDITED
   * - DELETED
   * - MODERATED
   */
  status: string;

  /**
   * Message content.
   *
   * Content is undefined when the message does not contain textual content.
   */
  content: string | undefined;

  /**
   * Public identifier of the referenced asset, when present.
   *
   * This is an externally safe asset reference.
   */
  assetPublicId: string | undefined;

  // ---------------------------------------------------------------------------
  // Message Type Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether this is a text message.
   */
  isText: boolean;

  /**
   * Indicates whether this is an image message.
   */
  isImage: boolean;

  /**
   * Indicates whether this is a file message.
   */
  isFile: boolean;

  /**
   * Indicates whether this is a system message.
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
   * Indicates whether the message has textual content.
   */
  hasContent: boolean;

  /**
   * Indicates whether the message references an asset.
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
   *
   * Undefined when the message has never been edited.
   */
  editedAt: Date | undefined;

  /**
   * Timestamp at which the message was deleted.
   *
   * Undefined when the message has not been deleted.
   */
  deletedAt: Date | undefined;

  /**
   * Timestamp at which the message was moderated.
   *
   * Undefined when the message has not been moderated.
   */
  moderatedAt: Date | undefined;

  /**
   * Timestamp at which the Messaging Message was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the Messaging Message was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class MessagingMessageResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps a MessagingMessageAggregate into a
   * MessagingMessageResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(
    aggregate: MessagingMessageAggregate,
  ): MessagingMessageResponse {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Messaging Message aggregate is required.');
    }

    return this.mapMessage(aggregate.message);
  }

  // ===========================================================================
  // Entity -> Response
  // ===========================================================================

  /**
   * Maps a MessagingMessageEntity directly into a
   * MessagingMessageResponse.
   *
   * Useful for application/read workflows where the aggregate wrapper is not
   * required by the caller.
   */
  public static fromEntity(
    message: MessagingMessageEntity,
  ): MessagingMessageResponse {
    if (message === undefined || message === null) {
      throw new Error('Messaging Message entity is required.');
    }

    return this.mapMessage(message);
  }

  // ===========================================================================
  // Internal Message Mapping
  // ===========================================================================

  /**
   * Maps the MessagingMessageEntity portion of the Messaging Message
   * aggregate.
   *
   * This is the single canonical implementation used by both:
   *
   * - toResponse();
   * - fromEntity();
   *
   * Keeping the mapping centralized prevents aggregate and entity response
   * paths from drifting apart.
   */
  private static mapMessage(
    message: MessagingMessageEntity,
  ): MessagingMessageResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: message.publicId.value,

      conversationPublicId: message.conversationPublicId.value,

      senderPublicId: message.senderPublicId.value,

      // -----------------------------------------------------------------------
      // Message
      // -----------------------------------------------------------------------

      type: message.type.value,

      status: message.status.value,

      content: message.content?.value,

      assetPublicId: message.assetPublicId?.value,

      // -----------------------------------------------------------------------
      // Message Type Predicates
      // -----------------------------------------------------------------------

      isText: message.isText(),

      isImage: message.isImage(),

      isFile: message.isFile(),

      isSystem: message.isSystem(),

      // -----------------------------------------------------------------------
      // Lifecycle Predicates
      // -----------------------------------------------------------------------

      isSent: message.isSent(),

      isEdited: message.isEdited(),

      isDeleted: message.isDeleted(),

      isModerated: message.isModerated(),

      isUsable: message.isUsable(),

      canBeModified: message.canBeModified(),

      canBeEdited: message.canBeEdited(),

      canBeDeleted: message.canBeDeleted(),

      canBeModerated: message.canBeModerated(),

      // -----------------------------------------------------------------------
      // Payload Predicates
      // -----------------------------------------------------------------------

      hasContent: message.hasContent(),

      hasAsset: message.hasAsset(),

      // -----------------------------------------------------------------------
      // Audit / Lifecycle Timestamps
      // -----------------------------------------------------------------------

      sentAt: new Date(message.sentAt.getTime()),

      editedAt:
        message.editedAt !== undefined
          ? new Date(message.editedAt.getTime())
          : undefined,

      deletedAt:
        message.deletedAt !== undefined
          ? new Date(message.deletedAt.getTime())
          : undefined,

      moderatedAt:
        message.moderatedAt !== undefined
          ? new Date(message.moderatedAt.getTime())
          : undefined,

      createdAt: new Date(message.createdAt.getTime()),

      updatedAt: new Date(message.updatedAt.getTime()),
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default MessagingMessageResponseMapper;
