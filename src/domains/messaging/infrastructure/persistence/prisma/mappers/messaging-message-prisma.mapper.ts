// -----------------------------------------------------------------------------
// Messaging Message — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Messaging Message aggregate:
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// Persistence:
//
// MessagingMessage
//
// Messaging Message is an independent aggregate root.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - map Prisma MessagingMessage records into the domain;
// - rehydrate MessagingMessageEntity without emitting domain events;
// - map MessagingMessageEntity into Prisma persistence values;
// - map MessagingMessageAggregate into persistence;
// - preserve internal entity identity;
// - preserve public identity;
// - preserve owning conversation internal identity;
// - restore the owning conversation public identity supplied by the
//   infrastructure rehydration workflow;
// - preserve sender public identity;
// - translate Prisma enum values into domain value objects;
// - translate optional content into MessagingMessageContent;
// - translate optional asset references into MessagingAssetPublicId;
// - preserve message lifecycle timestamps;
// - preserve lifecycle state exactly as persisted.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// MessagingMessage persistence stores:
//
// - conversationId
// - senderPublicId
// - type
// - status
// - content
// - assetId
// - lifecycle timestamps
//
// It does NOT store:
//
// - conversationPublicId
//
// Therefore:
//
// Prisma MessagingMessage
//        +
// MessagingConversation.publicId
//        ↓
// MessagingMessageEntity
//
// The repository must supply the owning conversation public identity during
// rehydration.
//
// This mapper does NOT load the Messaging Conversation aggregate.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// senderPublicId
//     → Identity.publicId
//
// assetId
//     → Asset.publicId
//
// Both remain opaque Messaging value objects.
//
// No Identity or Asset aggregate is loaded here.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// The mapper does not include Messaging Conversation participants or other
// conversation-owned state because those belong to another aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { MessagingMessage as PrismaMessagingMessage } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { MessagingMessageAggregate } from '../../../../domain/aggregates/messaging-message.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { MessagingMessageEntity } from '../../../../domain/entities/messaging-message.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { MessagingConversationPublicId } from '../../../../domain/value-objects';
import {
  MessagingAssetPublicId,
  MessagingMemberPublicId,
  MessagingMessageContent,
  MessagingMessagePublicId,
  MessagingMessageStatus,
  MessagingMessageType,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the Messaging Message aggregate.
 *
 * Messaging Message is a single-entity aggregate.
 *
 * No aggregate-owned child collection is persisted through this mapper.
 */
export interface MessagingMessagePersistence {
  message: ReturnType<typeof MessagingMessagePrismaMapper.messageToPersistence>;
}

// =============================================================================
// Mapper
// =============================================================================

export class MessagingMessagePrismaMapper {
  // ===========================================================================

  // Prisma → Domain Aggregate

  // ===========================================================================

  /**
   * Rehydrates a complete Messaging Message aggregate from a Prisma
   * MessagingMessage record.
   *
   * The owning conversation public identity is supplied separately because
   * MessagingMessage persistence stores only conversationId.
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(
    record: PrismaMessagingMessage,
    conversationPublicId: MessagingConversationPublicId,
  ): MessagingMessageAggregate {
    return MessagingMessageAggregate.rehydrate(
      this.messageToDomain(record, conversationPublicId),
    );
  }

  // ===========================================================================

  // Prisma → Domain Entity

  // ===========================================================================

  /**
   * Rehydrates a MessagingMessageEntity from a persisted Prisma record.
   *
   * Mapping:
   *
   * Prisma id
   *     ↓
   * UniqueEntityId
   *
   * Prisma publicId
   *     ↓
   * MessagingMessagePublicId
   *
   * Prisma conversationId
   *     ↓
   * UniqueEntityId
   *
   * supplied conversationPublicId
   *     ↓
   * MessagingConversationPublicId
   *
   * Prisma senderPublicId
   *     ↓
   * MessagingMemberPublicId
   *
   * Prisma type
   *     ↓
   * MessagingMessageType
   *
   * Prisma status
   *     ↓
   * MessagingMessageStatus
   *
   * Prisma content
   *     ↓
   * MessagingMessageContent | undefined
   *
   * Prisma assetId
   *     ↓
   * MessagingAssetPublicId | undefined
   *
   * Prisma lifecycle timestamps
   *     ↓
   * defensive Date values
   *
   * Rehydration does not emit domain events.
   */
  public static messageToDomain(
    record: PrismaMessagingMessage,
    conversationPublicId: MessagingConversationPublicId,
  ): MessagingMessageEntity {
    if (record === undefined || record === null) {
      throw new Error('Messaging Message Prisma record is required.');
    }

    if (conversationPublicId === undefined || conversationPublicId === null) {
      throw new Error(
        'Messaging Conversation public identity is required to rehydrate a Messaging Message.',
      );
    }

    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------
    //
    // MessagingMessagePublicId extends PublicEntityId and exposes a public
    // constructor. It does not provide a static create() factory.
    //

    const publicId = new MessagingMessagePublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Optional Content
    // -------------------------------------------------------------------------
    //
    // Prisma nullable content maps to undefined in the domain.
    //

    const content =
      record.content !== null
        ? MessagingMessageContent.create(record.content)
        : undefined;

    // -------------------------------------------------------------------------
    // Optional Asset Reference
    // -------------------------------------------------------------------------
    //
    // MessagingAssetPublicId has a private constructor and therefore must be
    // created through its public create() factory.
    //
    // No Asset aggregate is loaded here.
    //

    const assetPublicId =
      record.assetId !== null
        ? MessagingAssetPublicId.create(record.assetId)
        : undefined;

    // -------------------------------------------------------------------------
    // Domain Rehydration
    // -------------------------------------------------------------------------

    return MessagingMessageEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Conversation Reference
        // ---------------------------------------------------------------------

        conversationId: new UniqueEntityId(record.conversationId),

        conversationPublicId,

        // ---------------------------------------------------------------------
        // Sender
        // ---------------------------------------------------------------------
        //
        // MessagingMemberPublicId has a private constructor and therefore must
        // be created through its public create() factory.
        //

        senderPublicId: MessagingMemberPublicId.create(record.senderPublicId),

        // ---------------------------------------------------------------------
        // Message Definition
        // ---------------------------------------------------------------------

        type: MessagingMessageType.create(record.type),

        status: MessagingMessageStatus.create(record.status),

        content,

        assetPublicId,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        sentAt: new Date(record.sentAt.getTime()),

        editedAt:
          record.editedAt !== null
            ? new Date(record.editedAt.getTime())
            : undefined,

        deletedAt:
          record.deletedAt !== null
            ? new Date(record.deletedAt.getTime())
            : undefined,

        moderatedAt:
          record.moderatedAt !== null
            ? new Date(record.moderatedAt.getTime())
            : undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      // -----------------------------------------------------------------------
      // Entity Identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),

      // -----------------------------------------------------------------------
      // Public Identity
      // -----------------------------------------------------------------------

      publicId,
    );
  }

  // ===========================================================================

  // Domain Entity → Prisma Persistence

  // ===========================================================================

  /**
   * Maps MessagingMessageEntity into its Prisma persistence shape.
   *
   * Domain value objects are serialized into primitive persistence values.
   *
   * conversationPublicId is intentionally not persisted because the Prisma
   * MessagingMessage model stores the owning conversation through
   * conversationId.
   */
  public static messageToPersistence(entity: MessagingMessageEntity): {
    id: string;
    publicId: string;
    conversationId: string;
    senderPublicId: string;
    type: PrismaMessagingMessage['type'];
    status: PrismaMessagingMessage['status'];
    content: string | null;
    assetId: string | null;
    sentAt: Date;
    editedAt: Date | null;
    deletedAt: Date | null;
    moderatedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined || entity === null) {
      throw new Error('Messaging Message entity is required.');
    }

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Conversation Reference
      // -----------------------------------------------------------------------

      conversationId: entity.conversationId.toString(),

      // -----------------------------------------------------------------------
      // Sender
      // -----------------------------------------------------------------------

      senderPublicId: entity.senderPublicId.value,

      // -----------------------------------------------------------------------
      // Message Definition
      // -----------------------------------------------------------------------

      type: entity.type.value,

      status: entity.status.value,

      content: entity.content?.value ?? null,

      // -----------------------------------------------------------------------
      // Asset Reference
      // -----------------------------------------------------------------------

      assetId: entity.assetPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      sentAt: entity.sentAt,

      editedAt: entity.editedAt ?? null,

      deletedAt: entity.deletedAt ?? null,

      moderatedAt: entity.moderatedAt ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================

  // Aggregate → Persistence

  // ===========================================================================

  /**
   * Converts the complete Messaging Message aggregate into its persistence
   * structure.
   *
   * Messaging Message is a single-entity aggregate, so only the aggregate
   * root entity is persisted here.
   */
  public static toPersistence(
    aggregate: MessagingMessageAggregate,
  ): MessagingMessagePersistence {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Messaging Message aggregate is required.');
    }

    return {
      message: this.messageToPersistence(aggregate.message),
    };
  }

  // ===========================================================================

  // Component Mapping

  // ===========================================================================

  /**
   * Maps a Prisma MessagingMessage record directly into a
   * MessagingMessageEntity.
   *
   * The owning conversation public identity must be supplied because it is
   * not duplicated on the MessagingMessage persistence record.
   */
  public static toMessageDomain(
    record: PrismaMessagingMessage,
    conversationPublicId: MessagingConversationPublicId,
  ): MessagingMessageEntity {
    return this.messageToDomain(record, conversationPublicId);
  }

  /**
   * Maps a Prisma MessagingMessage record into a
   * MessagingMessageAggregate.
   */
  public static toMessageAggregate(
    record: PrismaMessagingMessage,
    conversationPublicId: MessagingConversationPublicId,
  ): MessagingMessageAggregate {
    return this.toDomain(record, conversationPublicId);
  }

  // ===========================================================================

  // Generic Domain Component Mapping

  // ===========================================================================

  /**
   * Maps a Prisma Messaging Message record into its corresponding domain
   * component.
   *
   * Messaging Message has only one aggregate-owned entity, so this resolves
   * directly to MessagingMessageEntity.
   */
  public static toDomainComponent(
    record: PrismaMessagingMessage,
    conversationPublicId: MessagingConversationPublicId,
  ): MessagingMessageEntity {
    return this.messageToDomain(record, conversationPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default MessagingMessagePrismaMapper;
