// -----------------------------------------------------------------------------
// Notification — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Prisma mapper for the Notification aggregate.
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
// - map Notification Prisma records to Notification domain entities;
// - map NotificationDelivery Prisma records to child entities;
// - rehydrate Notification aggregates;
// - map Notification entities to Prisma persistence primitives;
// - map NotificationDelivery entities to Prisma persistence primitives;
// - preserve aggregate identity;
// - preserve child ownership through notificationId;
// - preserve nullable persistence fields;
// - preserve domain value-object boundaries.
//
// This mapper does NOT:
//
// - contain business rules;
// - create domain entities through business factories;
// - create Notification deliveries;
// - communicate with repositories;
// - access external providers;
// - resolve cross-domain references;
// - map NotificationPreference.
//
// NotificationPreference belongs to its own aggregate and persistence mapper.
//
// -----------------------------------------------------------------------------
//
// Prisma model:
//
// Notification
// ├── id
// ├── publicId
// ├── recipientPublicId
// ├── type
// ├── priority
// ├── status
// ├── title
// ├── body
// ├── referenceType
// ├── referencePublicId
// ├── eventType
// ├── eventPublicId
// ├── sentAt
// ├── readAt
// ├── failedAt
// ├── cancelledAt
// ├── failureReason
// ├── createdAt
// └── updatedAt
//
// NotificationDelivery
// ├── id
// ├── publicId
// ├── notificationId
// ├── channel
// ├── status
// ├── providerReference
// ├── sentAt
// ├── deliveredAt
// ├── failedAt
// ├── cancelledAt
// ├── failureReason
// ├── createdAt
// └── updatedAt
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  Notification as PrismaNotification,
  NotificationDelivery as PrismaNotificationDelivery,
  Prisma,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { NotificationAggregate } from '../../../../domain/aggregates/notification.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { NotificationEntity } from '../../../../domain/entities/notification.entity';

import { NotificationDeliveryEntity } from '../../../../domain/entities/notification-delivery.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { NotificationMemberPublicId } from '../../../../domain/value-objects/notification-member-public-id.vo';

import { NotificationType } from '../../../../domain/value-objects/notification-type.vo';

import { NotificationPriority } from '../../../../domain/value-objects/notification-priority.vo';

import { NotificationStatus } from '../../../../domain/value-objects/notification-status.vo';

import { NotificationTitle } from '../../../../domain/value-objects/notification-title.vo';

import { NotificationBody } from '../../../../domain/value-objects/notification-body.vo';

import { NotificationPublicId } from '../../../../domain/value-objects/notification-public-id.vo';

import { NotificationReferenceType } from '../../../../domain/value-objects/notification-reference-type.vo';

import { NotificationReferencePublicId } from '../../../../domain/value-objects/notification-reference-public-id.vo';

import { NotificationEventType } from '../../../../domain/value-objects/notification-event-type.vo';

import { NotificationEventPublicId } from '../../../../domain/value-objects/notification-event-public-id.vo';

import { NotificationChannel } from '../../../../domain/value-objects/notification-channel.vo';

import { NotificationDeliveryStatus } from '../../../../domain/value-objects/notification-delivery-status.vo';

import { NotificationDeliveryPublicId } from '../../../../domain/value-objects/notification-delivery-public-id.vo';

import { NotificationProviderReference } from '../../../../domain/value-objects/notification-provider-reference.vo';

// =============================================================================
// Prisma Aggregate Record
// =============================================================================

/**
 * Complete Prisma persistence shape required to rehydrate
 * NotificationAggregate.
 *
 * The aggregate is loaded with its child NotificationDelivery records.
 */
export type PrismaNotificationAggregateRecord = Prisma.NotificationGetPayload<{
  include: {
    deliveries: true;
  };
}>;

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of a Notification aggregate.
 *
 * This intentionally mirrors the aggregate boundary:
 *
 * NotificationEntity
 * +
 * NotificationDeliveryEntity[]
 */
export interface NotificationPersistence {
  notification: {
    id: string;
    publicId: string;

    recipientPublicId: string;

    type: PrismaNotification['type'];
    priority: PrismaNotification['priority'];
    status: PrismaNotification['status'];

    title: string;
    body: string;

    referenceType: string | null;
    referencePublicId: string | null;

    eventType: string | null;
    eventPublicId: string | null;

    sentAt: Date | null;
    readAt: Date | null;

    failedAt: Date | null;
    cancelledAt: Date | null;

    failureReason: string | null;

    createdAt: Date;
    updatedAt: Date;
  };

