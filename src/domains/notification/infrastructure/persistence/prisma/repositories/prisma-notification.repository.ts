// -----------------------------------------------------------------------------
// Notification — Prisma Repository
// -----------------------------------------------------------------------------
//
// Prisma implementation of the NotificationRepository.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// Persistence:
//
// Notification
// └── NotificationDelivery[]
//
// Responsibilities:
//
// - persist Notification aggregates;
// - retrieve Notification aggregates;
// - retrieve Notification entities;
// - query Notifications by public identity;
// - query Notifications by internal identity;
// - query Notifications by recipient;
// - query Notifications by recipient and status;
// - query Notifications by status;
// - query Notifications by source event;
// - query Notifications by reference;
// - determine Notification existence;
// - persist Notification deliveries as aggregate children;
// - preserve aggregate identity;
// - preserve delivery ownership;
// - preserve delivery identity;
// - execute aggregate persistence transactionally.
//
// This repository does NOT:
//
// - implement business rules;
// - create domain entities;
// - create Notification deliveries;
// - manage NotificationPreference;
// - resolve Identity references;
// - access external delivery providers;
// - send email;
// - send SMS;
// - send push notifications;
// - interpret provider behavior.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationDeliveryEntity is NOT independently persisted through a
// separate repository. Its lifecycle is owned by NotificationAggregate.
//
// -----------------------------------------------------------------------------
//
// Persistence strategy:
//
// save()
// ├── upsert Notification
// ├── remove stale NotificationDelivery records
// └── upsert current NotificationDelivery records
//
// All aggregate persistence occurs inside one Prisma transaction.
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
  Notification as PrismaNotification,
  Prisma,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { NotificationRepository } from '../../../../domain/repositories/notification.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { NotificationAggregate } from '../../../../domain/aggregates/notification.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import type { NotificationEntity } from '../../../../domain/entities/notification.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { NotificationPrismaMapper } from '../mappers/notification-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { NotificationPublicId } from '../../../../domain/value-objects/notification-public-id.vo';

import type { NotificationMemberPublicId } from '../../../../domain/value-objects/notification-member-public-id.vo';

import type { NotificationStatus } from '../../../../domain/value-objects/notification-status.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Prisma Aggregate Record
// =============================================================================

type NotificationAggregateRecord = Prisma.NotificationGetPayload<{
  include: {
    deliveries: true;
  };
}>;

// =============================================================================
// Persistence Delivery
// =============================================================================
//
// Infrastructure-only persistence representation.
//
// This type is intentionally derived from the mapper rather than duplicated
// manually in the repository.
//

type NotificationPersistenceDelivery = ReturnType<
  typeof NotificationPrismaMapper.deliveryToPersistence
