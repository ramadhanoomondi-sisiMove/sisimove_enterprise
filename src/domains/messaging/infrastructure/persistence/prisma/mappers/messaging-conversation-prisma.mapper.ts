// -----------------------------------------------------------------------------
// Messaging Conversation — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Prisma mapper for the Messaging Conversation aggregate.
//
// Aggregate:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity[]
//
// Persistence:
//
// MessagingConversation
// ├── MessagingConversationParticipant[]
// └── MessagingMessage[]
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - map Prisma Messaging Conversation records to the domain aggregate;
// - map Prisma Messaging Conversation records to the conversation entity;
// - map Prisma participant records to participant entities;
// - map Prisma message records to message entities;
// - map Messaging Conversation entities to Prisma persistence data;
// - preserve internal identities;
// - preserve public identities;
// - preserve lifecycle timestamps;
// - reconstruct opaque cross-domain public identities;
// - reconstruct aggregate-owned participants;
// - reconstruct aggregate-owned messages.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// MessagingMessageEntity.conversationPublicId is NOT persisted directly on
// MessagingMessage.
//
// The Prisma MessagingMessage record stores conversationId. The conversation
// public identity is therefore supplied from the owning MessagingConversation
// record during rehydration.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// - journeyPublicId references Journey.publicId;
// - bookingPublicId references Booking.publicId;
// - memberPublicId references Identity.publicId;
// - assetPublicId references Asset.publicId.
//
// Messaging owns none of these referenced aggregates.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - access repositories;
// - perform authorization;
// - validate Identity;
// - validate Journey;
// - validate Booking;
// - validate Assets;
// - execute business workflows;
// - emit domain events.
//
// Domain invariants remain owned by the domain model.
//
// Persistence orchestration remains owned by the repository.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  MessagingConversation as PrismaMessagingConversation,
  MessagingConversationParticipant as PrismaMessagingConversationParticipant,
  MessagingMessage as PrismaMessagingMessage,
  Prisma,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { MessagingConversationAggregate } from '../../../../domain/aggregates/messaging-conversation.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { MessagingConversationEntity } from '../../../../domain/entities/messaging-conversation.entity';

import { MessagingConversationParticipantEntity } from '../../../../domain/entities/messaging-conversation-participant.entity';

import { MessagingMessageEntity } from '../../../../domain/entities/messaging-message.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  MessagingAssetPublicId,
  MessagingBookingPublicId,
  MessagingConversationParticipantPublicId,
  MessagingConversationPublicId,
  MessagingConversationStatus,
  MessagingConversationType,
  MessagingJourneyPublicId,
  MessagingMemberPublicId,
  MessagingMessageContent,
  MessagingMessagePublicId,
  MessagingMessageStatus,
  MessagingMessageType,
  MessagingParticipantRole,
  MessagingParticipantStatus,
} from '../../../../domain/value-objects';

// =============================================================================
// Prisma Aggregate Record
// =============================================================================
//
// The complete Messaging Conversation aggregate requires the conversation,
// participants, and messages to be loaded together.
//
// =============================================================================

export type PrismaMessagingConversationAggregateRecord =
  Prisma.MessagingConversationGetPayload<{
    include: {
      participants: true;
      messages: true;
    };
  }>;

// =============================================================================
// Persistence Types
// =============================================================================

export interface MessagingConversationPersistence {
  conversation: {
    id: string;
    publicId: string;
    type: PrismaMessagingConversation['type'];
    status: PrismaMessagingConversation['status'];
    journeyPublicId: string;
    bookingPublicId: string | null;
    lastMessageAt: Date | null;
    closedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };

  participants: {
    id: string;
    publicId: string;
    conversationId: string;
    memberPublicId: string;
    role: PrismaMessagingConversationParticipant['role'];
    status: PrismaMessagingConversationParticipant['status'];
    joinedAt: Date;
    leftAt: Date | null;
    removedAt: Date | null;
    lastReadAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }[];

  messages: {
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
  }[];
}

// =============================================================================
// Mapper
// =============================================================================