  deliveries: Array<{
    id: string;
    publicId: string;

    notificationId: string;

    channel: PrismaNotificationDelivery['channel'];
    status: PrismaNotificationDelivery['status'];

    providerReference: string | null;

    sentAt: Date | null;
    deliveredAt: Date | null;

    failedAt: Date | null;
    cancelledAt: Date | null;

    failureReason: string | null;

    createdAt: Date;
    updatedAt: Date;
  }>;
}

// =============================================================================
// Mapper
// =============================================================================

export class NotificationPrismaMapper {
  // ===========================================================================
  // Aggregate → Domain
  // ===========================================================================

  /**
   * Rehydrates a complete Notification aggregate from Prisma.
   *
   * Prisma relation:
   *
   * Notification
   * └── deliveries[]
   */
  public static toDomain(
    record: PrismaNotificationAggregateRecord,
  ): NotificationAggregate {
    if (record === undefined || record === null) {
      throw new Error('Notification Prisma aggregate record is required.');
    }

    const notification = this.notificationToDomain(record);

    const deliveries = record.deliveries.map((delivery) =>
      this.deliveryToDomain(delivery),
    );

    return NotificationAggregate.rehydrate(notification, deliveries);
  }

  // ===========================================================================
  // Notification → Domain
  // ===========================================================================

