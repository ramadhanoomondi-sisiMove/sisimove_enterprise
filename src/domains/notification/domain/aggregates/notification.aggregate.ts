// -----------------------------------------------------------------------------
// Notification — Aggregate
// -----------------------------------------------------------------------------
//
// Represents the Notification aggregate.
//
// Aggregate boundary:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// The NotificationAggregate is the consistency boundary for:
//
// - notification lifecycle;
// - notification content;
// - notification recipient;
// - notification references;
// - notification source events;
// - notification deliveries;
// - delivery channel uniqueness;
// - delivery lifecycle;
// - delivery ownership;
// - notification-rooted domain events.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain the NotificationEntity root;
// - maintain notification deliveries;
// - enforce delivery uniqueness by channel;
// - ensure deliveries belong to this notification;
// - manage notification lifecycle;
// - manage delivery lifecycle;
// - record Notification domain events;
// - preserve aggregate invariants during creation and rehydration.
//
// -----------------------------------------------------------------------------
//
// This aggregate does NOT:
//
// - load Identity aggregates;
// - validate whether recipient identities exist;
// - load Journey aggregates;
// - load Booking aggregates;
// - load Financial aggregates;
// - access repositories;
// - access Prisma;
// - perform authorization;
// - send email;
// - send SMS;
// - send push notifications;
// - deliver notifications through external providers;
// - interpret provider-specific delivery behavior.
//
// External delivery providers and application workflows belong outside the
// domain aggregate.
//
// -----------------------------------------------------------------------------
//
// Aggregate relationships:
//
// NotificationEntity owns:
//
// - recipientPublicId;
// - notification type;
// - notification priority;
// - notification status;
// - title and body;
// - optional cross-domain reference;
// - optional source event;
// - notification lifecycle timestamps.
//
// NotificationDeliveryEntity represents one delivery channel belonging to this
// notification.
//
// Prisma foreign keys are persistence concerns and are not used as mutable
// aggregate relationships.
//
// -----------------------------------------------------------------------------
//
// Aggregate identity:
//
// The aggregate identity is the NotificationEntity identity.
//
// Domain events emitted by this aggregate are therefore notification-rooted,
// even when the event concerns a NotificationDeliveryEntity.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from '../exceptions/notification.exception';

// -----------------------------------------------------------------------------
// Events — Notification
// -----------------------------------------------------------------------------

import { NotificationCancelledEvent } from '../events/notification-cancelled.event';
import { NotificationCreatedEvent } from '../events/notification-created.event';
import { NotificationFailedEvent } from '../events/notification-failed.event';
import { NotificationReadEvent } from '../events/notification-read.event';
import { NotificationSentEvent } from '../events/notification-sent.event';

// -----------------------------------------------------------------------------
// Events — Notification Delivery
// -----------------------------------------------------------------------------

import { NotificationDeliveryCancelledEvent } from '../events/notification-delivery-cancelled.event';
import { NotificationDeliveryCreatedEvent } from '../events/notification-delivery-created.event';
import { NotificationDeliveryDeliveredEvent } from '../events/notification-delivery-delivered.event';
import { NotificationDeliveryFailedEvent } from '../events/notification-delivery-failed.event';
import { NotificationDeliverySentEvent } from '../events/notification-delivery-sent.event';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { NotificationDeliveryEntity } from '../entities/notification-delivery.entity';
import { NotificationEntity } from '../entities/notification.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { NotificationDeliveryPublicId } from '../value-objects/notification-delivery-public-id.vo';

import type { NotificationProviderReference } from '../value-objects/notification-provider-reference.vo';

import type { NotificationPublicId } from '../value-objects/notification-public-id.vo';

import type { NotificationStatus } from '../value-objects/notification-status.vo';

// =============================================================================
// Properties
// =============================================================================

export interface NotificationAggregateProps {
  /**
   * Notification aggregate root.
   */
  notification: NotificationEntity;

  /**
   * Notification delivery child entities.
   */
  deliveries: NotificationDeliveryEntity[];
}

// =============================================================================
// Aggregate
// =============================================================================