export class MessagingConversationPrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates a complete Messaging Conversation aggregate.
   *
   * The aggregate contains:
   *
   * - MessagingConversationEntity;
   * - MessagingConversationParticipantEntity[];
   * - MessagingMessageEntity[].
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(
    record: PrismaMessagingConversationAggregateRecord,
  ): MessagingConversationAggregate {
    if (record === undefined || record === null) {
      throw new Error('Messaging Conversation Prisma record is required.');
    }

    const conversation = this.conversationToDomain(record);

    const participants = record.participants.map((participant) =>
      this.participantToDomain(participant),
    );

    const messages = record.messages.map((message) =>
      this.messageToDomain(message, conversation.publicId),
    );

    return MessagingConversationAggregate.rehydrate(
      conversation,
      participants,
      messages,
    );
  }

  // ===========================================================================
  // Prisma → Domain Conversation Entity
  // ===========================================================================

  /**
   * Maps a Prisma Messaging Conversation record to the domain conversation
   * entity.
   */
  public static conversationToDomain(
    record: PrismaMessagingConversation,
  ): MessagingConversationEntity {
    if (record === undefined || record === null) {
      throw new Error('Messaging Conversation Prisma record is required.');
    }

    const publicId = new MessagingConversationPublicId(record.publicId);

    const journeyPublicId = MessagingJourneyPublicId.create(
      record.journeyPublicId,
    );

    const bookingPublicId =
      record.bookingPublicId === null
        ? undefined
        : MessagingBookingPublicId.create(record.bookingPublicId);

    const lastMessageAt =
      record.lastMessageAt === null
        ? undefined
        : new Date(record.lastMessageAt.getTime());

    const closedAt =
      record.closedAt === null
        ? undefined
        : new Date(record.closedAt.getTime());

    return MessagingConversationEntity.rehydrate(
      {
        type: MessagingConversationType.create(record.type),

        status: MessagingConversationStatus.create(record.status),

        journeyPublicId,

        bookingPublicId,

        lastMessageAt,

        closedAt,

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  // ===========================================================================
  // Prisma → Domain Participant Entity
  // ===========================================================================

  /**
   * Maps a Prisma Messaging Conversation Participant record to the domain
   * participant entity.
   */
  public static participantToDomain(
    record: PrismaMessagingConversationParticipant,
  ): MessagingConversationParticipantEntity {
    if (record === undefined || record === null) {
      throw new Error(
        'Messaging Conversation Participant Prisma record is required.',
      );
    }

    const publicId = new MessagingConversationParticipantPublicId(
      record.publicId,
    );

    const memberPublicId = MessagingMemberPublicId.create(
      record.memberPublicId,
    );

    const leftAt =
      record.leftAt === null ? undefined : new Date(record.leftAt.getTime());

    const removedAt =
      record.removedAt === null
        ? undefined
        : new Date(record.removedAt.getTime());

    const lastReadAt =
      record.lastReadAt === null
        ? undefined
        : new Date(record.lastReadAt.getTime());

    return MessagingConversationParticipantEntity.rehydrate(
      {
        conversationId: new UniqueEntityId(record.conversationId),

        memberPublicId,

        role: MessagingParticipantRole.create(record.role),

        status: MessagingParticipantStatus.create(record.status),

        joinedAt: new Date(record.joinedAt.getTime()),

        leftAt,

        removedAt,

        lastReadAt,

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  // ===========================================================================
  // Prisma → Domain Message Entity
  // ===========================================================================

  /**
   * Maps a Prisma Messaging Message record to the domain message entity.
   *
   * MessagingMessageEntity.conversationPublicId is reconstructed from the
   * owning MessagingConversation aggregate.
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
        'Messaging Conversation public identity is required when rehydrating a Messaging Message.',
      );
    }

    const content =
      record.content === null
        ? undefined
        : MessagingMessageContent.create(record.content);

    const assetPublicId =
      record.assetId === null
        ? undefined
        : MessagingAssetPublicId.create(record.assetId);

    const editedAt =
      record.editedAt === null
        ? undefined
        : new Date(record.editedAt.getTime());

    const deletedAt =
      record.deletedAt === null
        ? undefined
        : new Date(record.deletedAt.getTime());

    const moderatedAt =
      record.moderatedAt === null
        ? undefined
        : new Date(record.moderatedAt.getTime());

    return MessagingMessageEntity.rehydrate(
      {
        conversationId: new UniqueEntityId(record.conversationId),

        conversationPublicId,

        senderPublicId: MessagingMemberPublicId.create(record.senderPublicId),

        type: MessagingMessageType.create(record.type),

        status: MessagingMessageStatus.create(record.status),

        content,

        assetPublicId,

        sentAt: new Date(record.sentAt.getTime()),

        editedAt,

        deletedAt,

        moderatedAt,

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      new UniqueEntityId(record.id),

      new MessagingMessagePublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Domain Conversation Entity → Prisma Persistence
  // ===========================================================================

  /**
   * Maps the Messaging Conversation entity to Prisma persistence data.
   */
  public static conversationToPersistence(
    entity: MessagingConversationEntity,
  ): MessagingConversationPersistence['conversation'] {
    if (entity === undefined || entity === null) {
      throw new Error('Messaging Conversation entity is required.');
    }

    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      type: entity.type.value,

      status: entity.status.value,

      journeyPublicId: entity.journeyPublicId.value,

      bookingPublicId: entity.bookingPublicId?.value ?? null,

      lastMessageAt: entity.lastMessageAt ?? null,

      closedAt: entity.closedAt ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Domain Participant Entity → Prisma Persistence
  // ===========================================================================

  /**
   * Maps the Messaging Conversation Participant entity to Prisma persistence
   * data.
   */
  public static participantToPersistence(
    entity: MessagingConversationParticipantEntity,
  ): MessagingConversationPersistence['participants'][number] {
    if (entity === undefined || entity === null) {
      throw new Error('Messaging Conversation Participant entity is required.');
    }

    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      conversationId: entity.conversationId.toString(),

      memberPublicId: entity.memberPublicId.value,

      role: entity.role.value,

      status: entity.status.value,

      joinedAt: entity.joinedAt,

      leftAt: entity.leftAt ?? null,

      removedAt: entity.removedAt ?? null,

      lastReadAt: entity.lastReadAt ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Domain Message Entity → Prisma Persistence
  // ===========================================================================

  /**
   * Maps the Messaging Message entity to Prisma persistence data.
   *
   * MessagingMessageEntity.conversationPublicId is intentionally not persisted.
   *
   * MessagingMessage stores the owning conversation through conversationId.
   */
  public static messageToPersistence(
    entity: MessagingMessageEntity,
  ): MessagingConversationPersistence['messages'][number] {
    if (entity === undefined || entity === null) {
      throw new Error('Messaging Message entity is required.');
    }

    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      conversationId: entity.conversationId.toString(),

      senderPublicId: entity.senderPublicId.value,

      type: entity.type.value,

      status: entity.status.value,

      content: entity.content?.value ?? null,

      assetId: entity.assetPublicId?.value ?? null,

      sentAt: entity.sentAt,

      editedAt: entity.editedAt ?? null,

      deletedAt: entity.deletedAt ?? null,

      moderatedAt: entity.moderatedAt ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Domain Aggregate → Prisma Persistence
  // ===========================================================================

  /**
   * Maps the complete Messaging Conversation aggregate to persistence data.
   *
   * The aggregate is decomposed into:
   *
   * - conversation;
   * - participants;
   * - messages.
   *
   * Transactional persistence remains the responsibility of the repository.
   */
  public static toPersistence(
    aggregate: MessagingConversationAggregate,
  ): MessagingConversationPersistence {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Messaging Conversation aggregate is required.');
    }

    return {
      conversation: this.conversationToPersistence(aggregate.conversation),

      participants: aggregate.participants.map((participant) =>
        this.participantToPersistence(participant),
      ),

      messages: aggregate.messages.map((message) =>
        this.messageToPersistence(message),
      ),
    };
  }

  // ===========================================================================
  // Conversation Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma Messaging Conversation record directly to the domain
   * conversation entity.
   */
  public static toConversationDomain(
    record: PrismaMessagingConversation,
  ): MessagingConversationEntity {
    return this.conversationToDomain(record);
  }

  /**
   * Maps a complete Prisma Messaging Conversation record to the domain
   * aggregate.
   */
  public static toConversationAggregate(
    record: PrismaMessagingConversationAggregateRecord,
  ): MessagingConversationAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Participant Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma participant record directly to the domain participant
   * entity.
   */
  public static toParticipantDomain(
    record: PrismaMessagingConversationParticipant,
  ): MessagingConversationParticipantEntity {
    return this.participantToDomain(record);
  }

  // ===========================================================================
  // Message Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma message record directly to the domain message entity.
   *
   * The owning conversation public identity must be supplied because it is
   * intentionally not persisted on MessagingMessage.
   */
  public static toMessageDomain(
    record: PrismaMessagingMessage,
    conversationPublicId: MessagingConversationPublicId,
  ): MessagingMessageEntity {
    return this.messageToDomain(record, conversationPublicId);
  }

  // ===========================================================================
  // Generic Domain Component Mapping
  // ===========================================================================

  /**
   * Maps a complete Prisma Messaging Conversation aggregate record to the
   * domain aggregate.
   */
  public static toDomainComponent(
    record: PrismaMessagingConversationAggregateRecord,
  ): MessagingConversationAggregate {
    return this.toDomain(record);
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default MessagingConversationPrismaMapper;