  /**
   * Maps a Prisma Notification record to NotificationEntity.
   *
   * This method only performs persistence-to-domain translation.
   *
   * It does not use NotificationEntity.create() because the persisted
   * lifecycle state must be preserved exactly.
   */
  public static notificationToDomain(
    record: PrismaNotification,
  ): NotificationEntity {
    if (record === undefined || record === null) {
      throw new Error('Notification Prisma record is required.');
    }

    return NotificationEntity.rehydrate(
      {
        recipientPublicId: NotificationMemberPublicId.create(
          record.recipientPublicId,
        ),

        type: NotificationType.create(record.type),

        priority: NotificationPriority.create(record.priority),

        status: NotificationStatus.create(record.status),

        title: NotificationTitle.create(record.title),

        body: NotificationBody.create(record.body),

        referenceType:
          record.referenceType !== null
            ? NotificationReferenceType.create(record.referenceType)
            : undefined,

        referencePublicId:
          record.referencePublicId !== null
            ? NotificationReferencePublicId.create(record.referencePublicId)
            : undefined,

        eventType:
          record.eventType !== null
            ? NotificationEventType.create(record.eventType)
            : undefined,

        eventPublicId:
          record.eventPublicId !== null
            ? NotificationEventPublicId.create(record.eventPublicId)
            : undefined,

        sentAt:
          record.sentAt !== null ? this.cloneDate(record.sentAt) : undefined,

        readAt:
          record.readAt !== null ? this.cloneDate(record.readAt) : undefined,

        failedAt:
          record.failedAt !== null
            ? this.cloneDate(record.failedAt)
            : undefined,

        cancelledAt:
          record.cancelledAt !== null
            ? this.cloneDate(record.cancelledAt)
            : undefined,

        failureReason:
          record.failureReason !== null ? record.failureReason : undefined,

        createdAt: this.cloneDate(record.createdAt),

        updatedAt: this.cloneDate(record.updatedAt),
      },

      new UniqueEntityId(record.id),

      new NotificationPublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Notification Delivery → Domain
  // ===========================================================================

  /**
   * Maps a Prisma NotificationDelivery record to
   * NotificationDeliveryEntity.
   *
   * notificationId remains an internal entity identity because the child
   * entity explicitly models ownership by the Notification aggregate's
   * internal identity.
   */
  public static deliveryToDomain(
    record: PrismaNotificationDelivery,
  ): NotificationDeliveryEntity {
    if (record === undefined || record === null) {
      throw new Error('Notification Delivery Prisma record is required.');
    }

    return NotificationDeliveryEntity.rehydrate(
      {
        notificationId: new UniqueEntityId(record.notificationId),

        channel: NotificationChannel.create(record.channel),

        status: NotificationDeliveryStatus.create(record.status),

        providerReference:
          record.providerReference !== null
            ? NotificationProviderReference.create(record.providerReference)
            : undefined,

        sentAt:
          record.sentAt !== null ? this.cloneDate(record.sentAt) : undefined,

        deliveredAt:
          record.deliveredAt !== null
            ? this.cloneDate(record.deliveredAt)
            : undefined,

        failedAt:
          record.failedAt !== null
            ? this.cloneDate(record.failedAt)
            : undefined,

        cancelledAt:
          record.cancelledAt !== null
            ? this.cloneDate(record.cancelledAt)
            : undefined,

        failureReason:
          record.failureReason !== null ? record.failureReason : undefined,

        createdAt: this.cloneDate(record.createdAt),

        updatedAt: this.cloneDate(record.updatedAt),
      },

      new UniqueEntityId(record.id),

      new NotificationDeliveryPublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Notification → Persistence
  // ===========================================================================

  /**
   * Maps NotificationEntity to Prisma-compatible persistence primitives.
   *
   * All domain value objects are deliberately unwrapped here.
   */
  public static notificationToPersistence(
    entity: NotificationEntity,
  ): NotificationPersistence['notification'] {
    if (entity === undefined || entity === null) {
      throw new Error('Notification entity is required.');
    }

    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      recipientPublicId: entity.recipientPublicId.value,

      type: entity.type.value,

      priority: entity.priority.value,

      status: entity.status.value,

      title: entity.title.value,

      body: entity.body.value,

      referenceType: entity.referenceType?.value ?? null,

      referencePublicId: entity.referencePublicId?.value ?? null,

      eventType: entity.eventType?.value ?? null,

      eventPublicId: entity.eventPublicId?.value ?? null,

      sentAt: entity.sentAt ?? null,

      readAt: entity.readAt ?? null,

      failedAt: entity.failedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      failureReason: entity.failureReason ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Notification Delivery → Persistence
  // ===========================================================================

  /**
   * Maps NotificationDeliveryEntity to Prisma-compatible
   * persistence primitives.
   */
  public static deliveryToPersistence(
    entity: NotificationDeliveryEntity,
  ): NotificationPersistence['deliveries'][number] {
    if (entity === undefined || entity === null) {
      throw new Error('Notification Delivery entity is required.');
    }

    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      notificationId: entity.notificationId.toString(),

      channel: entity.channel.value,

      status: entity.status.value,

      providerReference: entity.providerReference?.value ?? null,

      sentAt: entity.sentAt ?? null,

      deliveredAt: entity.deliveredAt ?? null,

      failedAt: entity.failedAt ?? null,

      cancelledAt: entity.cancelledAt ?? null,

      failureReason: entity.failureReason ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  /**
   * Maps the complete Notification aggregate to persistence data.
   *
   * Aggregate boundary:
   *
   * NotificationAggregate
   * ├── notification
   * └── deliveries[]
   */
  public static toPersistence(
    aggregate: NotificationAggregate,
  ): NotificationPersistence {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Notification aggregate is required.');
    }

    return {
      notification: this.notificationToPersistence(aggregate.notification),

      deliveries: aggregate.deliveries.map((delivery) =>
        this.deliveryToPersistence(delivery),
      ),
    };
  }

  // ===========================================================================
  // Explicit Mapping Aliases
  // ===========================================================================

  /**
   * Maps a Prisma Notification record to NotificationEntity.
   */
  public static toNotificationDomain(
    record: PrismaNotification,
  ): NotificationEntity {
    return this.notificationToDomain(record);
  }

  /**
   * Maps a complete Prisma Notification record to
   * NotificationAggregate.
   */
  public static toNotificationAggregate(
    record: PrismaNotificationAggregateRecord,
  ): NotificationAggregate {
    return this.toDomain(record);
  }

  /**
   * Maps a Prisma NotificationDelivery record to
   * NotificationDeliveryEntity.
   */
  public static toDeliveryDomain(
    record: PrismaNotificationDelivery,
  ): NotificationDeliveryEntity {
    return this.deliveryToDomain(record);
  }

  /**
   * Explicit aggregate mapping alias.
   *
   * Kept for consistency with infrastructure mapper conventions.
   */
  public static toDomainComponent(
    record: PrismaNotificationAggregateRecord,
  ): NotificationAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Date Utilities
  // ===========================================================================

  /**
   * Creates a defensive copy of a persisted Date.
   *
   * Domain entities defensively expose their dates, so the mapper also
   * ensures that persistence-owned Date instances are not shared with
   * the domain model.
   */
  private static cloneDate(value: Date): Date {
    return new Date(value.getTime());
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default NotificationPrismaMapper;