>;

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Save
  // ===========================================================================

  /**
   * Persists the complete Notification aggregate.
   *
   * The aggregate is the authoritative source for its delivery collection.
   *
   * Root persistence and child persistence occur inside the same transaction.
   */
  public async save(aggregate: NotificationAggregate): Promise<void> {
    this.ensureAggregate(
      aggregate,
      'Notification aggregate is required for persistence.',
    );

    const persistence = NotificationPrismaMapper.toPersistence(aggregate);

    await this.prisma.$transaction(async (transaction) => {
      // -----------------------------------------------------------------------
      // Persist aggregate root.
      // -----------------------------------------------------------------------

      await transaction.notification.upsert({
        where: {
          id: persistence.notification.id,
        },

        create: {
          id: persistence.notification.id,
          publicId: persistence.notification.publicId,

          recipientPublicId: persistence.notification.recipientPublicId,

          type: persistence.notification.type,
          priority: persistence.notification.priority,
          status: persistence.notification.status,

          title: persistence.notification.title,
          body: persistence.notification.body,

          referenceType: persistence.notification.referenceType,
          referencePublicId: persistence.notification.referencePublicId,

          eventType: persistence.notification.eventType,
          eventPublicId: persistence.notification.eventPublicId,

          sentAt: persistence.notification.sentAt,
          readAt: persistence.notification.readAt,
          failedAt: persistence.notification.failedAt,
          cancelledAt: persistence.notification.cancelledAt,

          failureReason: persistence.notification.failureReason,

          createdAt: persistence.notification.createdAt,
          updatedAt: persistence.notification.updatedAt,
        },

        update: {
          publicId: persistence.notification.publicId,

          recipientPublicId: persistence.notification.recipientPublicId,

          type: persistence.notification.type,
          priority: persistence.notification.priority,
          status: persistence.notification.status,

          title: persistence.notification.title,
          body: persistence.notification.body,

          referenceType: persistence.notification.referenceType,
          referencePublicId: persistence.notification.referencePublicId,

          eventType: persistence.notification.eventType,
          eventPublicId: persistence.notification.eventPublicId,

          sentAt: persistence.notification.sentAt,
          readAt: persistence.notification.readAt,
          failedAt: persistence.notification.failedAt,
          cancelledAt: persistence.notification.cancelledAt,

          failureReason: persistence.notification.failureReason,

          createdAt: persistence.notification.createdAt,
          updatedAt: persistence.notification.updatedAt,
        },
      });

      // -----------------------------------------------------------------------
      // Persist aggregate children.
      // -----------------------------------------------------------------------

      await this.persistDeliveries(
        transaction,
        persistence.deliveries,
        persistence.notification.id,
      );
    });
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Deletes the Notification aggregate.
   *
   * NotificationDelivery children are removed through the Prisma cascade
   * relation defined on NotificationDelivery.notification.
   */
  public async delete(aggregate: NotificationAggregate): Promise<void> {
    this.ensureAggregate(
      aggregate,
      'Notification aggregate is required for deletion.',
    );

    await this.prisma.notification.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds a complete Notification aggregate by public identity.
   */
  public async findByPublicId(
    publicId: NotificationPublicId,
  ): Promise<NotificationAggregate | null> {
    this.ensurePublicId(publicId, 'Notification public identity is required.');

    const record = await this.findAggregateRecordByPublicId(publicId.value);

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds a complete Notification aggregate by internal identity.
   */
  public async findById(
    id: UniqueEntityId,
  ): Promise<NotificationAggregate | null> {
    this.ensureId(id, 'Notification internal identity is required.');

    const record = await this.findAggregateRecordById(id.toString());

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds complete Notification aggregates belonging to a recipient.
   */
  public async findByRecipientPublicId(
    recipientPublicId: NotificationMemberPublicId,
  ): Promise<NotificationAggregate[]> {
    this.ensureValueObject(
      recipientPublicId,
      'Notification recipient public identity is required.',
    );

    const records = await this.findAggregateRecordsByRecipientPublicId(
      recipientPublicId.value,
    );

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds complete Notification aggregates belonging to a recipient and
   * having the supplied status.
   */
  public async findByRecipientPublicIdAndStatus(
    recipientPublicId: NotificationMemberPublicId,
    status: NotificationStatus,
  ): Promise<NotificationAggregate[]> {
    this.ensureValueObject(
      recipientPublicId,
      'Notification recipient public identity is required.',
    );

    this.ensureValueObject(status, 'Notification status is required.');

    const records = await this.findAggregateRecordsByRecipientPublicIdAndStatus(
      recipientPublicId.value,
      status.value,
    );

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds complete Notification aggregates by status.
   */
  public async findByStatus(
    status: NotificationStatus,
  ): Promise<NotificationAggregate[]> {
    this.ensureValueObject(status, 'Notification status is required.');

    const records = await this.findAggregateRecordsByStatus(status.value);

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all complete Notification aggregates.
   */
  public async findAll(): Promise<NotificationAggregate[]> {
    const records = await this.findAllAggregateRecords();

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds only the Notification root entity by public identity.
   *
   * Deliveries are intentionally not loaded.
   */
  public async findEntityByPublicId(
    publicId: NotificationPublicId,
  ): Promise<NotificationEntity | null> {
    this.ensurePublicId(publicId, 'Notification public identity is required.');

    const record = await this.prisma.notification.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null
      ? null
      : NotificationPrismaMapper.toNotificationDomain(record);
  }

  /**
   * Finds only the Notification root entity by internal identity.
   *
   * Deliveries are intentionally not loaded.
   */
  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<NotificationEntity | null> {
    this.ensureId(id, 'Notification internal identity is required.');

    const record = await this.prisma.notification.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null
      ? null
      : NotificationPrismaMapper.toNotificationDomain(record);
  }

  /**
   * Finds Notification root entities belonging to a recipient.
   *
   * Deliveries are intentionally not loaded.
   */
  public async findEntitiesByRecipientPublicId(
    recipientPublicId: NotificationMemberPublicId,
  ): Promise<NotificationEntity[]> {
    this.ensureValueObject(
      recipientPublicId,
      'Notification recipient public identity is required.',
    );

    const records = await this.prisma.notification.findMany({
      where: {
        recipientPublicId: recipientPublicId.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      NotificationPrismaMapper.toNotificationDomain(record),
    );
  }

  /**
   * Finds Notification root entities belonging to a recipient and status.
   *
   * Deliveries are intentionally not loaded.
   */
  public async findEntitiesByRecipientPublicIdAndStatus(
    recipientPublicId: NotificationMemberPublicId,
    status: NotificationStatus,
  ): Promise<NotificationEntity[]> {
    this.ensureValueObject(
      recipientPublicId,
      'Notification recipient public identity is required.',
    );

    this.ensureValueObject(status, 'Notification status is required.');

    const records = await this.prisma.notification.findMany({
      where: {
        recipientPublicId: recipientPublicId.value,
        status: status.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      NotificationPrismaMapper.toNotificationDomain(record),
    );
  }

  /**
   * Finds Notification root entities by status.
   *
   * Deliveries are intentionally not loaded.
   */
  public async findEntitiesByStatus(
    status: NotificationStatus,
  ): Promise<NotificationEntity[]> {
    this.ensureValueObject(status, 'Notification status is required.');

    const records = await this.prisma.notification.findMany({
      where: {
        status: status.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      NotificationPrismaMapper.toNotificationDomain(record),
    );
  }

  /**
   * Finds all Notification root entities.
   *
   * Deliveries are intentionally not loaded.
   */
  public async findAllEntities(): Promise<NotificationEntity[]> {
    const records = await this.prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      NotificationPrismaMapper.toNotificationDomain(record),
    );
  }

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Determines whether a Notification exists by public identity.
   */
  public async existsByPublicId(
    publicId: NotificationPublicId,
  ): Promise<boolean> {
    this.ensurePublicId(publicId, 'Notification public identity is required.');

    const record = await this.prisma.notification.findUnique({
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
   * Determines whether a Notification exists by internal identity.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    this.ensureId(id, 'Notification internal identity is required.');

    const record = await this.prisma.notification.findUnique({
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
   * Determines whether at least one Notification exists for a recipient.
   */
  public async existsByRecipientPublicId(
    recipientPublicId: NotificationMemberPublicId,
  ): Promise<boolean> {
    this.ensureValueObject(
      recipientPublicId,
      'Notification recipient public identity is required.',
    );

    const record = await this.prisma.notification.findFirst({
      where: {
        recipientPublicId: recipientPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one Notification exists for a recipient and
   * status.
   */
  public async existsByRecipientPublicIdAndStatus(
    recipientPublicId: NotificationMemberPublicId,
    status: NotificationStatus,
  ): Promise<boolean> {
    this.ensureValueObject(
      recipientPublicId,
      'Notification recipient public identity is required.',
    );

    this.ensureValueObject(status, 'Notification status is required.');

    const record = await this.prisma.notification.findFirst({
      where: {
        recipientPublicId: recipientPublicId.value,
        status: status.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Event Queries
  // ===========================================================================

  /**
   * Finds complete Notification aggregates generated from a source event.
   *
   * Event identity is opaque metadata. The repository does not resolve or
   * interpret the originating domain object.
   */
  public async findByEventTypeAndEventPublicId(
    eventType: string,
    eventPublicId: string,
  ): Promise<NotificationAggregate[]> {
    this.ensureString(eventType, 'Notification event type');

    this.ensureString(eventPublicId, 'Notification event public identity');

    const records = await this.findAggregateRecordsByEvent(
      eventType,
      eventPublicId,
    );

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Reference Queries
  // ===========================================================================

  /**
   * Finds complete Notification aggregates associated with a domain
   * reference.
   *
   * Reference identity is opaque metadata. The repository does not resolve or
   * interpret the referenced domain object.
   */
  public async findByReferenceTypeAndReferencePublicId(
    referenceType: string,
    referencePublicId: string,
  ): Promise<NotificationAggregate[]> {
    this.ensureString(referenceType, 'Notification reference type');

    this.ensureString(
      referencePublicId,
      'Notification reference public identity',
    );

    const records = await this.findAggregateRecordsByReference(
      referenceType,
      referencePublicId,
    );

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Record Retrieval
  // ===========================================================================

  /**
   * Finds a complete Notification persistence record by public identity.
   */
  private async findAggregateRecordByPublicId(
    publicId: string,
  ): Promise<NotificationAggregateRecord | null> {
    return this.prisma.notification.findUnique({
      where: {
        publicId,
      },

      include: {
        deliveries: true,
      },
    });
  }

  /**
   * Finds a complete Notification persistence record by internal identity.
   */
  private async findAggregateRecordById(
    id: string,
  ): Promise<NotificationAggregateRecord | null> {
    return this.prisma.notification.findUnique({
      where: {
        id,
      },

      include: {
        deliveries: true,
      },
    });
  }

  /**
   * Finds complete Notification persistence records by recipient.
   */
  private async findAggregateRecordsByRecipientPublicId(
    recipientPublicId: string,
  ): Promise<NotificationAggregateRecord[]> {
    return this.prisma.notification.findMany({
      where: {
        recipientPublicId,
      },

      include: {
        deliveries: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Finds complete Notification persistence records by recipient and status.
   */
  private async findAggregateRecordsByRecipientPublicIdAndStatus(
    recipientPublicId: string,
    status: PrismaNotification['status'],
  ): Promise<NotificationAggregateRecord[]> {
    return this.prisma.notification.findMany({
      where: {
        recipientPublicId,
        status,
      },

      include: {
        deliveries: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Finds complete Notification persistence records by status.
   */
  private async findAggregateRecordsByStatus(
    status: PrismaNotification['status'],
  ): Promise<NotificationAggregateRecord[]> {
    return this.prisma.notification.findMany({
      where: {
        status,
      },

      include: {
        deliveries: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Finds all complete Notification persistence records.
   */
  private async findAllAggregateRecords(): Promise<
    NotificationAggregateRecord[]
  > {
    return this.prisma.notification.findMany({
      include: {
        deliveries: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Finds complete Notification persistence records by source event.
   */
  private async findAggregateRecordsByEvent(
    eventType: string,
    eventPublicId: string,
  ): Promise<NotificationAggregateRecord[]> {
    return this.prisma.notification.findMany({
      where: {
        eventType,
        eventPublicId,
      },

      include: {
        deliveries: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Finds complete Notification persistence records by domain reference.
   */
  private async findAggregateRecordsByReference(
    referenceType: string,
    referencePublicId: string,
  ): Promise<NotificationAggregateRecord[]> {
    return this.prisma.notification.findMany({
      where: {
        referenceType,
        referencePublicId,
      },

      include: {
        deliveries: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ===========================================================================
  // Delivery Persistence
  // ===========================================================================

  /**
   * Persists the NotificationDelivery children owned by the aggregate.
   *
   * The aggregate is authoritative for its delivery collection.
   *
   * Therefore:
   *
   * - deliveries removed from the aggregate are deleted;
   * - existing deliveries are updated;
   * - new deliveries are inserted.
   *
   * All operations execute within the same transaction as the aggregate root.
   */
  private async persistDeliveries(
    transaction: Prisma.TransactionClient,
    deliveries: NotificationPersistenceDelivery[],
    notificationId: string,
  ): Promise<void> {
    const deliveryIds = deliveries.map((delivery) => delivery.id);

    // -------------------------------------------------------------------------
    // Remove stale children.
    // -------------------------------------------------------------------------

    if (deliveryIds.length === 0) {
      await transaction.notificationDelivery.deleteMany({
        where: {
          notificationId,
        },
      });
    } else {
      await transaction.notificationDelivery.deleteMany({
        where: {
          notificationId,

          id: {
            notIn: deliveryIds,
          },
        },
      });
    }

    // -------------------------------------------------------------------------
    // Persist current children.
    // -------------------------------------------------------------------------

    for (const delivery of deliveries) {
      await transaction.notificationDelivery.upsert({
        where: {
          id: delivery.id,
        },

        create: {
          id: delivery.id,
          publicId: delivery.publicId,

          notificationId: delivery.notificationId,

          channel: delivery.channel,
          status: delivery.status,

          providerReference: delivery.providerReference,

          sentAt: delivery.sentAt,
          deliveredAt: delivery.deliveredAt,

          failedAt: delivery.failedAt,
          cancelledAt: delivery.cancelledAt,

          failureReason: delivery.failureReason,

          createdAt: delivery.createdAt,
          updatedAt: delivery.updatedAt,
        },

        update: {
          publicId: delivery.publicId,

          notificationId: delivery.notificationId,

          channel: delivery.channel,
          status: delivery.status,

          providerReference: delivery.providerReference,

          sentAt: delivery.sentAt,
          deliveredAt: delivery.deliveredAt,

          failedAt: delivery.failedAt,
          cancelledAt: delivery.cancelledAt,

          failureReason: delivery.failureReason,

          createdAt: delivery.createdAt,
          updatedAt: delivery.updatedAt,
        },
      });
    }
  }

  // ===========================================================================
  // Mapping
  // ===========================================================================

  /**
   * Maps a complete Prisma persistence record into a Notification aggregate.
   */
  private toAggregate(
    record: NotificationAggregateRecord,
  ): NotificationAggregate {
    return NotificationPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Validates an aggregate argument.
   */
  private ensureAggregate(value: NotificationAggregate, message: string): void {
    if (value === undefined || value === null || typeof value !== 'object') {
      throw new Error(message);
    }
  }

  /**
   * Validates an internal entity identity.
   *
   * UniqueEntityId is imported as a runtime value because this validation
   * intentionally uses instanceof.
   */
  private ensureId(value: UniqueEntityId, message: string): void {
    if (
      value === undefined ||
      value === null ||
      !(value instanceof UniqueEntityId)
    ) {
      throw new Error(message);
    }
  }

  /**
   * Validates a Notification public identity value object.
   */
  private ensurePublicId(value: NotificationPublicId, message: string): void {
    if (value === undefined || value === null || typeof value !== 'object') {
      throw new Error(message);
    }
  }

  /**
   * Validates a domain value object.
   */
  private ensureValueObject<T>(value: T, message: string): void {
    if (value === undefined || value === null || typeof value !== 'object') {
      throw new Error(message);
    }
  }

  /**
   * Validates a required string.
   */
  private ensureString(value: string, fieldName: string): void {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`${fieldName} must be a non-empty string.`);
    }
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaNotificationRepository;