export class NotificationAggregate extends AggregateRoot<
  NotificationAggregateProps,
  NotificationPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: NotificationAggregateProps) {
    super(props, props.notification.id, props.notification.publicId);

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a Notification aggregate.
   *
   * Aggregate construction does not automatically record a domain event.
   *
   * The application workflow is responsible for calling recordCreated() once
   * correlation metadata is available.
   */
  public static create(
    notification: NotificationEntity,
    deliveries: NotificationDeliveryEntity[] = [],
  ): NotificationAggregate {
    NotificationAggregate.ensureNotification(notification);
    NotificationAggregate.ensureDeliveries(deliveries);

    return new NotificationAggregate({
      notification,
      deliveries: [...deliveries],
    });
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Notification aggregate.
   *
   * Rehydration does not emit domain events.
   *
   * Existing delivery state is preserved exactly as supplied by persistence.
   */
  public static rehydrate(
    notification: NotificationEntity,
    deliveries: NotificationDeliveryEntity[],
  ): NotificationAggregate {
    NotificationAggregate.ensureNotification(notification);
    NotificationAggregate.ensureDeliveries(deliveries);

    return new NotificationAggregate({
      notification,
      deliveries: [...deliveries],
    });
  }

  // ===========================================================================
  // Notification
  // ===========================================================================

  /**
   * Notification aggregate root.
   */
  public get notification(): NotificationEntity {
    return this.props.notification;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal aggregate identity.
   */
  public override get id(): UniqueEntityId {
    return this.notification.id;
  }

  /**
   * Public aggregate identity.
   */
  public override get publicId(): NotificationPublicId {
    return this.notification.publicId;
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Notification status.
   */
  public get status(): NotificationStatus {
    return this.notification.status;
  }

  /**
   * Determines whether the Notification is pending.
   */
  public isPending(): boolean {
    return this.notification.isPending();
  }

  /**
   * Determines whether the Notification is sent.
   */
  public isSent(): boolean {
    return this.notification.isSent();
  }

  /**
   * Determines whether the Notification is read.
   */
  public isRead(): boolean {
    return this.notification.isRead();
  }

  /**
   * Determines whether the Notification has failed.
   */
  public isFailed(): boolean {
    return this.notification.isFailed();
  }

  /**
   * Determines whether the Notification is cancelled.
   */
  public isCancelled(): boolean {
    return this.notification.isCancelled();
  }

  /**
   * Determines whether the Notification is terminal.
   *
   * Important:
   *
   * NotificationEntity exposes isTerminal() as a method.
   */
  public isTerminal(): boolean {
    return this.notification.isTerminal();
  }

  // ===========================================================================
  // Recipient
  // ===========================================================================

  /**
   * Public identity of the Notification recipient.
   *
   * The identifier is owned by the Identity domain and remains opaque here.
   */
  public get recipientPublicId(): string {
    return this.notification.recipientPublicId.value;
  }

  /**
   * Determines whether this Notification belongs to the supplied recipient.
   */
  public belongsToRecipient(memberPublicId: string): boolean {
    if (typeof memberPublicId !== 'string') {
      return false;
    }

    const normalized = memberPublicId.trim();

    if (normalized.length === 0) {
      return false;
    }

    return this.notification.recipientPublicId.value === normalized;
  }

  // ===========================================================================
  // Deliveries
  // ===========================================================================

  /**
   * Notification delivery child entities.
   *
   * The returned collection is readonly so callers cannot bypass aggregate
   * invariants by directly mutating the collection.
   */
  public get deliveries(): readonly NotificationDeliveryEntity[] {
    return this.props.deliveries;
  }

  /**
   * Number of deliveries belonging to the Notification.
   */
  public get deliveryCount(): number {
    return this.props.deliveries.length;
  }

  /**
   * Determines whether the Notification has any deliveries.
   */
  public hasDeliveries(): boolean {
    return this.props.deliveries.length > 0;
  }

  /**
   * Determines whether a delivery with the supplied internal identity exists.
   */
  public hasDelivery(deliveryId: UniqueEntityId): boolean {
    NotificationAggregate.ensureInternalId(deliveryId);

    return this.props.deliveries.some((delivery) =>
      delivery.id.equals(deliveryId),
    );
  }

  /**
   * Finds a delivery by internal identity.
   */
  public getDelivery(
    deliveryId: UniqueEntityId,
  ): NotificationDeliveryEntity | undefined {
    NotificationAggregate.ensureInternalId(deliveryId);

    return this.props.deliveries.find((delivery) =>
      delivery.id.equals(deliveryId),
    );
  }

  /**
   * Finds a delivery by public identity.
   */
  public getDeliveryByPublicId(
    deliveryPublicId: NotificationDeliveryPublicId,
  ): NotificationDeliveryEntity | undefined {
    NotificationAggregate.ensureDeliveryPublicId(deliveryPublicId);

    return this.props.deliveries.find((delivery) =>
      delivery.publicId.equals(deliveryPublicId),
    );
  }

  // ===========================================================================
  // Add Delivery
  // ===========================================================================

  /**
   * Adds a new Notification delivery.
   *
   * Delivery creation is restricted to a pending Notification.
   *
   * The delivery itself must:
   *
   * - be a NotificationDeliveryEntity;
   * - belong to this Notification;
   * - be PENDING;
   * - have a unique internal identity;
   * - use a channel not already present in the aggregate.
   */
  public addDelivery(
    delivery: NotificationDeliveryEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensurePending();

    NotificationAggregate.ensureDelivery(delivery);
    NotificationAggregate.ensureCorrelationId(correlationId);
    NotificationAggregate.ensureOptionalCausationId(causationId);

    this.ensureDeliveryBelongsToAggregate(delivery);

    if (this.hasDelivery(delivery.id)) {
      throw new NotificationException(
        'Notification aggregate cannot contain duplicate deliveries.',
      );
    }

    this.ensureChannelIsAvailable(delivery);

    if (!delivery.isPending()) {
      throw new NotificationException(
        'Only a pending notification delivery can be added as a new delivery.',
      );
    }

    this.props.deliveries.push(delivery);

    this.addDomainEvent(
      new NotificationDeliveryCreatedEvent(
        this.id.value,
        delivery.publicId.value,
        this.publicId.value,
        delivery.channel.value,
        delivery.status.value,
        delivery.createdAt,
        correlationId,
        causationId,
      ),
    );

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Send Notification
  // ===========================================================================

  /**
   * Marks the Notification as SENT.
   *
   * NotificationEntity owns the lifecycle transition.
   *
   * The aggregate records the resulting domain event.
   */
  public send(
    correlationId: string,
    causationId?: string,
    sentAt: Date = new Date(),
  ): void {
    NotificationAggregate.ensureCorrelationId(correlationId);
    NotificationAggregate.ensureOptionalCausationId(causationId);
    NotificationAggregate.ensureValidDate(sentAt, 'notification sent date');

    this.notification.send(sentAt);

    const actualSentAt = this.notification.sentAt;

    if (actualSentAt === undefined) {
      throw new NotificationException(
        'Notification was sent without a sent timestamp.',
      );
    }

    this.addDomainEvent(
      new NotificationSentEvent(
        this.id.value,
        this.publicId.value,
        this.notification.recipientPublicId.value,
        this.notification.type.value,
        this.notification.priority.value,
        this.notification.status.value,
        actualSentAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Read Notification
  // ===========================================================================

  /**
   * Marks the Notification as READ.
   */
  public read(
    correlationId: string,
    causationId?: string,
    readAt: Date = new Date(),
  ): void {
    NotificationAggregate.ensureCorrelationId(correlationId);
    NotificationAggregate.ensureOptionalCausationId(causationId);
    NotificationAggregate.ensureValidDate(readAt, 'notification read date');

    this.notification.read(readAt);

    const actualReadAt = this.notification.readAt;

    if (actualReadAt === undefined) {
      throw new NotificationException(
        'Notification was read without a read timestamp.',
      );
    }

    this.addDomainEvent(
      new NotificationReadEvent(
        this.id.value,
        this.publicId.value,
        this.notification.recipientPublicId.value,
        this.notification.type.value,
        this.notification.priority.value,
        this.notification.status.value,
        actualReadAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Fail Notification
  // ===========================================================================

  /**
   * Marks the Notification as FAILED.
   *
   * This does not automatically fail its deliveries.
   */
  public fail(
    failureReason: string,
    correlationId: string,
    causationId?: string,
    failedAt: Date = new Date(),
  ): void {
    NotificationAggregate.ensureNonEmptyString(
      failureReason,
      'Notification failure reason',
    );

    NotificationAggregate.ensureCorrelationId(correlationId);
    NotificationAggregate.ensureOptionalCausationId(causationId);
    NotificationAggregate.ensureValidDate(
      failedAt,
      'notification failure date',
    );

    this.notification.fail(failureReason, failedAt);

    const actualFailedAt = this.notification.failedAt;

    if (actualFailedAt === undefined) {
      throw new NotificationException(
        'Notification failed without a failure timestamp.',
      );
    }

    const actualFailureReason = this.notification.failureReason;

    if (actualFailureReason === undefined) {
      throw new NotificationException(
        'Notification failed without a failure reason.',
      );
    }

    this.addDomainEvent(
      new NotificationFailedEvent(
        this.id.value,
        this.publicId.value,
        this.notification.recipientPublicId.value,
        this.notification.type.value,
        this.notification.priority.value,
        this.notification.status.value,
        actualFailureReason,
        actualFailedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Cancel Notification
  // ===========================================================================

  /**
   * Cancels the Notification.
   */
  public cancel(
    correlationId: string,
    causationId?: string,
    cancelledAt: Date = new Date(),
  ): void {
    NotificationAggregate.ensureCorrelationId(correlationId);
    NotificationAggregate.ensureOptionalCausationId(causationId);
    NotificationAggregate.ensureValidDate(
      cancelledAt,
      'notification cancellation date',
    );

    this.notification.cancel(cancelledAt);

    const actualCancelledAt = this.notification.cancelledAt;

    if (actualCancelledAt === undefined) {
      throw new NotificationException(
        'Notification was cancelled without a cancellation timestamp.',
      );
    }

    this.addDomainEvent(
      new NotificationCancelledEvent(
        this.id.value,
        this.publicId.value,
        this.notification.recipientPublicId.value,
        this.notification.type.value,
        this.notification.priority.value,
        this.notification.status.value,
        actualCancelledAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Notification Creation Event
  // ===========================================================================

  /**
   * Records the Notification-created event.
   *
   * Aggregate construction remains event-free so the application layer can
   * supply correlation metadata explicitly.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    NotificationAggregate.ensureCorrelationId(correlationId);
    NotificationAggregate.ensureOptionalCausationId(causationId);

    this.addDomainEvent(
      new NotificationCreatedEvent(
        this.id.value,
        this.publicId.value,
        this.notification.recipientPublicId.value,
        this.notification.type.value,
        this.notification.priority.value,
        this.notification.status.value,
        this.notification.title.value,
        this.notification.body.value,
        this.notification.referenceType?.value,
        this.notification.referencePublicId?.value,
        this.notification.eventType?.value,
        this.notification.eventPublicId?.value,
        this.notification.createdAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Send Delivery
  // ===========================================================================

  /**
   * Marks a pending Notification delivery as SENT.
   *
   * Provider communication occurs outside the aggregate.
   *
   * providerReference is deliberately typed as the domain value object.
   * The aggregate does not construct provider references from raw strings.
   */
  public sendDelivery(
    deliveryId: UniqueEntityId,
    providerReference: NotificationProviderReference | undefined,
    correlationId: string,
    causationId?: string,
    sentAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    NotificationAggregate.ensureInternalId(deliveryId);
    NotificationAggregate.ensureCorrelationId(correlationId);
    NotificationAggregate.ensureOptionalCausationId(causationId);
    NotificationAggregate.ensureValidDate(
      sentAt,
      'notification delivery sent date',
    );

    NotificationAggregate.ensureOptionalProviderReference(providerReference);

    const delivery = this.requireDelivery(deliveryId);

    if (providerReference !== undefined) {
      delivery.assignProviderReference(providerReference);
    }

    delivery.send(sentAt);

    const actualSentAt = delivery.sentAt;

    if (actualSentAt === undefined) {
      throw new NotificationException(
        'Notification delivery was sent without a sent timestamp.',
      );
    }

    this.addDomainEvent(
      new NotificationDeliverySentEvent(
        this.id.value,
        delivery.publicId.value,
        this.publicId.value,
        delivery.channel.value,
        delivery.status.value,
        delivery.providerReference?.value,
        actualSentAt,
        correlationId,
        causationId,
      ),
    );

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Deliver Delivery
  // ===========================================================================

  /**
   * Marks a SENT delivery as DELIVERED.
   *
   * Aggregate responsibility:
   *
   * - locate the Notification Delivery;
   * - delegate the delivery transition to the child entity;
   * - verify the resulting delivery timestamp;
   * - record the NotificationDeliveryDelivered domain event;
   * - revalidate aggregate invariants.
   *
   * The aggregate does not implement the delivery-state transition itself.
   * That behavior belongs to NotificationDeliveryEntity.
   */
  public deliverDelivery(
    deliveryId: UniqueEntityId,
    correlationId: string,
    causationId?: string,
    deliveredAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    NotificationAggregate.ensureInternalId(deliveryId);
    NotificationAggregate.ensureCorrelationId(correlationId);
    NotificationAggregate.ensureOptionalCausationId(causationId);
    NotificationAggregate.ensureValidDate(
      deliveredAt,
      'notification delivery date',
    );

    const delivery = this.requireDelivery(deliveryId);

    // -------------------------------------------------------------------------
    // Delegate state transition to the child entity.
    // -------------------------------------------------------------------------

    delivery.deliver(deliveredAt);

    // -------------------------------------------------------------------------
    // Verify the resulting state.
    // -------------------------------------------------------------------------

    const actualDeliveredAt = delivery.deliveredAt;

    if (actualDeliveredAt === undefined) {
      throw new NotificationException(
        'Notification delivery was delivered without a delivery timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // Record domain event.
    // -------------------------------------------------------------------------
    //
    // Event contract:
    //
    // NotificationDeliveryDeliveredEvent(
    //   notificationId,
    //   notificationPublicId,
    //   deliveryPublicId,
    //   channel,
    //   status,
    //   deliveredAt,
    //   correlationId?,
    //   causationId?,
    // )
    //
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new NotificationDeliveryDeliveredEvent(
        this.id.value,
        this.publicId.value,
        delivery.publicId.value,
        delivery.channel.value,
        delivery.status.value,
        actualDeliveredAt,
        correlationId,
        causationId,
      ),
    );

    // -------------------------------------------------------------------------
    // Revalidate aggregate invariants.
    // -------------------------------------------------------------------------

    this.validateAggregateInvariants();
  }
  // ===========================================================================
  // Fail Delivery
  // ===========================================================================

  /**
   * Marks a pending delivery as FAILED.
   *
   * Delivery failure does not automatically fail the Notification.
   */
  public failDelivery(
    deliveryId: UniqueEntityId,
    failureReason: string,
    correlationId: string,
    causationId?: string,
    failedAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    NotificationAggregate.ensureInternalId(deliveryId);

    NotificationAggregate.ensureNonEmptyString(
      failureReason,
      'Notification delivery failure reason',
    );

    NotificationAggregate.ensureCorrelationId(correlationId);
    NotificationAggregate.ensureOptionalCausationId(causationId);
    NotificationAggregate.ensureValidDate(
      failedAt,
      'notification delivery failure date',
    );

    const delivery = this.requireDelivery(deliveryId);

    delivery.fail(failureReason, failedAt);

    const actualFailedAt = delivery.failedAt;

    if (actualFailedAt === undefined) {
      throw new NotificationException(
        'Notification delivery failed without a failure timestamp.',
      );
    }

    const actualFailureReason = delivery.failureReason;

    if (actualFailureReason === undefined) {
      throw new NotificationException(
        'Notification delivery failed without a failure reason.',
      );
    }

    this.addDomainEvent(
      new NotificationDeliveryFailedEvent(
        this.id.value,
        delivery.publicId.value,
        this.publicId.value,
        delivery.channel.value,
        delivery.status.value,
        actualFailureReason,
        actualFailedAt,
        correlationId,
        causationId,
      ),
    );

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Cancel Delivery
  // ===========================================================================

  /**
   * Cancels a pending delivery.
   */
  public cancelDelivery(
    deliveryId: UniqueEntityId,
    correlationId: string,
    causationId?: string,
    cancelledAt: Date = new Date(),
  ): void {
    this.ensureOperational();

    NotificationAggregate.ensureInternalId(deliveryId);
    NotificationAggregate.ensureCorrelationId(correlationId);
    NotificationAggregate.ensureOptionalCausationId(causationId);
    NotificationAggregate.ensureValidDate(
      cancelledAt,
      'notification delivery cancellation date',
    );

    const delivery = this.requireDelivery(deliveryId);

    delivery.cancel(cancelledAt);

    const actualCancelledAt = delivery.cancelledAt;

    if (actualCancelledAt === undefined) {
      throw new NotificationException(
        'Notification delivery was cancelled without a cancellation timestamp.',
      );
    }

    this.addDomainEvent(
      new NotificationDeliveryCancelledEvent(
        this.id.value,
        delivery.publicId.value,
        this.publicId.value,
        delivery.channel.value,
        delivery.status.value,
        actualCancelledAt,
        correlationId,
        causationId,
      ),
    );

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Aggregate Invariants
  // ===========================================================================

  /**
   * Validates invariants spanning the Notification root and delivery children.
   *
   * Entity-local invariants remain owned by the entities themselves.
   */
  private validateAggregateInvariants(): void {
    NotificationAggregate.ensureNotification(this.notification);
    NotificationAggregate.ensureDeliveries(this.deliveries);

    this.ensureDeliveryIdsAreUnique();
    this.ensureDeliveryChannelsAreUnique();
    this.ensureDeliveryNotificationOwnership();
  }

  // ===========================================================================
  // Delivery Identity Invariants
  // ===========================================================================

  /**
   * Delivery internal identities must be unique within the aggregate.
   */
  private ensureDeliveryIdsAreUnique(): void {
    const deliveryIds = new Set<string>();

    for (const delivery of this.deliveries) {
      const deliveryId = delivery.id.value;

      if (deliveryIds.has(deliveryId)) {
        throw new NotificationException(
          'Notification aggregate cannot contain duplicate deliveries.',
        );
      }

      deliveryIds.add(deliveryId);
    }
  }

  // ===========================================================================
  // Delivery Channel Invariants
  // ===========================================================================

  /**
   * A Notification may contain at most one delivery for each channel.
   */
  private ensureDeliveryChannelsAreUnique(): void {
    const channels = new Set<string>();

    for (const delivery of this.deliveries) {
      const channel = delivery.channel.value;

      if (channels.has(channel)) {
        throw new NotificationException(
          'Notification aggregate cannot contain multiple deliveries for the same channel.',
        );
      }

      channels.add(channel);
    }
  }

  // ===========================================================================
  // Delivery Ownership Invariants
  // ===========================================================================

  /**
   * Every delivery must belong to this Notification aggregate.
   */
  private ensureDeliveryNotificationOwnership(): void {
    for (const delivery of this.deliveries) {
      this.ensureDeliveryBelongsToAggregate(delivery);
    }
  }

  /**
   * Ensures a delivery belongs to this aggregate.
   */
  private ensureDeliveryBelongsToAggregate(
    delivery: NotificationDeliveryEntity,
  ): void {
    if (!delivery.notificationId.equals(this.id)) {
      throw new NotificationException(
        'Notification aggregate contains a delivery belonging to another notification.',
      );
    }
  }

  /**
   * Ensures a delivery channel is not already present.
   */
  private ensureChannelIsAvailable(delivery: NotificationDeliveryEntity): void {
    const existingDelivery = this.props.deliveries.find((existing) =>
      existing.channel.equals(delivery.channel),
    );

    if (existingDelivery !== undefined) {
      throw new NotificationException(
        'Notification cannot contain multiple deliveries for the same channel.',
      );
    }
  }

  // ===========================================================================
  // Delivery Retrieval
  // ===========================================================================

  /**
   * Returns a delivery or throws when it does not belong to this aggregate.
   */
  private requireDelivery(
    deliveryId: UniqueEntityId,
  ): NotificationDeliveryEntity {
    const delivery = this.getDelivery(deliveryId);

    if (delivery === undefined) {
      throw new NotificationException(
        'Notification delivery does not belong to this notification.',
      );
    }

    return delivery;
  }

  // ===========================================================================
  // Notification State Guards
  // ===========================================================================

  /**
   * Delivery creation requires a pending Notification.
   */
  private ensurePending(): void {
    if (!this.notification.isPending()) {
      throw new NotificationException(
        'Notification must be pending for this operation.',
      );
    }
  }

  /**
   * Delivery lifecycle operations are permitted while the Notification is
   * pending or sent.
   *
   * A read, failed, or cancelled Notification is no longer operational for
   * delivery mutation.
   */
  private ensureOperational(): void {
    if (!this.notification.isPending() && !this.notification.isSent()) {
      throw new NotificationException(
        'Notification must be pending or sent for this delivery operation.',
      );
    }
  }

  // ===========================================================================
  // Entity Guards
  // ===========================================================================

  private static ensureNotification(
    notification: unknown,
  ): asserts notification is NotificationEntity {
    if (!(notification instanceof NotificationEntity)) {
      throw new NotificationException(
        'Notification aggregate requires a valid NotificationEntity.',
      );
    }
  }

  private static ensureDelivery(
    delivery: unknown,
  ): asserts delivery is NotificationDeliveryEntity {
    if (!(delivery instanceof NotificationDeliveryEntity)) {
      throw new NotificationException(
        'Notification delivery must be a valid NotificationDeliveryEntity.',
      );
    }
  }

  private static ensureDeliveries(
    deliveries: unknown,
  ): asserts deliveries is NotificationDeliveryEntity[] {
    if (!Array.isArray(deliveries)) {
      throw new NotificationException(
        'Notification deliveries must be an array.',
      );
    }

    for (const delivery of deliveries) {
      NotificationAggregate.ensureDelivery(delivery);
    }
  }

  // ===========================================================================
  // Identity Guards
  // ===========================================================================

  private static ensureInternalId(id: unknown): asserts id is UniqueEntityId {
    if (!(id instanceof UniqueEntityId)) {
      throw new NotificationException(
        'Notification internal identity must be a valid internal entity identity.',
      );
    }
  }

  private static ensureDeliveryPublicId(
    deliveryPublicId: unknown,
  ): asserts deliveryPublicId is NotificationDeliveryPublicId {
    if (!(deliveryPublicId instanceof NotificationDeliveryPublicId)) {
      throw new NotificationException(
        'Notification delivery public identity must be a valid NotificationDeliveryPublicId.',
      );
    }
  }

  // ===========================================================================
  // Provider Reference Guards
  // ===========================================================================

  /**
   * Validates an optional provider reference.
   *
   * Provider references are domain value objects.
   *
   * Raw strings are intentionally rejected at this boundary.
   */
  private static ensureOptionalProviderReference(
    providerReference: NotificationProviderReference | undefined,
  ): void {
    if (providerReference === undefined) {
      return;
    }

    if (providerReference === null || typeof providerReference !== 'object') {
      throw new NotificationException(
        'Notification delivery provider reference must be a valid value object.',
      );
    }
  }

  // ===========================================================================
  // Event Guards
  // ===========================================================================

  private static ensureCorrelationId(correlationId: string): void {
    NotificationAggregate.ensureNonEmptyString(
      correlationId,
      'Notification correlation identity',
    );
  }

  private static ensureOptionalCausationId(
    causationId: string | undefined,
  ): void {
    if (causationId === undefined) {
      return;
    }

    NotificationAggregate.ensureNonEmptyString(
      causationId,
      'Notification causation identity',
    );
  }

  // ===========================================================================
  // Primitive Guards
  // ===========================================================================

  private static ensureNonEmptyString(
    value: unknown,
    fieldName: string,
  ): asserts value is string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new NotificationException(
        `${fieldName} must be a non-empty string.`,
      );
    }
  }

  // ===========================================================================
  // Date Guards
  // ===========================================================================

  private static ensureValidDate(
    value: unknown,
    fieldName: string,
  ): asserts value is Date {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new NotificationException(`${fieldName} must be a valid date.`);
    }
  }
}
