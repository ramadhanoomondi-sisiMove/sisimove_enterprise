// -----------------------------------------------------------------------------
// Messaging — Prisma Message Repository
// -----------------------------------------------------------------------------
//
// Prisma implementation of the MessagingMessageRepository.
//
// Aggregate:
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// Persistence:
//
// MessagingMessage
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist Messaging Message aggregates.
// - Delete Messaging Message aggregates.
// - Retrieve Messaging Message aggregates.
// - Retrieve Messaging Message entities.
// - Query messages by public identity.
// - Query messages by internal identity.
// - Query messages by conversation identity.
// - Query messages by sender identity.
// - Query messages by asset identity.
// - Query messages by message status.
// - Query messages by message type.
// - Query messages by lifecycle state.
// - Execute existence checks.
//
// -----------------------------------------------------------------------------
//
// This repository contains persistence concerns only.
//
// It does NOT:
//
// - Load Identity aggregates.
// - Validate Identity aggregate state.
// - Load Journey aggregates.
// - Validate Journey aggregate state.
// - Load Booking aggregates.
// - Validate Booking aggregate state.
// - Load Asset aggregates.
// - Validate Asset aggregate state.
// - Perform authorization.
// - Decide whether a member may send a message.
// - Decide whether a message may be edited.
// - Decide whether a message may be deleted.
// - Decide whether a message may be moderated.
// - Deliver messages.
// - Send notifications.
// - Moderate content externally.
// - Upload or delete physical assets.
// - Publish domain events.
// - Perform application orchestration.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// The repository persists and reconstructs this consistency boundary.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// MessagingMessageEntity:
//
//     conversationPublicId
//     senderPublicId
//     assetPublicId
//
// These are opaque public references.
//
// The repository uses them only for persistence queries and never dereferences
// the referenced aggregates.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// MessagingMessageEntity contains:
//
//     conversationPublicId
//
// but MessagingMessage persists only:
//
//     conversationId
//
// Therefore, whenever a message is reconstructed, the owning conversation's
// public identifier must be loaded through the Prisma relation:
//
//     conversation.publicId
//
// The value is then converted into MessagingConversationPublicId and supplied
// to MessagingMessagePrismaMapper.messageToDomain().
//
// -----------------------------------------------------------------------------
//
// Persistence strategy:
//
// save() delegates persistence mapping to MessagingMessagePrismaMapper.
//
// The mapper is the single source of truth for:
//
// - internal identity;
// - public identity;
// - conversation identity;
// - sender identity;
// - message type;
// - message status;
// - content;
// - asset identity;
// - lifecycle timestamps;
// - creation/update timestamps.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// MessagingMessagePublicId has a public constructor:
//
//     new MessagingMessagePublicId(value)
//
// MessagingConversationPublicId also has a public constructor:
//
//     new MessagingConversationPublicId(value)
//
// MessagingMessageType and MessagingMessageStatus are constructed through
// their respective Value Object APIs.
//
// The repository does not invent Value Object construction APIs.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { MessagingMessageRepository } from '../../../../domain/repositories/messaging-message.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { MessagingMessageAggregate } from '../../../../domain/aggregates/messaging-message.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { MessagingMessageEntity } from '../../../../domain/entities/messaging-message.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { MessagingMessagePrismaMapper } from '../mappers/messaging-message-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects — Conversation
// -----------------------------------------------------------------------------

import { MessagingConversationPublicId } from '../../../../domain/value-objects/messaging-conversation-public-id.vo';

// -----------------------------------------------------------------------------
// Value Objects — Message
// -----------------------------------------------------------------------------

import type { MessagingMessagePublicId } from '../../../../domain/value-objects/messaging-message-public-id.vo';

import { MessagingMessageStatus } from '../../../../domain/value-objects/messaging-message-status.vo';

import { MessagingMessageType } from '../../../../domain/value-objects/messaging-message-type.vo';

// -----------------------------------------------------------------------------
// Value Objects — Sender
// -----------------------------------------------------------------------------

import type { MessagingMemberPublicId } from '../../../../domain/value-objects/messaging-member-public-id.vo';

