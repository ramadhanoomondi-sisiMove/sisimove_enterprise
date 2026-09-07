// -----------------------------------------------------------------------------
// Notification — Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the NotificationAggregate / NotificationEntity domain model into
// application-facing NotificationResponse objects.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// Mapping principles:
//
// - Expose Notification-safe state.
// - Serialize value objects into primitives.
// - Expose the Notification public identity.
// - Expose recipient public identity.
// - Expose Notification type, priority, and status.
// - Expose Notification content.
// - Expose optional reference metadata.
// - Expose optional source-event metadata.
// - Expose Notification lifecycle timestamps.
// - Expose Notification failure information.
// - Expose aggregate-owned delivery collection state.
// - Map NotificationDeliveryEntity into safe response objects.
// - Expose delivery public identities.
// - Expose delivery channel and lifecycle status.
// - Expose provider reference when present.
// - Expose delivery lifecycle timestamps.
// - Expose delivery failure information.
// - Return defensive Date instances.
// - Do not expose internal persistence identifiers.
// - Do not expose domain entities.
// - Do not expose value objects directly.
// - Do not access Prisma.
// - Do not access persistence models.
// - Do not resolve Identity references.
// - Do not resolve source events.
// - Do not resolve referenced domains.
// - Do not access delivery providers.
// - Do not evaluate authorization.
// - Do not perform business validation.
// - Do not mutate the aggregate.
// - Do not emit domain events.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map NotificationAggregate -> NotificationResponse.
// - Map NotificationEntity -> NotificationResponse.
// - Map NotificationDeliveryEntity ->
//   NotificationDeliveryResponse.
// - Provide one canonical Notification mapping implementation.
// - Convert Notification value objects into primitive response values.
// - Convert NotificationDelivery value objects into primitive response values.
// - Expose aggregate-owned delivery collection state.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the Notification aggregate.
// - Persist the Notification aggregate.
// - Access Prisma.
// - Access repositories.
// - Resolve Identity members.
// - Resolve Journey.
// - Resolve Booking.
// - Resolve source events.
// - Resolve referenced domains.
// - Access delivery providers.
// - Perform authorization.
// - Perform business validation.
// - Emit domain events.
// - Change Notification lifecycle state.
// - Change NotificationDelivery lifecycle state.
//
// -----------------------------------------------------------------------------
//
// Identity:
//
// publicId is the externally safe Notification identifier.
//
// The internal Notification entity identity (`id`) is intentionally excluded.
//
// recipientPublicId is exposed as an opaque public reference to the recipient
// owned by the Identity domain.
//
// NotificationDelivery publicId is exposed.
//
// NotificationDelivery internal `id` and internal `notificationId` are
// intentionally excluded.
//
// -----------------------------------------------------------------------------
//
// Reference:
//
// referenceType and referencePublicId are exposed when a Notification has an
// associated domain reference.
//
// These values remain opaque metadata. This mapper does not resolve the
// referenced domain object.
//
// -----------------------------------------------------------------------------
//
// Source Event:
//
// eventType and eventPublicId are exposed when the Notification was generated
// from a source event.
//
// These values remain opaque metadata. This mapper does not resolve the source
// event or originating domain.
//
// -----------------------------------------------------------------------------
//
// Deliveries:
//
// NotificationAggregate owns NotificationDeliveryEntity[].
//
// The mapper exposes:
//
// - deliveryCount;
// - hasDeliveries;
// - deliveries.
//
// NotificationDeliveryEntity is not an aggregate root and therefore its
// response mapping belongs to this aggregate response mapper.
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

import type { NotificationAggregate } from '../../../domain/aggregates/notification.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { NotificationEntity } from '../../../domain/entities/notification.entity';

import type { NotificationDeliveryEntity } from '../../../domain/entities/notification-delivery.entity';

// =============================================================================
// Notification Delivery Response
// =============================================================================

export interface NotificationDeliveryResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Notification Delivery.
   *
   * The internal delivery identity is intentionally excluded.
   */
  publicId: string;

  // ---------------------------------------------------------------------------
  // Delivery
  // ---------------------------------------------------------------------------

  /**
   * Notification delivery channel.
   */
  channel: string;

  /**
   * Current Notification delivery lifecycle status.
   */
  status: string;

  /**
   * Provider reference assigned to the external delivery provider.
   *
   * Undefined when no provider reference has been assigned.
   */
  providerReference: string | undefined;

  // ---------------------------------------------------------------------------
  // Delivery Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the delivery was sent.
   */
  sentAt: Date | undefined;

  /**
   * Timestamp at which the delivery was confirmed as delivered.
   */
  deliveredAt: Date | undefined;

  /**
   * Timestamp at which the delivery failed.
   */
  failedAt: Date | undefined;

  /**
   * Timestamp at which the delivery was cancelled.
   */
  cancelledAt: Date | undefined;

  /**
   * Reason associated with a failed delivery.
   */
  failureReason: string | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the delivery was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the delivery was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Notification Response
