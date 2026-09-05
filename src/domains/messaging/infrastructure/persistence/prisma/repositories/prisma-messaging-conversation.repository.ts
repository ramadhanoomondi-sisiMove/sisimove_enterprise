// -----------------------------------------------------------------------------
// Messaging — Prisma Conversation Repository
// -----------------------------------------------------------------------------
//
// Prisma implementation of the MessagingConversationRepository.
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
// - Persist complete Messaging Conversation aggregates.
// - Retrieve complete Messaging Conversation aggregates.
// - Retrieve Messaging Conversation entities.
// - Retrieve Messaging Conversation participants.
// - Retrieve Messaging Messages.
// - Query conversations by public identity.
// - Query conversations by internal identity.
// - Query conversations by Journey public identity.
// - Query conversations by Booking public identity.
// - Query conversations by conversation type.
// - Query conversations by conversation status.
// - Query conversations by participant membership.
// - Query participants by member public identity.
// - Query participants by status.
// - Query participants by role.
// - Query messages by sender.
// - Query messages by status.
// - Query messages by type.
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
// - Decide whether a member may join a conversation.
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
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity[]
//
// The repository persists and reconstructs this entire consistency boundary.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// MessagingConversationEntity:
//     journeyPublicId
//     bookingPublicId
//
// MessagingConversationParticipantEntity:
//     memberPublicId
//
// MessagingMessageEntity:
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
// Persistence strategy:
//
// save() performs the complete aggregate persistence operation inside one
// Prisma transaction.
//
// The operation:
//
// 1. Upserts the conversation root.
// 2. Removes participant records no longer present in the aggregate.
// 3. Upserts all participants.
// 4. Removes message records no longer present in the aggregate.
// 5. Upserts all messages.
//
// This guarantees that the persisted child collections represent the aggregate
// state at the time of persistence.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// MessagingMessageEntity contains conversationPublicId in the domain model,
// but MessagingMessage does not persist that value.
//
// The repository therefore persists only:
//
//     conversationId
//
// The conversation public identifier is reconstructed from the owning
// MessagingConversation record by MessagingConversationPrismaMapper.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  MessagingConversation as PrismaMessagingConversation,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { MessagingConversationRepository } from '../../../../domain/repositories/messaging-conversation.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { MessagingConversationAggregate } from '../../../../domain/aggregates/messaging-conversation.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import type { MessagingConversationEntity } from '../../../../domain/entities/messaging-conversation.entity';

import type { MessagingConversationParticipantEntity } from '../../../../domain/entities/messaging-conversation-participant.entity';

import type { MessagingMessageEntity } from '../../../../domain/entities/messaging-message.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { MessagingConversationPrismaMapper } from '../mappers/messaging-conversation-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects — Conversation
// -----------------------------------------------------------------------------

import { MessagingConversationPublicId } from '../../../../domain/value-objects/messaging-conversation-public-id.vo';

import type { MessagingConversationType } from '../../../../domain/value-objects/messaging-conversation-type.vo';

import type { MessagingConversationStatus } from '../../../../domain/value-objects/messaging-conversation-status.vo';

import type { MessagingJourneyPublicId } from '../../../../domain/value-objects/messaging-journey-public-id.vo';

import type { MessagingBookingPublicId } from '../../../../domain/value-objects/messaging-booking-public-id.vo';

// -----------------------------------------------------------------------------
// Value Objects — Participant
// -----------------------------------------------------------------------------

import type { MessagingConversationParticipantPublicId } from '../../../../domain/value-objects/messaging-conversation-participant-public-id.vo';

import type { MessagingMemberPublicId } from '../../../../domain/value-objects/messaging-member-public-id.vo';

import type { MessagingParticipantRole } from '../../../../domain/value-objects/messaging-participant-role.vo';

import { MessagingParticipantStatus } from '../../../../domain/value-objects/messaging-participant-status.vo';

// -----------------------------------------------------------------------------
// Value Objects — Message
// -----------------------------------------------------------------------------

import type { MessagingMessagePublicId } from '../../../../domain/value-objects/messaging-message-public-id.vo';

import type { MessagingMessageType } from '../../../../domain/value-objects/messaging-message-type.vo';