// -----------------------------------------------------------------------------
// Value Objects — Asset
// -----------------------------------------------------------------------------

import type { MessagingAssetPublicId } from '../../../../domain/value-objects/messaging-asset-public-id.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Prisma Record Types
// =============================================================================

/**
 * Prisma Messaging Message record including the owning conversation public
 * identifier.
 *
 * MessagingMessage does not persist conversationPublicId directly.
 *
 * The relation is therefore included whenever the repository reconstructs a
 * domain message.
 */
type PrismaMessagingMessageRecord = Prisma.MessagingMessageGetPayload<{
  include: {
    conversation: {
      select: {
        publicId: true;
      };
    };
  };
}>;

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaMessagingMessageRepository implements MessagingMessageRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Prisma access is provided through the application's NestJS-managed
   * PrismaService.
   */
  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Messaging Message aggregate.
   *
   * Persistence mapping is delegated entirely to
   * MessagingMessagePrismaMapper.
   */
  public async save(aggregate: MessagingMessageAggregate): Promise<void> {
    this.ensureAggregate(aggregate, 'Messaging Message aggregate is required.');

    const persistence = MessagingMessagePrismaMapper.toPersistence(aggregate);

    const message = persistence.message;

    await this.prisma.messagingMessage.upsert({
      where: {
        id: message.id,
      },

      create: {
        id: message.id,
        publicId: message.publicId,

        conversationId: message.conversationId,

        senderPublicId: message.senderPublicId,

        type: message.type,
        status: message.status,

        content: message.content,
        assetId: message.assetId,

        sentAt: message.sentAt,
        editedAt: message.editedAt,
        deletedAt: message.deletedAt,
        moderatedAt: message.moderatedAt,

        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      },

      update: {
        publicId: message.publicId,

        conversationId: message.conversationId,

        senderPublicId: message.senderPublicId,

        type: message.type,
        status: message.status,

        content: message.content,
        assetId: message.assetId,

        sentAt: message.sentAt,
        editedAt: message.editedAt,
        deletedAt: message.deletedAt,
        moderatedAt: message.moderatedAt,

        updatedAt: message.updatedAt,
      },
    });
  }

  /**
   * Deletes a Messaging Message aggregate.
   */
  public async delete(aggregate: MessagingMessageAggregate): Promise<void> {
    this.ensureAggregate(aggregate, 'Messaging Message aggregate is required.');

    await this.prisma.messagingMessage.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries — Identity
  // ===========================================================================

  /**
   * Finds a Messaging Message aggregate by public identifier.
   */
  public async findByPublicId(
    publicId: MessagingMessagePublicId,
  ): Promise<MessagingMessageAggregate | null> {
    this.ensureValueObject(
      publicId,
      'Messaging Message public identifier is required.',
    );

    const record = await this.prisma.messagingMessage.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds a Messaging Message aggregate by internal identifier.
   */
  public async findById(
    id: UniqueEntityId,
  ): Promise<MessagingMessageAggregate | null> {
    this.ensureId(id, 'Messaging Message internal identifier is required.');

    const record = await this.prisma.messagingMessage.findUnique({
      where: {
        id: id.toString(),
      },

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Aggregate Queries — Conversation
  // ===========================================================================

  /**
   * Finds all Messaging Message aggregates belonging to a conversation by
   * internal conversation identifier.
   */
  public async findByConversationId(
    conversationId: UniqueEntityId,
  ): Promise<MessagingMessageAggregate[]> {
    this.ensureId(
      conversationId,
      'Messaging Conversation internal identifier is required.',
    );

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversationId: conversationId.toString(),
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all Messaging Message aggregates belonging to a conversation by
   * public identifier.
   */
  public async findByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    this.ensureConversationPublicId(conversationPublicId);

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Sender
  // ===========================================================================

  /**
   * Finds all Messaging Message aggregates sent by a member.
   */
  public async findBySenderPublicId(
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    this.ensureValueObject(
      senderPublicId,
      'Messaging Member public identifier is required.',
    );

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        senderPublicId: senderPublicId.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all Messaging Message aggregates sent by a member within a
   * conversation.
   */
  public async findBySenderPublicIdInConversation(
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    this.ensureConversationPublicId(conversationPublicId);

    this.ensureValueObject(
      senderPublicId,
      'Messaging Member public identifier is required.',
    );

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        senderPublicId: senderPublicId.value,

        conversation: {
          publicId: conversationPublicId.value,
        },
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Asset
  // ===========================================================================

  /**
   * Finds all Messaging Message aggregates referencing an asset.
   */
  public async findByAssetPublicId(
    assetPublicId: MessagingAssetPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    this.ensureValueObject(
      assetPublicId,
      'Messaging Asset public identifier is required.',
    );

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        assetId: assetPublicId.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — State
  // ===========================================================================

  /**
   * Finds all Messaging Message aggregates with the supplied status.
   */
  public async findByStatus(
    status: MessagingMessageStatus,
  ): Promise<MessagingMessageAggregate[]> {
    this.ensureValueObject(status, 'Messaging Message status is required.');

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        status: status.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all Messaging Message aggregates with the supplied type.
   */
  public async findByType(
    type: MessagingMessageType,
  ): Promise<MessagingMessageAggregate[]> {
    this.ensureValueObject(type, 'Messaging Message type is required.');

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        type: type.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds messages by conversation and status.
   */
  public async findByConversationPublicIdAndStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingMessageStatus,
  ): Promise<MessagingMessageAggregate[]> {
    this.ensureConversationPublicId(conversationPublicId);

    this.ensureValueObject(status, 'Messaging Message status is required.');

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },

        status: status.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds messages by conversation and type.
   */
  public async findByConversationPublicIdAndType(
    conversationPublicId: MessagingConversationPublicId,
    type: MessagingMessageType,
  ): Promise<MessagingMessageAggregate[]> {
    this.ensureConversationPublicId(conversationPublicId);

    this.ensureValueObject(type, 'Messaging Message type is required.');

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },

        type: type.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds messages by conversation and sender.
   */
  public async findByConversationPublicIdAndSenderPublicId(
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    this.ensureConversationPublicId(conversationPublicId);

    this.ensureValueObject(
      senderPublicId,
      'Messaging Member public identifier is required.',
    );

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },

        senderPublicId: senderPublicId.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds messages by conversation, status, and type.
   */
  public async findByConversationPublicIdAndStatusAndType(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingMessageStatus,
    type: MessagingMessageType,
  ): Promise<MessagingMessageAggregate[]> {
    this.ensureConversationPublicId(conversationPublicId);

    this.ensureValueObject(status, 'Messaging Message status is required.');

    this.ensureValueObject(type, 'Messaging Message type is required.');

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },

        status: status.value,
        type: type.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Lifecycle
  // ===========================================================================

  /**
   * Finds all sent Messaging Message aggregates.
   */
  public async findSent(): Promise<MessagingMessageAggregate[]> {
    return this.findByStatus(this.createMessageStatus('SENT'));
  }

  /**
   * Finds all edited Messaging Message aggregates.
   */
  public async findEdited(): Promise<MessagingMessageAggregate[]> {
    return this.findByStatus(this.createMessageStatus('EDITED'));
  }

  /**
   * Finds all deleted Messaging Message aggregates.
   */
  public async findDeleted(): Promise<MessagingMessageAggregate[]> {
    return this.findByStatus(this.createMessageStatus('DELETED'));
  }

  /**
   * Finds all moderated Messaging Message aggregates.
   */
  public async findModerated(): Promise<MessagingMessageAggregate[]> {
    return this.findByStatus(this.createMessageStatus('MODERATED'));
  }

  /**
   * Finds sent messages belonging to a conversation.
   */
  public async findSentByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    return this.findByConversationPublicIdAndStatus(
      conversationPublicId,
      this.createMessageStatus('SENT'),
    );
  }

  /**
   * Finds edited messages belonging to a conversation.
   */
  public async findEditedByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    return this.findByConversationPublicIdAndStatus(
      conversationPublicId,
      this.createMessageStatus('EDITED'),
    );
  }

  /**
   * Finds deleted messages belonging to a conversation.
   */
  public async findDeletedByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    return this.findByConversationPublicIdAndStatus(
      conversationPublicId,
      this.createMessageStatus('DELETED'),
    );
  }

  /**
   * Finds moderated messages belonging to a conversation.
   */
  public async findModeratedByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    return this.findByConversationPublicIdAndStatus(
      conversationPublicId,
      this.createMessageStatus('MODERATED'),
    );
  }

  // ===========================================================================
  // Aggregate Queries — Message Type
  // ===========================================================================

  /**
   * Finds all text message aggregates.
   */
  public async findTextMessages(): Promise<MessagingMessageAggregate[]> {
    return this.findByType(this.createMessageType('TEXT'));
  }

  /**
   * Finds all image message aggregates.
   */
  public async findImageMessages(): Promise<MessagingMessageAggregate[]> {
    return this.findByType(this.createMessageType('IMAGE'));
  }

  /**
   * Finds all file message aggregates.
   */
  public async findFileMessages(): Promise<MessagingMessageAggregate[]> {
    return this.findByType(this.createMessageType('FILE'));
  }

  /**
   * Finds all system message aggregates.
   */
  public async findSystemMessages(): Promise<MessagingMessageAggregate[]> {
    return this.findByType(this.createMessageType('SYSTEM'));
  }

  /**
   * Finds text messages belonging to a conversation.
   */
  public async findTextMessagesByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    return this.findByConversationPublicIdAndType(
      conversationPublicId,
      this.createMessageType('TEXT'),
    );
  }

  /**
   * Finds image messages belonging to a conversation.
   */
  public async findImageMessagesByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    return this.findByConversationPublicIdAndType(
      conversationPublicId,
      this.createMessageType('IMAGE'),
    );
  }

  /**
   * Finds file messages belonging to a conversation.
   */
  public async findFileMessagesByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    return this.findByConversationPublicIdAndType(
      conversationPublicId,
      this.createMessageType('FILE'),
    );
  }

  /**
   * Finds system messages belonging to a conversation.
   */
  public async findSystemMessagesByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]> {
    return this.findByConversationPublicIdAndType(
      conversationPublicId,
      this.createMessageType('SYSTEM'),
    );
  }

  // ===========================================================================
  // Entity Queries — Identity
  // ===========================================================================

  /**
   * Finds a Messaging Message entity by public identifier.
   */
  public async findEntityByPublicId(
    publicId: MessagingMessagePublicId,
  ): Promise<MessagingMessageEntity | null> {
    this.ensureValueObject(
      publicId,
      'Messaging Message public identifier is required.',
    );

    const record = await this.prisma.messagingMessage.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return record === null ? null : this.toEntity(record);
  }

  /**
   * Finds a Messaging Message entity by internal identifier.
   */
  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<MessagingMessageEntity | null> {
    this.ensureId(id, 'Messaging Message internal identifier is required.');

    const record = await this.prisma.messagingMessage.findUnique({
      where: {
        id: id.toString(),
      },

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return record === null ? null : this.toEntity(record);
  }

  // ===========================================================================
  // Entity Queries — Conversation
  // ===========================================================================

  /**
   * Finds message entities belonging to a conversation by internal identity.
   */
  public async findEntitiesByConversationId(
    conversationId: UniqueEntityId,
  ): Promise<MessagingMessageEntity[]> {
    this.ensureId(
      conversationId,
      'Messaging Conversation internal identifier is required.',
    );

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversationId: conversationId.toString(),
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  /**
   * Finds message entities belonging to a conversation by public identity.
   */
  public async findEntitiesByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageEntity[]> {
    this.ensureConversationPublicId(conversationPublicId);

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  // ===========================================================================
  // Entity Queries — Sender
  // ===========================================================================

  /**
   * Finds message entities sent by a member.
   */
  public async findEntitiesBySenderPublicId(
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageEntity[]> {
    this.ensureValueObject(
      senderPublicId,
      'Messaging Member public identifier is required.',
    );

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        senderPublicId: senderPublicId.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  /**
   * Finds message entities sent by a member within a conversation.
   */
  public async findEntitiesBySenderPublicIdInConversation(
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageEntity[]> {
    this.ensureConversationPublicId(conversationPublicId);

    this.ensureValueObject(
      senderPublicId,
      'Messaging Member public identifier is required.',
    );

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        senderPublicId: senderPublicId.value,

        conversation: {
          publicId: conversationPublicId.value,
        },
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  // ===========================================================================
  // Entity Queries — Asset
  // ===========================================================================

  /**
   * Finds message entities referencing an asset.
   */
  public async findEntitiesByAssetPublicId(
    assetPublicId: MessagingAssetPublicId,
  ): Promise<MessagingMessageEntity[]> {
    this.ensureValueObject(
      assetPublicId,
      'Messaging Asset public identifier is required.',
    );

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        assetId: assetPublicId.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  // ===========================================================================
  // Entity Queries — State
  // ===========================================================================

  /**
   * Finds message entities by status.
   */
  public async findEntitiesByStatus(
    status: MessagingMessageStatus,
  ): Promise<MessagingMessageEntity[]> {
    this.ensureValueObject(status, 'Messaging Message status is required.');

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        status: status.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  /**
   * Finds message entities by type.
   */
  public async findEntitiesByType(
    type: MessagingMessageType,
  ): Promise<MessagingMessageEntity[]> {
    this.ensureValueObject(type, 'Messaging Message type is required.');

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        type: type.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  /**
   * Finds message entities by conversation and status.
   */
  public async findEntitiesByConversationPublicIdAndStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingMessageStatus,
  ): Promise<MessagingMessageEntity[]> {
    this.ensureConversationPublicId(conversationPublicId);

    this.ensureValueObject(status, 'Messaging Message status is required.');

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },

        status: status.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  /**
   * Finds message entities by conversation and type.
   */
  public async findEntitiesByConversationPublicIdAndType(
    conversationPublicId: MessagingConversationPublicId,
    type: MessagingMessageType,
  ): Promise<MessagingMessageEntity[]> {
    this.ensureConversationPublicId(conversationPublicId);

    this.ensureValueObject(type, 'Messaging Message type is required.');

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },

        type: type.value,
      },

      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  // ===========================================================================
  // Entity Queries — Lifecycle
  // ===========================================================================

  /**
   * Finds all sent message entities.
   */
  public async findSentEntities(): Promise<MessagingMessageEntity[]> {
    return this.findEntitiesByStatus(this.createMessageStatus('SENT'));
  }

  /**
   * Finds all edited message entities.
   */
  public async findEditedEntities(): Promise<MessagingMessageEntity[]> {
    return this.findEntitiesByStatus(this.createMessageStatus('EDITED'));
  }

  /**
   * Finds all deleted message entities.
   */
  public async findDeletedEntities(): Promise<MessagingMessageEntity[]> {
    return this.findEntitiesByStatus(this.createMessageStatus('DELETED'));
  }

  /**
   * Finds all moderated message entities.
   */
  public async findModeratedEntities(): Promise<MessagingMessageEntity[]> {
    return this.findEntitiesByStatus(this.createMessageStatus('MODERATED'));
  }

  // ===========================================================================
  // Aggregate Queries — All
  // ===========================================================================

  /**
   * Finds all Messaging Message aggregates.
   */
  public async findAll(): Promise<MessagingMessageAggregate[]> {
    const records = await this.prisma.messagingMessage.findMany({
      orderBy: [
        {
          sentAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Existence — Identity
  // ===========================================================================

  /**
   * Checks existence by message public identifier.
   */
  public async existsByPublicId(
    publicId: MessagingMessagePublicId,
  ): Promise<boolean> {
    this.ensureValueObject(
      publicId,
      'Messaging Message public identifier is required.',
    );

    const record = await this.prisma.messagingMessage.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks existence by message internal identifier.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    this.ensureId(id, 'Messaging Message internal identifier is required.');

    const record = await this.prisma.messagingMessage.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence — Conversation
  // ===========================================================================

  /**
   * Checks whether a message exists for a conversation by internal identity.
   */
  public async existsByConversationId(
    conversationId: UniqueEntityId,
  ): Promise<boolean> {
    this.ensureId(
      conversationId,
      'Messaging Conversation internal identifier is required.',
    );

    const record = await this.prisma.messagingMessage.findFirst({
      where: {
        conversationId: conversationId.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks whether a message exists for a conversation by public identity.
   */
  public async existsByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean> {
    this.ensureConversationPublicId(conversationPublicId);

    const record = await this.prisma.messagingMessage.findFirst({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence — Sender
  // ===========================================================================

  /**
   * Checks whether a message exists from a sender.
   */
  public async existsBySenderPublicId(
    senderPublicId: MessagingMemberPublicId,
  ): Promise<boolean> {
    this.ensureValueObject(
      senderPublicId,
      'Messaging Member public identifier is required.',
    );

    const record = await this.prisma.messagingMessage.findFirst({
      where: {
        senderPublicId: senderPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks whether a message exists from a sender within a conversation.
   */
  public async existsBySenderPublicIdInConversation(
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
  ): Promise<boolean> {
    this.ensureConversationPublicId(conversationPublicId);

    this.ensureValueObject(
      senderPublicId,
      'Messaging Member public identifier is required.',
    );

    const record = await this.prisma.messagingMessage.findFirst({
      where: {
        senderPublicId: senderPublicId.value,

        conversation: {
          publicId: conversationPublicId.value,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence — Asset
  // ===========================================================================

  /**
   * Checks whether a message references an asset.
   */
  public async existsByAssetPublicId(
    assetPublicId: MessagingAssetPublicId,
  ): Promise<boolean> {
    this.ensureValueObject(
      assetPublicId,
      'Messaging Asset public identifier is required.',
    );

    const record = await this.prisma.messagingMessage.findFirst({
      where: {
        assetId: assetPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence — State
  // ===========================================================================

  /**
   * Checks whether a message with the supplied status exists.
   */
  public async existsByStatus(
    status: MessagingMessageStatus,
  ): Promise<boolean> {
    this.ensureValueObject(status, 'Messaging Message status is required.');

    const record = await this.prisma.messagingMessage.findFirst({
      where: {
        status: status.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks whether a message with the supplied type exists.
   */
  public async existsByType(type: MessagingMessageType): Promise<boolean> {
    this.ensureValueObject(type, 'Messaging Message type is required.');

    const record = await this.prisma.messagingMessage.findFirst({
      where: {
        type: type.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks whether a message with the supplied status exists within a
   * conversation.
   */
  public async existsByConversationPublicIdAndStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingMessageStatus,
  ): Promise<boolean> {
    this.ensureConversationPublicId(conversationPublicId);

    this.ensureValueObject(status, 'Messaging Message status is required.');

    const record = await this.prisma.messagingMessage.findFirst({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },

        status: status.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks whether a message with the supplied type exists within a
   * conversation.
   */
  public async existsByConversationPublicIdAndType(
    conversationPublicId: MessagingConversationPublicId,
    type: MessagingMessageType,
  ): Promise<boolean> {
    this.ensureConversationPublicId(conversationPublicId);

    this.ensureValueObject(type, 'Messaging Message type is required.');

    const record = await this.prisma.messagingMessage.findFirst({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },

        type: type.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence — Lifecycle
  // ===========================================================================

  /**
   * Checks whether at least one sent message exists.
   */
  public async existsSent(): Promise<boolean> {
    return this.existsByStatus(this.createMessageStatus('SENT'));
  }

  /**
   * Checks whether at least one edited message exists.
   */
  public async existsEdited(): Promise<boolean> {
    return this.existsByStatus(this.createMessageStatus('EDITED'));
  }

  /**
   * Checks whether at least one deleted message exists.
   */
  public async existsDeleted(): Promise<boolean> {
    return this.existsByStatus(this.createMessageStatus('DELETED'));
  }

  /**
   * Checks whether at least one moderated message exists.
   */
  public async existsModerated(): Promise<boolean> {
    return this.existsByStatus(this.createMessageStatus('MODERATED'));
  }

  // ===========================================================================
  // Existence — Message Type
  // ===========================================================================

  /**
   * Checks whether at least one text message exists.
   */
  public async existsTextMessages(): Promise<boolean> {
    return this.existsByType(this.createMessageType('TEXT'));
  }

  /**
   * Checks whether at least one image message exists.
   */
  public async existsImageMessages(): Promise<boolean> {
    return this.existsByType(this.createMessageType('IMAGE'));
  }

  /**
   * Checks whether at least one file message exists.
   */
  public async existsFileMessages(): Promise<boolean> {
    return this.existsByType(this.createMessageType('FILE'));
  }

  /**
   * Checks whether at least one system message exists.
   */
  public async existsSystemMessages(): Promise<boolean> {
    return this.existsByType(this.createMessageType('SYSTEM'));
  }

  // ===========================================================================
  // Private — Mapping
  // ===========================================================================

  /**
   * Converts a Prisma Messaging Message record into a domain aggregate.
   */
  private toAggregate(
    record: PrismaMessagingMessageRecord,
  ): MessagingMessageAggregate {
    const entity = this.toEntity(record);

    return MessagingMessageAggregate.rehydrate(entity);
  }

  /**
   * Converts a Prisma Messaging Message record into a domain entity.
   *
   * The owning conversation public identifier is reconstructed from the
   * conversation relation.
   */
  private toEntity(
    record: PrismaMessagingMessageRecord,
  ): MessagingMessageEntity {
    this.ensureConversationPublicIdOnRecord(record);

    const conversationPublicId = new MessagingConversationPublicId(
      record.conversation.publicId,
    );

    return MessagingMessagePrismaMapper.messageToDomain(
      record,
      conversationPublicId,
    );
  }

  /**
   * Ensures the owning conversation public identifier is available before
   * attempting domain reconstruction.
   */
  private ensureConversationPublicIdOnRecord(
    record: PrismaMessagingMessageRecord,
  ): void {
    if (
      record.conversation === undefined ||
      record.conversation === null ||
      record.conversation.publicId === undefined ||
      record.conversation.publicId === null
    ) {
      throw new Error(
        'Messaging Conversation public identifier is required to reconstruct a Messaging Message.',
      );
    }
  }

  // ===========================================================================
  // Private — Value Object Construction
  // ===========================================================================

  /**
   * Creates a Messaging Message status Value Object.
   */
  private createMessageStatus(
    value: 'SENT' | 'EDITED' | 'DELETED' | 'MODERATED',
  ): MessagingMessageStatus {
    return MessagingMessageStatus.create(value);
  }

  /**
   * Creates a Messaging Message type Value Object.
   *
   * The Value Object factory is used instead of an unsafe type assertion.
   */
  private createMessageType(
    value: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM',
  ): MessagingMessageType {
    return MessagingMessageType.create(value);
  }

  // ===========================================================================
  // Private — Validation
  // ===========================================================================

  /**
   * Ensures an aggregate is present.
   */
  private ensureAggregate(
    value: MessagingMessageAggregate,
    message: string,
  ): void {
    if (value === undefined || value === null) {
      throw new Error(message);
    }
  }

  /**
   * Ensures an internal identifier is present.
   */
  private ensureId(value: UniqueEntityId, message: string): void {
    if (value === undefined || value === null) {
      throw new Error(message);
    }
  }

  /**
   * Ensures a conversation public identifier is present.
   */
  private ensureConversationPublicId(
    value: MessagingConversationPublicId,
  ): void {
    if (value === undefined || value === null) {
      throw new Error('Messaging Conversation public identifier is required.');
    }
  }

  /**
   * Ensures a generic Value Object is present.
   */
  private ensureValueObject<T>(value: T, message: string): void {
    if (value === undefined || value === null) {
      throw new Error(message);
    }
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaMessagingMessageRepository;