// =============================================================================

export interface NotificationResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Notification aggregate.
   */
  publicId: string;

  /**
   * Public identifier of the Notification recipient.
   *
   * This is an opaque reference to the Identity domain.
   */
  recipientPublicId: string;

  // ---------------------------------------------------------------------------
  // Notification
  // ---------------------------------------------------------------------------

  /**
   * Notification type.
   */
  type: string;

  /**
   * Notification priority.
   */
  priority: string;

  /**
   * Current Notification lifecycle status.
   */
  status: string;

  /**
   * Notification title.
   */
  title: string;

  /**
   * Notification body.
   */
  body: string;

  // ---------------------------------------------------------------------------
  // Reference
  // ---------------------------------------------------------------------------

  /**
   * Type of the domain object referenced by the Notification.
   *
   * Undefined when no reference exists.
   */
  referenceType: string | undefined;

  /**
   * Public identifier of the domain object referenced by the Notification.
   *
   * Undefined when no reference exists.
   */
  referencePublicId: string | undefined;

  // ---------------------------------------------------------------------------
  // Source Event
  // ---------------------------------------------------------------------------

  /**
   * Type of the source event that generated the Notification.
   *
   * Undefined when no source event reference exists.
   */
  eventType: string | undefined;

  /**
   * Public identifier of the source event that generated the Notification.
   *
   * Undefined when no source event reference exists.
   */
  eventPublicId: string | undefined;

  // ---------------------------------------------------------------------------
  // Notification Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Notification was sent.
   */
  sentAt: Date | undefined;

  /**
   * Timestamp at which the Notification was read.
   */
  readAt: Date | undefined;

  /**
   * Timestamp at which the Notification failed.
   */
  failedAt: Date | undefined;

  /**
   * Timestamp at which the Notification was cancelled.
   */
  cancelledAt: Date | undefined;

  /**
   * Reason associated with a failed Notification.
   */
  failureReason: string | undefined;

  // ---------------------------------------------------------------------------
  // Delivery State
  // ---------------------------------------------------------------------------

  /**
   * Number of delivery records owned by the aggregate.
   */
  deliveryCount: number;

  /**
   * Indicates whether the aggregate contains delivery records.
   */
  hasDeliveries: boolean;

  /**
   * Delivery records owned by the Notification aggregate.
   */
  deliveries: NotificationDeliveryResponse[];

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Notification was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the Notification was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class NotificationResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps a NotificationAggregate into a NotificationResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(
    aggregate: NotificationAggregate,
  ): NotificationResponse {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Notification aggregate is required.');
    }

    return this.mapAggregate(aggregate);
  }

  // ===========================================================================
  // Entity -> Response
  // ===========================================================================

  /**
   * Maps a NotificationEntity directly into a NotificationResponse.
   *
   * Entity-level delivery collection state is not available from the
   * Notification entity alone.
   *
   * Therefore:
   *
   * - deliveries is an empty collection;
   * - deliveryCount is 0;
   * - hasDeliveries is false.
   *
   * Application workflows that have the complete aggregate should prefer
   * toResponse().
   */
  public static fromEntity(
    notification: NotificationEntity,
  ): NotificationResponse {
    if (notification === undefined || notification === null) {
      throw new Error('Notification entity is required.');
    }

    return this.mapEntity(notification);
  }

  // ===========================================================================
  // Delivery Entity -> Response
  // ===========================================================================

  /**
   * Maps a NotificationDeliveryEntity into a safe delivery response object.
   *
   * The delivery entity is owned by NotificationAggregate and is therefore
   * mapped here rather than through an independent aggregate response mapper.
   */
  public static fromDeliveryEntity(
    delivery: NotificationDeliveryEntity,
  ): NotificationDeliveryResponse {
    if (delivery === undefined || delivery === null) {
      throw new Error('Notification Delivery entity is required.');
    }

    return this.mapDelivery(delivery);
  }

  // ===========================================================================
  // Aggregate Mapping
  // ===========================================================================

  /**
   * Maps the complete Notification aggregate.
   *
   * This mapping preserves aggregate-owned delivery collection state.
   */
  private static mapAggregate(
    aggregate: NotificationAggregate,
  ): NotificationResponse {
    const notification = aggregate.notification;

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: notification.publicId.value,

      recipientPublicId: notification.recipientPublicId.value,

      // -----------------------------------------------------------------------
      // Notification
      // -----------------------------------------------------------------------

      type: notification.type.value,

      priority: notification.priority.value,

      status: notification.status.value,

      title: notification.title.value,

      body: notification.body.value,

      // -----------------------------------------------------------------------
      // Reference
      // -----------------------------------------------------------------------

      referenceType: notification.referenceType?.value,

      referencePublicId: notification.referencePublicId?.value,

      // -----------------------------------------------------------------------
      // Source Event
      // -----------------------------------------------------------------------

      eventType: notification.eventType?.value,

      eventPublicId: notification.eventPublicId?.value,

      // -----------------------------------------------------------------------
      // Notification Lifecycle
      // -----------------------------------------------------------------------

      sentAt:
        notification.sentAt !== undefined
          ? new Date(notification.sentAt.getTime())
          : undefined,

      readAt:
        notification.readAt !== undefined
          ? new Date(notification.readAt.getTime())
          : undefined,

      failedAt:
        notification.failedAt !== undefined
          ? new Date(notification.failedAt.getTime())
          : undefined,

      cancelledAt:
        notification.cancelledAt !== undefined
          ? new Date(notification.cancelledAt.getTime())
          : undefined,

      failureReason: notification.failureReason,

      // -----------------------------------------------------------------------
      // Delivery State
      // -----------------------------------------------------------------------

      deliveryCount: aggregate.deliveries.length,

      hasDeliveries: aggregate.deliveries.length > 0,

      deliveries: aggregate.deliveries.map((delivery) =>
        this.mapDelivery(delivery),
      ),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(notification.createdAt.getTime()),

      updatedAt: new Date(notification.updatedAt.getTime()),
    };
  }

  // ===========================================================================
  // Entity Mapping
  // ===========================================================================

  /**
   * Maps the Notification entity directly.
   *
   * Because deliveries are aggregate-owned children, an entity-only response
   * cannot infer their collection state.
   */
  private static mapEntity(
    notification: NotificationEntity,
  ): NotificationResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: notification.publicId.value,

      recipientPublicId: notification.recipientPublicId.value,

      // -----------------------------------------------------------------------
      // Notification
      // -----------------------------------------------------------------------

      type: notification.type.value,

      priority: notification.priority.value,

      status: notification.status.value,

      title: notification.title.value,

      body: notification.body.value,

      // -----------------------------------------------------------------------
      // Reference
      // -----------------------------------------------------------------------

      referenceType: notification.referenceType?.value,

      referencePublicId: notification.referencePublicId?.value,

      // -----------------------------------------------------------------------
      // Source Event
      // -----------------------------------------------------------------------

      eventType: notification.eventType?.value,

      eventPublicId: notification.eventPublicId?.value,

      // -----------------------------------------------------------------------
      // Notification Lifecycle
      // -----------------------------------------------------------------------

      sentAt:
        notification.sentAt !== undefined
          ? new Date(notification.sentAt.getTime())
          : undefined,

      readAt:
        notification.readAt !== undefined
          ? new Date(notification.readAt.getTime())
          : undefined,

      failedAt:
        notification.failedAt !== undefined
          ? new Date(notification.failedAt.getTime())
          : undefined,

      cancelledAt:
        notification.cancelledAt !== undefined
          ? new Date(notification.cancelledAt.getTime())
          : undefined,

      failureReason: notification.failureReason,

      // -----------------------------------------------------------------------
      // Delivery State
      // -----------------------------------------------------------------------

      deliveries: [],

      deliveryCount: 0,

      hasDeliveries: false,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(notification.createdAt.getTime()),

      updatedAt: new Date(notification.updatedAt.getTime()),
    };
  }

  // ===========================================================================
  // Delivery Mapping
  // ===========================================================================

  /**
   * Maps a NotificationDeliveryEntity into a safe response object.
   *
   * The delivery's internal `id` and internal `notificationId` are
   * intentionally excluded.
   */
  private static mapDelivery(
    delivery: NotificationDeliveryEntity,
  ): NotificationDeliveryResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: delivery.publicId.value,

      // -----------------------------------------------------------------------
      // Delivery
      // -----------------------------------------------------------------------

      channel: delivery.channel.value,

      status: delivery.status.value,

      providerReference: delivery.providerReference?.value,

      // -----------------------------------------------------------------------
      // Delivery Lifecycle
      // -----------------------------------------------------------------------

      sentAt:
        delivery.sentAt !== undefined
          ? new Date(delivery.sentAt.getTime())
          : undefined,

      deliveredAt:
        delivery.deliveredAt !== undefined
          ? new Date(delivery.deliveredAt.getTime())
          : undefined,

      failedAt:
        delivery.failedAt !== undefined
          ? new Date(delivery.failedAt.getTime())
          : undefined,

      cancelledAt:
        delivery.cancelledAt !== undefined
          ? new Date(delivery.cancelledAt.getTime())
          : undefined,

      failureReason: delivery.failureReason,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(delivery.createdAt.getTime()),

      updatedAt: new Date(delivery.updatedAt.getTime()),
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default NotificationResponseMapper;