import { MessagingMessageStatus } from '../../../../domain/value-objects/messaging-message-status.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaMessagingConversationRepository implements MessagingConversationRepository {
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
   * Persists a complete Messaging Conversation aggregate.
   *
   * The conversation root, participants, and messages are persisted inside
   * one database transaction.
   *
   * Child records that no longer belong to the aggregate are removed.
   */
  public async save(aggregate: MessagingConversationAggregate): Promise<void> {
    this.ensureAggregate(
      aggregate,
      'Messaging Conversation aggregate is required.',
    );

    const persistence =
      MessagingConversationPrismaMapper.toPersistence(aggregate);

    await this.prisma.$transaction(async (transaction) => {
      await transaction.messagingConversation.upsert({
        where: {
          id: persistence.conversation.id,
        },

        create: {
          id: persistence.conversation.id,
          publicId: persistence.conversation.publicId,

          type: persistence.conversation.type,
          status: persistence.conversation.status,

          journeyPublicId: persistence.conversation.journeyPublicId,
          bookingPublicId: persistence.conversation.bookingPublicId,

          lastMessageAt: persistence.conversation.lastMessageAt,
          closedAt: persistence.conversation.closedAt,

          createdAt: persistence.conversation.createdAt,
          updatedAt: persistence.conversation.updatedAt,
        },

        update: {
          publicId: persistence.conversation.publicId,

          type: persistence.conversation.type,
          status: persistence.conversation.status,

          journeyPublicId: persistence.conversation.journeyPublicId,
          bookingPublicId: persistence.conversation.bookingPublicId,

          lastMessageAt: persistence.conversation.lastMessageAt,
          closedAt: persistence.conversation.closedAt,

          updatedAt: persistence.conversation.updatedAt,
        },
      });

      await this.persistParticipants(
        transaction,
        persistence.participants,
        persistence.conversation.id,
      );

      await this.persistMessages(
        transaction,
        persistence.messages,
        persistence.conversation.id,
      );
    });
  }

  /**
   * Deletes a Messaging Conversation aggregate.
   *
   * MessagingConversationParticipant and MessagingMessage records are owned
   * by the conversation aggregate.
   *
   * Database relation cascades are expected to remove the owned children.
   */
  public async delete(
    aggregate: MessagingConversationAggregate,
  ): Promise<void> {
    this.ensureAggregate(
      aggregate,
      'Messaging Conversation aggregate is required.',
    );

    await this.prisma.messagingConversation.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries — Identity
  // ===========================================================================

  /**
   * Finds a Messaging Conversation aggregate by public identifier.
   */
  public async findByPublicId(
    publicId: MessagingConversationPublicId,
  ): Promise<MessagingConversationAggregate | null> {
    this.ensurePublicId(
      publicId,
      'Messaging Conversation public identifier is required.',
    );

    const record = await this.findAggregateRecordByPublicId(publicId.value);

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds a Messaging Conversation aggregate by internal identifier.
   */
  public async findById(
    id: UniqueEntityId,
  ): Promise<MessagingConversationAggregate | null> {
    this.ensureId(
      id,
      'Messaging Conversation internal identifier is required.',
    );

    const record = await this.findAggregateRecordById(id.toString());

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Aggregate Queries — Cross-Domain References
  // ===========================================================================

  /**
   * Finds all conversations associated with a Journey.
   */
  public async findByJourneyPublicId(
    journeyPublicId: MessagingJourneyPublicId,
  ): Promise<MessagingConversationAggregate[]> {
    this.ensureValueObject(
      journeyPublicId,
      'Messaging Journey public identifier is required.',
    );

    const records = await this.findAggregateRecordsByJourneyPublicId(
      journeyPublicId.value,
    );

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all conversations associated with a Booking.
   */
  public async findByBookingPublicId(
    bookingPublicId: MessagingBookingPublicId,
  ): Promise<MessagingConversationAggregate[]> {
    this.ensureValueObject(
      bookingPublicId,
      'Messaging Booking public identifier is required.',
    );

    const records = await this.findAggregateRecordsByBookingPublicId(
      bookingPublicId.value,
    );

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Conversation State
  // ===========================================================================

  /**
   * Finds all conversations with the supplied type.
   */
  public async findByType(
    type: MessagingConversationType,
  ): Promise<MessagingConversationAggregate[]> {
    this.ensureValueObject(type, 'Messaging Conversation type is required.');

    const records = await this.prisma.messagingConversation.findMany({
      where: {
        type: type.value,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        participants: true,
        messages: true,
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all conversations with the supplied status.
   */
  public async findByStatus(
    status: MessagingConversationStatus,
  ): Promise<MessagingConversationAggregate[]> {
    this.ensureValueObject(
      status,
      'Messaging Conversation status is required.',
    );

    return this.findByStatusValue(status.value);
  }

  /**
   * Finds all active conversations.
   */
  public async findActive(): Promise<MessagingConversationAggregate[]> {
    return this.findByStatusValue('ACTIVE');
  }

  /**
   * Finds all closed conversations.
   */
  public async findClosed(): Promise<MessagingConversationAggregate[]> {
    return this.findByStatusValue('CLOSED');
  }

  /**
   * Finds conversations associated with a Journey and status.
   */
  public async findByJourneyPublicIdAndStatus(
    journeyPublicId: MessagingJourneyPublicId,
    status: MessagingConversationStatus,
  ): Promise<MessagingConversationAggregate[]> {
    this.ensureValueObject(
      journeyPublicId,
      'Messaging Journey public identifier is required.',
    );

    this.ensureValueObject(
      status,
      'Messaging Conversation status is required.',
    );

    const records = await this.prisma.messagingConversation.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,
        status: status.value,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        participants: true,
        messages: true,
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds conversations associated with a Booking and status.
   */
  public async findByBookingPublicIdAndStatus(
    bookingPublicId: MessagingBookingPublicId,
    status: MessagingConversationStatus,
  ): Promise<MessagingConversationAggregate[]> {
    this.ensureValueObject(
      bookingPublicId,
      'Messaging Booking public identifier is required.',
    );

    this.ensureValueObject(
      status,
      'Messaging Conversation status is required.',
    );

    const records = await this.prisma.messagingConversation.findMany({
      where: {
        bookingPublicId: bookingPublicId.value,
        status: status.value,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        participants: true,
        messages: true,
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Entity Queries — Conversation
  // ===========================================================================

  /**
   * Finds a Messaging Conversation entity by public identifier.
   *
   * Participants and messages are intentionally not loaded.
   */
  public async findEntityByPublicId(
    publicId: MessagingConversationPublicId,
  ): Promise<MessagingConversationEntity | null> {
    this.ensurePublicId(
      publicId,
      'Messaging Conversation public identifier is required.',
    );

    const record = await this.prisma.messagingConversation.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null
      ? null
      : MessagingConversationPrismaMapper.conversationToDomain(record);
  }

  /**
   * Finds a Messaging Conversation entity by internal identifier.
   */
  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<MessagingConversationEntity | null> {
    this.ensureId(
      id,
      'Messaging Conversation internal identifier is required.',
    );

    const record = await this.prisma.messagingConversation.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null
      ? null
      : MessagingConversationPrismaMapper.conversationToDomain(record);
  }

  /**
   * Finds conversation entities associated with a Journey.
   */
  public async findEntitiesByJourneyPublicId(
    journeyPublicId: MessagingJourneyPublicId,
  ): Promise<MessagingConversationEntity[]> {
    this.ensureValueObject(
      journeyPublicId,
      'Messaging Journey public identifier is required.',
    );

    const records = await this.prisma.messagingConversation.findMany({
      where: {
        journeyPublicId: journeyPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      MessagingConversationPrismaMapper.conversationToDomain(record),
    );
  }

  /**
   * Finds conversation entities associated with a Booking.
   */
  public async findEntitiesByBookingPublicId(
    bookingPublicId: MessagingBookingPublicId,
  ): Promise<MessagingConversationEntity[]> {
    this.ensureValueObject(
      bookingPublicId,
      'Messaging Booking public identifier is required.',
    );

    const records = await this.prisma.messagingConversation.findMany({
      where: {
        bookingPublicId: bookingPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      MessagingConversationPrismaMapper.conversationToDomain(record),
    );
  }

  // ===========================================================================
  // Participant Queries
  // ===========================================================================

  /**
   * Finds a participant by participant public identifier.
   */
  public async findParticipantByPublicId(
    publicId: MessagingConversationParticipantPublicId,
  ): Promise<MessagingConversationParticipantEntity | null> {
    this.ensureValueObject(
      publicId,
      'Messaging Conversation Participant public identifier is required.',
    );

    const record =
      await this.prisma.messagingConversationParticipant.findUnique({
        where: {
          publicId: publicId.value,
        },
      });

    return record === null
      ? null
      : MessagingConversationPrismaMapper.participantToDomain(record);
  }

  /**
   * Finds a participant by internal identifier.
   */
  public async findParticipantById(
    id: UniqueEntityId,
  ): Promise<MessagingConversationParticipantEntity | null> {
    this.ensureId(
      id,
      'Messaging Conversation Participant internal identifier is required.',
    );

    const record =
      await this.prisma.messagingConversationParticipant.findUnique({
        where: {
          id: id.toString(),
        },
      });

    return record === null
      ? null
      : MessagingConversationPrismaMapper.participantToDomain(record);
  }

  /**
   * Finds a participant by conversation and member public identifier.
   */
  public async findParticipantByMemberPublicId(
    conversationPublicId: MessagingConversationPublicId,
    memberPublicId: MessagingMemberPublicId,
  ): Promise<MessagingConversationParticipantEntity | null> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

    this.ensureValueObject(
      memberPublicId,
      'Messaging Member public identifier is required.',
    );

    const record = await this.prisma.messagingConversationParticipant.findFirst(
      {
        where: {
          conversation: {
            publicId: conversationPublicId.value,
          },

          memberPublicId: memberPublicId.value,
        },

        orderBy: {
          createdAt: 'asc',
        },
      },
    );

    return record === null
      ? null
      : MessagingConversationPrismaMapper.participantToDomain(record);
  }

  /**
   * Finds all participants belonging to a conversation.
   */
  public async findParticipants(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingConversationParticipantEntity[]> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

    const records = await this.prisma.messagingConversationParticipant.findMany(
      {
        where: {
          conversation: {
            publicId: conversationPublicId.value,
          },
        },

        orderBy: {
          joinedAt: 'asc',
        },
      },
    );

    return records.map((record) =>
      MessagingConversationPrismaMapper.participantToDomain(record),
    );
  }

  /**
   * Finds participants by status within a conversation.
   */
  public async findParticipantsByStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingParticipantStatus,
  ): Promise<MessagingConversationParticipantEntity[]> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

    this.ensureValueObject(status, 'Messaging Participant status is required.');

    const records = await this.prisma.messagingConversationParticipant.findMany(
      {
        where: {
          conversation: {
            publicId: conversationPublicId.value,
          },

          status: status.value,
        },

        orderBy: {
          joinedAt: 'asc',
        },
      },
    );

    return records.map((record) =>
      MessagingConversationPrismaMapper.participantToDomain(record),
    );
  }

  /**
   * Finds participants by role within a conversation.
   */
  public async findParticipantsByRole(
    conversationPublicId: MessagingConversationPublicId,
    role: MessagingParticipantRole,
  ): Promise<MessagingConversationParticipantEntity[]> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

    this.ensureValueObject(role, 'Messaging Participant role is required.');

    const records = await this.prisma.messagingConversationParticipant.findMany(
      {
        where: {
          conversation: {
            publicId: conversationPublicId.value,
          },

          role: role.value,
        },

        orderBy: {
          joinedAt: 'asc',
        },
      },
    );

    return records.map((record) =>
      MessagingConversationPrismaMapper.participantToDomain(record),
    );
  }

  /**
   * Finds all participations belonging to a member.
   */
  public async findParticipationsByMemberPublicId(
    memberPublicId: MessagingMemberPublicId,
  ): Promise<MessagingConversationParticipantEntity[]> {
    this.ensureValueObject(
      memberPublicId,
      'Messaging Member public identifier is required.',
    );

    const records = await this.prisma.messagingConversationParticipant.findMany(
      {
        where: {
          memberPublicId: memberPublicId.value,
        },

        orderBy: {
          joinedAt: 'desc',
        },
      },
    );

    return records.map((record) =>
      MessagingConversationPrismaMapper.participantToDomain(record),
    );
  }

  /**
   * Finds active participants in a conversation.
   */
  public async findActiveParticipants(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingConversationParticipantEntity[]> {
    return this.findParticipantsByStatus(
      conversationPublicId,
      this.createParticipantStatus('ACTIVE'),
    );
  }

  /**
   * Finds participants who have left a conversation.
   */
  public async findLeftParticipants(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingConversationParticipantEntity[]> {
    return this.findParticipantsByStatus(
      conversationPublicId,
      this.createParticipantStatus('LEFT'),
    );
  }

  /**
   * Finds participants who have been removed from a conversation.
   */
  public async findRemovedParticipants(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingConversationParticipantEntity[]> {
    return this.findParticipantsByStatus(
      conversationPublicId,
      this.createParticipantStatus('REMOVED'),
    );
  }

  // ===========================================================================
  // Message Queries
  // ===========================================================================

  /**
   * Finds a message by public identifier.
   *
   * The owning conversation is loaded only to reconstruct the domain
   * message's conversationPublicId.
   */
  public async findMessageByPublicId(
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

    return record === null ? null : this.mapMessageRecord(record);
  }

  /**
   * Finds a message by internal identifier.
   */
  public async findMessageById(
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

    return record === null ? null : this.mapMessageRecord(record);
  }

  /**
   * Finds a message by public identifier within a conversation.
   */
  public async findMessageByPublicIdInConversation(
    conversationPublicId: MessagingConversationPublicId,
    messagePublicId: MessagingMessagePublicId,
  ): Promise<MessagingMessageEntity | null> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

    this.ensureValueObject(
      messagePublicId,
      'Messaging Message public identifier is required.',
    );

    const record = await this.prisma.messagingMessage.findFirst({
      where: {
        publicId: messagePublicId.value,

        conversation: {
          publicId: conversationPublicId.value,
        },
      },

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return record === null ? null : this.mapMessageRecord(record);
  }

  /**
   * Finds all messages belonging to a conversation.
   */
  public async findMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageEntity[]> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },
      },

      orderBy: {
        sentAt: 'asc',
      },

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.mapMessageRecord(record));
  }

  /**
   * Finds messages by status within a conversation.
   */
  public async findMessagesByStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingMessageStatus,
  ): Promise<MessagingMessageEntity[]> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

    this.ensureValueObject(status, 'Messaging Message status is required.');

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },

        status: status.value,
      },

      orderBy: {
        sentAt: 'asc',
      },

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.mapMessageRecord(record));
  }

  /**
   * Finds messages by type within a conversation.
   */
  public async findMessagesByType(
    conversationPublicId: MessagingConversationPublicId,
    type: MessagingMessageType,
  ): Promise<MessagingMessageEntity[]> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

    this.ensureValueObject(type, 'Messaging Message type is required.');

    const records = await this.prisma.messagingMessage.findMany({
      where: {
        conversation: {
          publicId: conversationPublicId.value,
        },

        type: type.value,
      },

      orderBy: {
        sentAt: 'asc',
      },

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.mapMessageRecord(record));
  }

  /**
   * Finds all messages sent by a member.
   */
  public async findMessagesBySenderPublicId(
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

      orderBy: {
        sentAt: 'desc',
      },

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.mapMessageRecord(record));
  }

  /**
   * Finds messages sent by a member within a conversation.
   */
  public async findMessagesBySenderInConversation(
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageEntity[]> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

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

      orderBy: {
        sentAt: 'asc',
      },

      include: {
        conversation: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return records.map((record) => this.mapMessageRecord(record));
  }

  /**
   * Finds sent messages in a conversation.
   */
  public async findSentMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageEntity[]> {
    return this.findMessagesByStatus(
      conversationPublicId,
      this.createMessageStatus('SENT'),
    );
  }

  /**
   * Finds edited messages in a conversation.
   */
  public async findEditedMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageEntity[]> {
    return this.findMessagesByStatus(
      conversationPublicId,
      this.createMessageStatus('EDITED'),
    );
  }

  /**
   * Finds deleted messages in a conversation.
   */
  public async findDeletedMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageEntity[]> {
    return this.findMessagesByStatus(
      conversationPublicId,
      this.createMessageStatus('DELETED'),
    );
  }

  /**
   * Finds moderated messages in a conversation.
   */
  public async findModeratedMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageEntity[]> {
    return this.findMessagesByStatus(
      conversationPublicId,
      this.createMessageStatus('MODERATED'),
    );
  }

  // ===========================================================================
  // Aggregate Retrieval Helpers
  // ===========================================================================

  /**
   * Finds all Messaging Conversation aggregates.
   */
  public async findAll(): Promise<MessagingConversationAggregate[]> {
    const records = await this.prisma.messagingConversation.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        participants: true,
        messages: true,
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all conversation aggregates belonging to a member.
   */
  public async findByMemberPublicId(
    memberPublicId: MessagingMemberPublicId,
  ): Promise<MessagingConversationAggregate[]> {
    this.ensureValueObject(
      memberPublicId,
      'Messaging Member public identifier is required.',
    );

    const records = await this.prisma.messagingConversation.findMany({
      where: {
        participants: {
          some: {
            memberPublicId: memberPublicId.value,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        participants: true,
        messages: true,
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all active conversations containing a member.
   */
  public async findActiveByMemberPublicId(
    memberPublicId: MessagingMemberPublicId,
  ): Promise<MessagingConversationAggregate[]> {
    this.ensureValueObject(
      memberPublicId,
      'Messaging Member public identifier is required.',
    );

    const records = await this.prisma.messagingConversation.findMany({
      where: {
        status: 'ACTIVE',

        participants: {
          some: {
            memberPublicId: memberPublicId.value,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        participants: true,
        messages: true,
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Existence — Conversation
  // ===========================================================================

  /**
   * Checks existence by public identifier.
   */
  public async existsByPublicId(
    publicId: MessagingConversationPublicId,
  ): Promise<boolean> {
    this.ensurePublicId(
      publicId,
      'Messaging Conversation public identifier is required.',
    );

    const record = await this.prisma.messagingConversation.findUnique({
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
   * Checks existence by internal identifier.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    this.ensureId(
      id,
      'Messaging Conversation internal identifier is required.',
    );

    const record = await this.prisma.messagingConversation.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks existence by Journey public identifier.
   */
  public async existsByJourneyPublicId(
    journeyPublicId: MessagingJourneyPublicId,
  ): Promise<boolean> {
    this.ensureValueObject(
      journeyPublicId,
      'Messaging Journey public identifier is required.',
    );

    const record = await this.prisma.messagingConversation.findFirst({
      where: {
        journeyPublicId: journeyPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks existence by Booking public identifier.
   */
  public async existsByBookingPublicId(
    bookingPublicId: MessagingBookingPublicId,
  ): Promise<boolean> {
    this.ensureValueObject(
      bookingPublicId,
      'Messaging Booking public identifier is required.',
    );

    const record = await this.prisma.messagingConversation.findFirst({
      where: {
        bookingPublicId: bookingPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks whether a conversation of the supplied type exists.
   */
  public async existsByType(type: MessagingConversationType): Promise<boolean> {
    this.ensureValueObject(type, 'Messaging Conversation type is required.');

    const record = await this.prisma.messagingConversation.findFirst({
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
   * Checks whether a conversation with the supplied status exists.
   */
  public async existsByStatus(
    status: MessagingConversationStatus,
  ): Promise<boolean> {
    this.ensureValueObject(
      status,
      'Messaging Conversation status is required.',
    );

    return this.existsByStatusValue(status.value);
  }

  /**
   * Checks whether at least one active conversation exists.
   */
  public async existsActive(): Promise<boolean> {
    return this.existsByStatusValue('ACTIVE');
  }

  /**
   * Checks whether at least one closed conversation exists.
   */
  public async existsClosed(): Promise<boolean> {
    return this.existsByStatusValue('CLOSED');
  }

  // ===========================================================================
  // Existence — Participant
  // ===========================================================================

  /**
   * Checks existence by participant public identifier.
   */
  public async existsParticipantByPublicId(
    publicId: MessagingConversationParticipantPublicId,
  ): Promise<boolean> {
    this.ensureValueObject(
      publicId,
      'Messaging Conversation Participant public identifier is required.',
    );

    const record =
      await this.prisma.messagingConversationParticipant.findUnique({
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
   * Checks existence by participant internal identifier.
   */
  public async existsParticipantById(id: UniqueEntityId): Promise<boolean> {
    this.ensureId(
      id,
      'Messaging Conversation Participant internal identifier is required.',
    );

    const record =
      await this.prisma.messagingConversationParticipant.findUnique({
        where: {
          id: id.toString(),
        },

        select: {
          id: true,
        },
      });

    return record !== null;
  }

  /**
   * Checks whether a member participates in a conversation.
   */
  public async existsParticipantByMemberPublicId(
    conversationPublicId: MessagingConversationPublicId,
    memberPublicId: MessagingMemberPublicId,
  ): Promise<boolean> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

    this.ensureValueObject(
      memberPublicId,
      'Messaging Member public identifier is required.',
    );

    const record = await this.prisma.messagingConversationParticipant.findFirst(
      {
        where: {
          conversation: {
            publicId: conversationPublicId.value,
          },

          memberPublicId: memberPublicId.value,
        },

        select: {
          id: true,
        },
      },
    );

    return record !== null;
  }

  /**
   * Checks whether a participant with the supplied status exists.
   */
  public async existsParticipantByStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingParticipantStatus,
  ): Promise<boolean> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

    this.ensureValueObject(status, 'Messaging Participant status is required.');

    const record = await this.prisma.messagingConversationParticipant.findFirst(
      {
        where: {
          conversation: {
            publicId: conversationPublicId.value,
          },

          status: status.value,
        },

        select: {
          id: true,
        },
      },
    );

    return record !== null;
  }

  /**
   * Checks whether a participant with the supplied role exists.
   */
  public async existsParticipantByRole(
    conversationPublicId: MessagingConversationPublicId,
    role: MessagingParticipantRole,
  ): Promise<boolean> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

    this.ensureValueObject(role, 'Messaging Participant role is required.');

    const record = await this.prisma.messagingConversationParticipant.findFirst(
      {
        where: {
          conversation: {
            publicId: conversationPublicId.value,
          },

          role: role.value,
        },

        select: {
          id: true,
        },
      },
    );

    return record !== null;
  }

  /**
   * Checks whether an active participant exists.
   */
  public async existsActiveParticipant(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean> {
    return this.existsParticipantByStatus(
      conversationPublicId,
      this.createParticipantStatus('ACTIVE'),
    );
  }

  // ===========================================================================
  // Existence — Message
  // ===========================================================================

  /**
   * Checks existence by message public identifier.
   */
  public async existsMessageByPublicId(
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
  public async existsMessageById(id: UniqueEntityId): Promise<boolean> {
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

  /**
   * Checks whether a message exists within a conversation.
   */
  public async existsMessageInConversation(
    conversationPublicId: MessagingConversationPublicId,
    messagePublicId: MessagingMessagePublicId,
  ): Promise<boolean> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

    this.ensureValueObject(
      messagePublicId,
      'Messaging Message public identifier is required.',
    );

    const record = await this.prisma.messagingMessage.findFirst({
      where: {
        publicId: messagePublicId.value,

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

  /**
   * Checks whether at least one message exists in a conversation.
   */
  public async existsMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

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

  /**
   * Checks whether a message with the supplied status exists.
   */
  public async existsMessagesByStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingMessageStatus,
  ): Promise<boolean> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

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
   * Checks whether a message with the supplied type exists.
   */
  public async existsMessagesByType(
    conversationPublicId: MessagingConversationPublicId,
    type: MessagingMessageType,
  ): Promise<boolean> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

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

  /**
   * Checks whether at least one message exists from a sender.
   */
  public async existsMessagesBySenderPublicId(
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
   * Checks whether at least one message exists from a sender within a
   * conversation.
   */
  public async existsMessagesBySenderInConversation(
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
  ): Promise<boolean> {
    this.ensurePublicId(
      conversationPublicId,
      'Messaging Conversation public identifier is required.',
    );

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

  /**
   * Checks whether at least one sent message exists.
   */
  public async existsSentMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean> {
    return this.existsMessagesByStatus(
      conversationPublicId,
      this.createMessageStatus('SENT'),
    );
  }

  /**
   * Checks whether at least one edited message exists.
   */
  public async existsEditedMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean> {
    return this.existsMessagesByStatus(
      conversationPublicId,
      this.createMessageStatus('EDITED'),
    );
  }

  /**
   * Checks whether at least one deleted message exists.
   */
  public async existsDeletedMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean> {
    return this.existsMessagesByStatus(
      conversationPublicId,
      this.createMessageStatus('DELETED'),
    );
  }

  /**
   * Checks whether at least one moderated message exists.
   */
  public async existsModeratedMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean> {
    return this.existsMessagesByStatus(
      conversationPublicId,
      this.createMessageStatus('MODERATED'),
    );
  }

  // ===========================================================================
  // Private — Aggregate Queries
  // ===========================================================================

  /**
   * Finds a complete aggregate by conversation public identifier.
   */
  private async findAggregateRecordByPublicId(
    publicId: string,
  ): Promise<Prisma.MessagingConversationGetPayload<{
    include: {
      participants: true;
      messages: true;
    };
  }> | null> {
    return this.prisma.messagingConversation.findUnique({
      where: {
        publicId,
      },

      include: {
        participants: true,
        messages: true,
      },
    });
  }

  /**
   * Finds a complete aggregate by conversation internal identifier.
   */
  private async findAggregateRecordById(
    id: string,
  ): Promise<Prisma.MessagingConversationGetPayload<{
    include: {
      participants: true;
      messages: true;
    };
  }> | null> {
    return this.prisma.messagingConversation.findUnique({
      where: {
        id,
      },

      include: {
        participants: true,
        messages: true,
      },
    });
  }

  /**
   * Finds complete aggregates by Journey public identifier.
   */
  private async findAggregateRecordsByJourneyPublicId(
    journeyPublicId: string,
  ): Promise<
    Prisma.MessagingConversationGetPayload<{
      include: {
        participants: true;
        messages: true;
      };
    }>[]
  > {
    return this.prisma.messagingConversation.findMany({
      where: {
        journeyPublicId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        participants: true,
        messages: true,
      },
    });
  }

  /**
   * Finds complete aggregates by Booking public identifier.
   */
  private async findAggregateRecordsByBookingPublicId(
    bookingPublicId: string,
  ): Promise<
    Prisma.MessagingConversationGetPayload<{
      include: {
        participants: true;
        messages: true;
      };
    }>[]
  > {
    return this.prisma.messagingConversation.findMany({
      where: {
        bookingPublicId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        participants: true,
        messages: true,
      },
    });
  }

  /**
   * Finds complete aggregates by persisted conversation status.
   */
  private async findByStatusValue(
    status: PrismaMessagingConversation['status'],
  ): Promise<MessagingConversationAggregate[]> {
    const records = await this.prisma.messagingConversation.findMany({
      where: {
        status,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        participants: true,
        messages: true,
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Checks existence by persisted conversation status.
   */
  private async existsByStatusValue(
    status: PrismaMessagingConversation['status'],
  ): Promise<boolean> {
    const record = await this.prisma.messagingConversation.findFirst({
      where: {
        status,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Private — Persistence
  // ===========================================================================

  /**
   * Persists all participants belonging to the conversation.
   *
   * Participants that are no longer present in the aggregate are removed.
   */
  private async persistParticipants(
    transaction: Prisma.TransactionClient,
    participants: ReturnType<
      typeof MessagingConversationPrismaMapper.toPersistence
    >['participants'],
    conversationId: string,
  ): Promise<void> {
    const participantIds = participants.map((participant) => participant.id);

    if (participantIds.length === 0) {
      await transaction.messagingConversationParticipant.deleteMany({
        where: {
          conversationId,
        },
      });
    } else {
      await transaction.messagingConversationParticipant.deleteMany({
        where: {
          conversationId,
          id: {
            notIn: participantIds,
          },
        },
      });
    }

    for (const participant of participants) {
      await transaction.messagingConversationParticipant.upsert({
        where: {
          id: participant.id,
        },

        create: {
          id: participant.id,
          publicId: participant.publicId,

          conversationId: participant.conversationId,
          memberPublicId: participant.memberPublicId,

          role: participant.role,
          status: participant.status,

          joinedAt: participant.joinedAt,
          leftAt: participant.leftAt,
          removedAt: participant.removedAt,
          lastReadAt: participant.lastReadAt,

          createdAt: participant.createdAt,
          updatedAt: participant.updatedAt,
        },

        update: {
          publicId: participant.publicId,

          conversationId: participant.conversationId,
          memberPublicId: participant.memberPublicId,

          role: participant.role,
          status: participant.status,

          joinedAt: participant.joinedAt,
          leftAt: participant.leftAt,
          removedAt: participant.removedAt,
          lastReadAt: participant.lastReadAt,

          updatedAt: participant.updatedAt,
        },
      });
    }
  }

  /**
   * Persists all messages belonging to the conversation.
   *
   * MessagingMessage does not persist conversationPublicId because that value
   * is reconstructed from the owning MessagingConversation.
   *
   * Messages that are no longer present in the aggregate are removed.
   */
  private async persistMessages(
    transaction: Prisma.TransactionClient,
    messages: ReturnType<
      typeof MessagingConversationPrismaMapper.toPersistence
    >['messages'],
    conversationId: string,
  ): Promise<void> {
    const messageIds = messages.map((message) => message.id);

    if (messageIds.length === 0) {
      await transaction.messagingMessage.deleteMany({
        where: {
          conversationId,
        },
      });
    } else {
      await transaction.messagingMessage.deleteMany({
        where: {
          conversationId,
          id: {
            notIn: messageIds,
          },
        },
      });
    }

    for (const message of messages) {
      await transaction.messagingMessage.upsert({
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
  }

  // ===========================================================================
  // Private — Mapping
  // ===========================================================================

  /**
   * Converts a complete Prisma aggregate record into a domain aggregate.
   */
  private toAggregate(
    record: Prisma.MessagingConversationGetPayload<{
      include: {
        participants: true;
        messages: true;
      };
    }>,
  ): MessagingConversationAggregate {
    return MessagingConversationPrismaMapper.toDomain(record);
  }

  /**
   * Converts a Prisma conversation record into its domain entity.
   */
  private toEntity(
    record: PrismaMessagingConversation,
  ): MessagingConversationEntity {
    return MessagingConversationPrismaMapper.conversationToDomain(record);
  }

  /**
   * Maps a message record that includes its owning conversation public ID.
   *
   * The relation is used only to reconstruct the opaque domain-level
   * conversation public identity.
   */
  private mapMessageRecord(
    record: Prisma.MessagingMessageGetPayload<{
      include: {
        conversation: {
          select: {
            publicId: true;
          };
        };
      };
    }>,
  ): MessagingMessageEntity {
    const conversationPublicId = this.toConversationPublicId(
      record.conversation.publicId,
    );

    return MessagingConversationPrismaMapper.messageToDomain(
      record,
      conversationPublicId,
    );
  }

  // ===========================================================================
  // Private — Value Object Construction
  // ===========================================================================

  /**
   * Creates a ConversationPublicId for infrastructure mapping.
   *
   * MessagingConversationPublicId exposes a public constructor.
   */
  private toConversationPublicId(value: string): MessagingConversationPublicId {
    return new MessagingConversationPublicId(value);
  }

  /**
   * Creates a participant status value object.
   */
  private createParticipantStatus(
    value: 'ACTIVE' | 'LEFT' | 'REMOVED',
  ): MessagingParticipantStatus {
    return MessagingParticipantStatus.create(value);
  }

  /**
   * Creates a message status value object.
   */
  private createMessageStatus(
    value: 'SENT' | 'EDITED' | 'DELETED' | 'MODERATED',
  ): MessagingMessageStatus {
    return MessagingMessageStatus.create(value);
  }

  // ===========================================================================
  // Private — Validation
  // ===========================================================================

  /**
   * Ensures an aggregate is present.
   */
  private ensureAggregate(
    value: MessagingConversationAggregate,
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
   * Ensures a public identifier is present.
   */
  private ensurePublicId(
    value: MessagingConversationPublicId,
    message: string,
  ): void {
    if (value === undefined || value === null) {
      throw new Error(message);
    }
  }

  /**
   * Ensures a generic value object is present.
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

export default PrismaMessagingConversationRepository;
