// -----------------------------------------------------------------------------
// Notification Delivery — Entity
// -----------------------------------------------------------------------------
//
// Represents a delivery attempt/channel of a Notification within the
// Notification domain.
//
// Aggregate context:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationDeliveryEntity is a CHILD ENTITY.
//
// It is NOT an aggregate root.
//
// -----------------------------------------------------------------------------
//
// The Notification Delivery entity is the authoritative owner of:
//
// - Notification Delivery identity;
// - Notification Delivery public identity;
// - owning Notification identity;
// - delivery channel;
// - delivery status;
// - optional provider reference;
// - delivery lifecycle timestamps;
// - optional failure information;
// - delivery audit timestamps.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain delivery identity;
// - maintain delivery public identity;
// - maintain owning Notification identity;
// - maintain delivery channel;
// - maintain delivery status;
// - maintain optional provider reference;
// - manage delivery lifecycle;
// - manage provider delivery information;
// - enforce delivery-level invariants;
// - provide lifecycle-safe predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - create Notifications;
// - create other deliveries;
// - validate Notification recipient identity;
// - load Notification aggregates;
// - access Identity aggregates;
// - communicate with Push providers;
// - communicate with Email providers;
// - communicate with SMS providers;
// - access Prisma;
// - persist itself;
// - access repositories;
// - perform authorization checks.
//
// Delivery provider communication belongs to the application/integration
// infrastructure layer.
//
// Notification-level coordination belongs to NotificationAggregate.
//
// Persistence belongs to infrastructure.
//
// -----------------------------------------------------------------------------
//
// Delivery lifecycle:
//
// PENDING
//    ├──> SENT ──> DELIVERED
//    ├──> FAILED
//    └──> CANCELLED
//
// SENT, DELIVERED, FAILED, and CANCELLED are terminal delivery states.
//
// A delivery cannot be sent again after it has been sent, delivered,
// failed, or cancelled.
//
// A delivery cannot be marked DELIVERED unless it has first been SENT.
//
// -----------------------------------------------------------------------------
//
// Channel:
//
// Each Notification may have at most one delivery per channel.
//
// Supported channels:
//
// - IN_APP
// - PUSH
// - EMAIL
// - SMS
//
// The aggregate enforces duplicate-channel protection.
//
// Persistence additionally enforces:
//
// @@unique([notificationId, channel])
//
// -----------------------------------------------------------------------------
//
// Provider reference:
//
// providerReference is optional while a delivery is PENDING.
//
// Once a provider accepts a delivery, the provider reference may be recorded.
//
// Notification does not interpret the provider reference.
//
// It is opaque provider metadata.
//
// -----------------------------------------------------------------------------
//
// Failure:
//
// FAILED deliveries require a failure reason.
//
// Failure reason is stored as plain text because it represents provider or
// infrastructure failure information rather than a domain-specific concept.
//
// -----------------------------------------------------------------------------
//
// Persistence mapping:
//
// Prisma:
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
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from '../exceptions/notification.exception';

import { NotificationDeliveryInvalidStatusException } from '../exceptions/notification-delivery-invalid-status.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { NotificationChannel } from '../value-objects/notification-channel.vo';

import { NotificationDeliveryStatus } from '../value-objects/notification-delivery-status.vo';

import { NotificationDeliveryPublicId } from '../value-objects/notification-delivery-public-id.vo';

import type { NotificationProviderReference } from '../value-objects/notification-provider-reference.vo';

// =============================================================================
// Props
// =============================================================================

export interface NotificationDeliveryProps {
  /**
   * Internal identity of the Notification aggregate that owns this delivery.
   *
   * This corresponds to NotificationDelivery.notificationId in persistence.
   */
  notificationId: UniqueEntityId;

  /**
   * Delivery channel.
   *
   * A Notification may have at most one delivery for each channel.
   */
  channel: NotificationChannel;

  /**
   * Delivery lifecycle status.
   */
  status: NotificationDeliveryStatus;

  /**
   * Optional provider-specific delivery reference.
   *
   * This is opaque metadata owned by the provider integration.
   */
  providerReference: NotificationProviderReference | undefined;

  /**
   * Timestamp when the delivery was sent to the provider/channel.
   */
  sentAt: Date | undefined;

  /**
   * Timestamp when the delivery was confirmed as delivered.
   */
  deliveredAt: Date | undefined;

  /**
   * Timestamp when delivery failed.
   */
  failedAt: Date | undefined;

  /**
   * Timestamp when delivery was cancelled.
   */
  cancelledAt: Date | undefined;

  /**
   * Optional delivery failure reason.
   */
  failureReason: string | undefined;

  /**
   * Delivery creation timestamp.
   */
  createdAt: Date;

  /**
   * Delivery last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class NotificationDeliveryEntity extends Entity<
  NotificationDeliveryProps,
  NotificationDeliveryPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: NotificationDeliveryProps,
    id?: UniqueEntityId,
    publicId?: NotificationDeliveryPublicId,
  ) {
    super(props, id, publicId);

    this.validateInvariants();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Notification Delivery entity.
   *
   * Newly created deliveries begin in PENDING state.
   *
   * The owning Notification aggregate is responsible for adding the delivery
   * and enforcing the one-delivery-per-channel invariant.
   */
  public static create(
    notificationId: UniqueEntityId,
    channel: NotificationChannel,
    createdAt: Date = new Date(),
  ): NotificationDeliveryEntity {
    NotificationDeliveryEntity.ensureNotificationId(notificationId);

    NotificationDeliveryEntity.ensureChannel(channel);

    NotificationDeliveryEntity.ensureStatus(
      NotificationDeliveryStatus.pending(),
    );

    NotificationDeliveryEntity.ensureValidDate(createdAt, 'creation date');

    const timestamp = NotificationDeliveryEntity.cloneDate(createdAt);

    const entity = new NotificationDeliveryEntity(
      {
        notificationId,

        channel,

        status: NotificationDeliveryStatus.pending(),

        providerReference: undefined,

        sentAt: undefined,

        deliveredAt: undefined,

        failedAt: undefined,

        cancelledAt: undefined,

        failureReason: undefined,

        createdAt: NotificationDeliveryEntity.cloneDate(timestamp),

        updatedAt: NotificationDeliveryEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new NotificationDeliveryPublicId(),
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Notification Delivery entity.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    props: NotificationDeliveryProps,
    id: UniqueEntityId,
    publicId: NotificationDeliveryPublicId,
  ): NotificationDeliveryEntity {
    if (props === undefined) {
      throw new NotificationException(
        'Notification delivery properties are required for rehydration.',
      );
    }

    NotificationDeliveryEntity.ensureInternalId(id);

    if (publicId === undefined) {
      throw new NotificationException(
        'Notification delivery public identity is required for rehydration.',
      );
    }

    NotificationDeliveryEntity.ensureNotificationId(props.notificationId);

    NotificationDeliveryEntity.ensureChannel(props.channel);

    NotificationDeliveryEntity.ensureStatus(props.status);

    NotificationDeliveryEntity.ensureOptionalProviderReference(
      props.providerReference,
    );

    NotificationDeliveryEntity.ensureOptionalDate(props.sentAt, 'sent date');

    NotificationDeliveryEntity.ensureOptionalDate(
      props.deliveredAt,
      'delivered date',
    );

    NotificationDeliveryEntity.ensureOptionalDate(
      props.failedAt,
      'failed date',
    );

    NotificationDeliveryEntity.ensureOptionalDate(
      props.cancelledAt,
      'cancelled date',
    );

    NotificationDeliveryEntity.ensureOptionalFailureReason(props.failureReason);

    NotificationDeliveryEntity.ensureValidDate(
      props.createdAt,
      'creation date',
    );

    NotificationDeliveryEntity.ensureValidDate(props.updatedAt, 'updated date');

    const entity = new NotificationDeliveryEntity(
      {
        notificationId: props.notificationId,

        channel: props.channel,

        status: props.status,

        providerReference: props.providerReference,

        sentAt:
          props.sentAt !== undefined
            ? NotificationDeliveryEntity.cloneDate(props.sentAt)
            : undefined,

        deliveredAt:
          props.deliveredAt !== undefined
            ? NotificationDeliveryEntity.cloneDate(props.deliveredAt)
            : undefined,

        failedAt:
          props.failedAt !== undefined
            ? NotificationDeliveryEntity.cloneDate(props.failedAt)
            : undefined,

        cancelledAt:
          props.cancelledAt !== undefined
            ? NotificationDeliveryEntity.cloneDate(props.cancelledAt)
            : undefined,

        failureReason:
          props.failureReason !== undefined
            ? NotificationDeliveryEntity.normalizeFailureReason(
                props.failureReason,
              )
            : undefined,

        createdAt: NotificationDeliveryEntity.cloneDate(props.createdAt),

        updatedAt: NotificationDeliveryEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Notification Delivery.
   */
  public override get publicId(): NotificationDeliveryPublicId {
    return super.publicId;
  }

  /**
   * Internal identity of the Notification Delivery.
   */
  public override get id(): UniqueEntityId {
    return super.id;
  }

  // ===========================================================================
  // Notification
  // ===========================================================================

  /**
   * Internal identity of the owning Notification aggregate.
   */
  public get notificationId(): UniqueEntityId {
    return this.props.notificationId;
  }

  /**
   * Determines whether this delivery belongs to the supplied Notification.
   */
  public belongsToNotification(notificationId: UniqueEntityId): boolean {
    if (notificationId === undefined) {
      return false;
    }

    return this.props.notificationId.equals(notificationId);
  }

  // ===========================================================================
  // Channel
  // ===========================================================================

  /**
   * Current delivery channel.
   */
  public get channel(): NotificationChannel {
    return this.props.channel;
  }

  /**
   * Determines whether this is an in-app delivery.
   */
  public isInApp(): boolean {
    return this.props.channel.isInApp();
  }

  /**
   * Determines whether this is a push delivery.
   */
  public isPush(): boolean {
    return this.props.channel.isPush();
  }

  /**
   * Determines whether this is an email delivery.
   */
  public isEmail(): boolean {
    return this.props.channel.isEmail();
  }

  /**
   * Determines whether this is an SMS delivery.
   */
  public isSms(): boolean {
    return this.props.channel.isSms();
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current delivery lifecycle status.
   */
  public get status(): NotificationDeliveryStatus {
    return this.props.status;
  }

  /**
   * Determines whether the delivery is pending.
   */
  public isPending(): boolean {
    return this.props.status.isPending();
  }

  /**
   * Determines whether the delivery has been sent.
   */
  public isSent(): boolean {
    return this.props.status.isSent();
  }

  /**
   * Determines whether the delivery has been delivered.
   */
  public isDelivered(): boolean {
    return this.props.status.isDelivered();
  }

  /**
   * Determines whether the delivery has failed.
   */
  public isFailed(): boolean {
    return this.props.status.isFailed();
  }

  /**
   * Determines whether the delivery has been cancelled.
   */
  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  /**
   * Determines whether the delivery is terminal.
   */
  public isTerminal(): boolean {
    return this.isDelivered() || this.isFailed() || this.isCancelled();
  }

  /**
   * Determines whether the delivery can be sent.
   */
  public canBeSent(): boolean {
    return this.isPending();
  }

  /**
   * Determines whether the delivery can be marked as delivered.
   */
  public canBeDelivered(): boolean {
    return this.isSent();
  }

  /**
   * Determines whether the delivery can fail.
   */
  public canBeFailed(): boolean {
    return this.isPending();
  }

  /**
   * Determines whether the delivery can be cancelled.
   */
  public canBeCancelled(): boolean {
    return this.isPending();
  }

  // ===========================================================================
  // Provider Reference
  // ===========================================================================

  /**
   * Optional provider-specific delivery reference.
   */
  public get providerReference(): NotificationProviderReference | undefined {
    return this.props.providerReference;
  }

  /**
   * Determines whether the delivery has a provider reference.
   */
  public hasProviderReference(): boolean {
    return this.props.providerReference !== undefined;
  }

  /**
   * Records the provider-specific delivery reference.
   *
   * The reference is opaque to the Notification domain.
   *
   * It can only be changed while the delivery is PENDING.
   */
  public assignProviderReference(
    providerReference: NotificationProviderReference,
  ): void {
    if (!this.isPending()) {
      throw new NotificationDeliveryInvalidStatusException(
        'Provider reference can only be assigned to a pending notification delivery.',
      );
    }

    NotificationDeliveryEntity.ensureProviderReference(providerReference);

    if (this.props.providerReference?.equals(providerReference) === true) {
      return;
    }

    this.props.providerReference = providerReference;

    this.touch();

    this.validateInvariants();
  }

  // ===========================================================================
  // Failure Information
  // ===========================================================================

  /**
   * Optional delivery failure reason.
   */
  public get failureReason(): string | undefined {
    return this.props.failureReason;
  }

  /**
   * Determines whether the delivery contains a failure reason.
   */
  public hasFailureReason(): boolean {
    return this.props.failureReason !== undefined;
  }

  // ===========================================================================
  // Lifecycle — Send
  // ===========================================================================

  /**
   * Marks the delivery as SENT.
   *
   * Only PENDING deliveries can be sent.
   */
  public send(sentAt: Date = new Date()): void {
    if (!this.isPending()) {
      throw new NotificationDeliveryInvalidStatusException(
        'Only a pending notification delivery can be sent.',
      );
    }

    NotificationDeliveryEntity.ensureValidDate(sentAt, 'sent date');

    if (sentAt.getTime() < this.props.createdAt.getTime()) {
      throw new NotificationDeliveryInvalidStatusException(
        'Notification delivery sent date cannot be before creation date.',
      );
    }

    this.props.status = NotificationDeliveryStatus.sent();

    this.props.sentAt = NotificationDeliveryEntity.cloneDate(sentAt);

    this.touch(sentAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Lifecycle — Deliver
  // ===========================================================================

  /**
   * Marks the delivery as DELIVERED.
   *
   * A delivery must first be SENT.
   */
  public deliver(deliveredAt: Date = new Date()): void {
    if (!this.isSent()) {
      throw new NotificationDeliveryInvalidStatusException(
        'Only a sent notification delivery can be marked as delivered.',
      );
    }

    NotificationDeliveryEntity.ensureValidDate(deliveredAt, 'delivered date');

    if (this.props.sentAt === undefined) {
      throw new NotificationException(
        'A sent notification delivery must have a sent date.',
      );
    }

    if (deliveredAt.getTime() < this.props.sentAt.getTime()) {
      throw new NotificationDeliveryInvalidStatusException(
        'Notification delivery delivered date cannot be before sent date.',
      );
    }

    this.props.status = NotificationDeliveryStatus.delivered();

    this.props.deliveredAt = NotificationDeliveryEntity.cloneDate(deliveredAt);

    this.touch(deliveredAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Lifecycle — Fail
  // ===========================================================================

  /**
   * Marks the delivery as FAILED.
   *
   * Only PENDING deliveries can transition directly to FAILED.
   */
  public fail(failureReason: string, failedAt: Date = new Date()): void {
    if (!this.isPending()) {
      throw new NotificationDeliveryInvalidStatusException(
        'Only a pending notification delivery can fail.',
      );
    }

    NotificationDeliveryEntity.ensureFailureReason(failureReason);

    NotificationDeliveryEntity.ensureValidDate(failedAt, 'failed date');

    if (failedAt.getTime() < this.props.createdAt.getTime()) {
      throw new NotificationDeliveryInvalidStatusException(
        'Notification delivery failed date cannot be before creation date.',
      );
    }

    this.props.status = NotificationDeliveryStatus.failed();

    this.props.failedAt = NotificationDeliveryEntity.cloneDate(failedAt);

    this.props.failureReason =
      NotificationDeliveryEntity.normalizeFailureReason(failureReason);

    this.touch(failedAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Lifecycle — Cancel
  // ===========================================================================

  /**
   * Cancels the delivery.
   *
   * Only PENDING deliveries can be cancelled.
   */
  public cancel(cancelledAt: Date = new Date()): void {
    if (!this.isPending()) {
      throw new NotificationDeliveryInvalidStatusException(
        'Only a pending notification delivery can be cancelled.',
      );
    }

    NotificationDeliveryEntity.ensureValidDate(cancelledAt, 'cancelled date');

    if (cancelledAt.getTime() < this.props.createdAt.getTime()) {
      throw new NotificationDeliveryInvalidStatusException(
        'Notification delivery cancelled date cannot be before creation date.',
      );
    }

    this.props.status = NotificationDeliveryStatus.cancelled();

    this.props.cancelledAt = NotificationDeliveryEntity.cloneDate(cancelledAt);

    this.touch(cancelledAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Lifecycle Timestamps
  // ===========================================================================

  /**
   * Delivery sent timestamp.
   */
  public get sentAt(): Date | undefined {
    return this.props.sentAt !== undefined
      ? NotificationDeliveryEntity.cloneDate(this.props.sentAt)
      : undefined;
  }

  /**
   * Delivery delivered timestamp.
   */
  public get deliveredAt(): Date | undefined {
    return this.props.deliveredAt !== undefined
      ? NotificationDeliveryEntity.cloneDate(this.props.deliveredAt)
      : undefined;
  }

  /**
   * Delivery failed timestamp.
   */
  public get failedAt(): Date | undefined {
    return this.props.failedAt !== undefined
      ? NotificationDeliveryEntity.cloneDate(this.props.failedAt)
      : undefined;
  }

  /**
   * Delivery cancelled timestamp.
   */
  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt !== undefined
      ? NotificationDeliveryEntity.cloneDate(this.props.cancelledAt)
      : undefined;
  }

  /**
   * Delivery creation timestamp.
   */
  public get createdAt(): Date {
    return NotificationDeliveryEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Delivery last-update timestamp.
   */
  public get updatedAt(): Date {
    return NotificationDeliveryEntity.cloneDate(this.props.updatedAt);
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp.
   *
   * This is not a business lifecycle transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    NotificationDeliveryEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = NotificationDeliveryEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new NotificationException(
        'Notification delivery updated date cannot be before creation date.',
      );
    }

    if (timestamp.getTime() < this.props.updatedAt.getTime()) {
      throw new NotificationException(
        'Notification delivery updated date cannot move backwards.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Invariants
  // ===========================================================================

  /**
   * Validates all Notification Delivery entity-level invariants.
   */
  private validateInvariants(): void {
    NotificationDeliveryEntity.ensureNotificationId(this.props.notificationId);

    NotificationDeliveryEntity.ensureChannel(this.props.channel);

    NotificationDeliveryEntity.ensureStatus(this.props.status);

    NotificationDeliveryEntity.ensureOptionalProviderReference(
      this.props.providerReference,
    );

    NotificationDeliveryEntity.ensureOptionalDate(
      this.props.sentAt,
      'sent date',
    );

    NotificationDeliveryEntity.ensureOptionalDate(
      this.props.deliveredAt,
      'delivered date',
    );

    NotificationDeliveryEntity.ensureOptionalDate(
      this.props.failedAt,
      'failed date',
    );

    NotificationDeliveryEntity.ensureOptionalDate(
      this.props.cancelledAt,
      'cancelled date',
    );

    NotificationDeliveryEntity.ensureOptionalFailureReason(
      this.props.failureReason,
    );

    NotificationDeliveryEntity.ensureValidDate(
      this.props.createdAt,
      'creation date',
    );

    NotificationDeliveryEntity.ensureValidDate(
      this.props.updatedAt,
      'updated date',
    );

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new NotificationException(
        'Notification delivery updated date cannot be before creation date.',
      );
    }

    NotificationDeliveryEntity.ensureLifecycleTimestamps(this.props);
  }

  // ===========================================================================
  // Identity Guards
  // ===========================================================================

  private static ensureInternalId(id: UniqueEntityId): void {
    if (!(id instanceof UniqueEntityId)) {
      throw new NotificationException(
        'Notification delivery internal identity must be a valid entity identity.',
      );
    }
  }

  // ===========================================================================
  // Notification Guards
  // ===========================================================================

  private static ensureNotificationId(notificationId: UniqueEntityId): void {
    if (!(notificationId instanceof UniqueEntityId)) {
      throw new NotificationException(
        'Notification delivery notification identity must be a valid entity identity.',
      );
    }
  }

  // ===========================================================================
  // Channel Guards
  // ===========================================================================

  private static ensureChannel(channel: NotificationChannel): void {
    if (channel === undefined) {
      throw new NotificationException(
        'Notification delivery channel is required.',
      );
    }
  }

  // ===========================================================================
  // Status Guards
  // ===========================================================================

  private static ensureStatus(status: NotificationDeliveryStatus): void {
    if (status === undefined) {
      throw new NotificationException(
        'Notification delivery status is required.',
      );
    }
  }

  // ===========================================================================
  // Provider Reference Guards
  // ===========================================================================

  private static ensureProviderReference(
    providerReference: NotificationProviderReference,
  ): void {
    if (providerReference === undefined) {
      throw new NotificationException(
        'Notification delivery provider reference is required.',
      );
    }
  }

  private static ensureOptionalProviderReference(
    providerReference: NotificationProviderReference | undefined,
  ): void {
    if (providerReference === undefined) {
      return;
    }

    NotificationDeliveryEntity.ensureProviderReference(providerReference);
  }

  // ===========================================================================
  // Failure Guards
  // ===========================================================================

  private static ensureFailureReason(failureReason: string): void {
    if (typeof failureReason !== 'string') {
      throw new NotificationException(
        'Notification delivery failure reason must be a string.',
      );
    }

    if (failureReason.trim().length === 0) {
      throw new NotificationException(
        'Notification delivery failure reason cannot be empty.',
      );
    }
  }

  private static ensureOptionalFailureReason(
    failureReason: string | undefined,
  ): void {
    if (failureReason === undefined) {
      return;
    }

    NotificationDeliveryEntity.ensureFailureReason(failureReason);
  }

  private static normalizeFailureReason(failureReason: string): string {
    NotificationDeliveryEntity.ensureFailureReason(failureReason);

    return failureReason.trim();
  }

  // ===========================================================================
  // Lifecycle Timestamp Guards
  // ===========================================================================

  private static ensureLifecycleTimestamps(
    props: NotificationDeliveryProps,
  ): void {
    // -------------------------------------------------------------------------
    // sentAt
    // -------------------------------------------------------------------------

    if (props.sentAt !== undefined) {
      if (props.sentAt.getTime() < props.createdAt.getTime()) {
        throw new NotificationException(
          'Notification delivery sent date cannot be before creation date.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // deliveredAt
    // -------------------------------------------------------------------------

    if (props.deliveredAt !== undefined) {
      if (props.sentAt === undefined) {
        throw new NotificationException(
          'Notification delivery delivered date requires a sent date.',
        );
      }

      if (props.deliveredAt.getTime() < props.sentAt.getTime()) {
        throw new NotificationException(
          'Notification delivery delivered date cannot be before sent date.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // failedAt
    // -------------------------------------------------------------------------

    if (props.failedAt !== undefined) {
      if (props.failedAt.getTime() < props.createdAt.getTime()) {
        throw new NotificationException(
          'Notification delivery failed date cannot be before creation date.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // cancelledAt
    // -------------------------------------------------------------------------

    if (props.cancelledAt !== undefined) {
      if (props.cancelledAt.getTime() < props.createdAt.getTime()) {
        throw new NotificationException(
          'Notification delivery cancelled date cannot be before creation date.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Failure reason consistency
    // -------------------------------------------------------------------------

    if (props.status.isFailed() && props.failureReason === undefined) {
      throw new NotificationException(
        'A FAILED notification delivery must have a failure reason.',
      );
    }

    if (!props.status.isFailed() && props.failureReason !== undefined) {
      throw new NotificationException(
        'Only a FAILED notification delivery may contain a failure reason.',
      );
    }

    // -------------------------------------------------------------------------
    // Status ↔ timestamp consistency
    // -------------------------------------------------------------------------

    if (props.status.isPending()) {
      if (props.sentAt !== undefined) {
        throw new NotificationException(
          'A PENDING notification delivery cannot have a sent date.',
        );
      }

      if (props.deliveredAt !== undefined) {
        throw new NotificationException(
          'A PENDING notification delivery cannot have a delivered date.',
        );
      }

      if (props.failedAt !== undefined) {
        throw new NotificationException(
          'A PENDING notification delivery cannot have a failed date.',
        );
      }

      if (props.cancelledAt !== undefined) {
        throw new NotificationException(
          'A PENDING notification delivery cannot have a cancelled date.',
        );
      }

      return;
    }

    if (props.status.isSent()) {
      if (props.sentAt === undefined) {
        throw new NotificationException(
          'A SENT notification delivery must have a sent date.',
        );
      }

      if (props.deliveredAt !== undefined) {
        throw new NotificationException(
          'A SENT notification delivery cannot have a delivered date.',
        );
      }

      if (props.failedAt !== undefined) {
        throw new NotificationException(
          'A SENT notification delivery cannot have a failed date.',
        );
      }

      if (props.cancelledAt !== undefined) {
        throw new NotificationException(
          'A SENT notification delivery cannot have a cancelled date.',
        );
      }

      return;
    }

    if (props.status.isDelivered()) {
      if (props.sentAt === undefined) {
        throw new NotificationException(
          'A DELIVERED notification delivery must have a sent date.',
        );
      }

      if (props.deliveredAt === undefined) {
        throw new NotificationException(
          'A DELIVERED notification delivery must have a delivered date.',
        );
      }

      if (props.failedAt !== undefined) {
        throw new NotificationException(
          'A DELIVERED notification delivery cannot have a failed date.',
        );
      }

      if (props.cancelledAt !== undefined) {
        throw new NotificationException(
          'A DELIVERED notification delivery cannot have a cancelled date.',
        );
      }

      return;
    }

    if (props.status.isFailed()) {
      if (props.failedAt === undefined) {
        throw new NotificationException(
          'A FAILED notification delivery must have a failed date.',
        );
      }

      if (props.deliveredAt !== undefined) {
        throw new NotificationException(
          'A FAILED notification delivery cannot have a delivered date.',
        );
      }

      if (props.cancelledAt !== undefined) {
        throw new NotificationException(
          'A FAILED notification delivery cannot have a cancelled date.',
        );
      }

      return;
    }

    if (props.status.isCancelled()) {
      if (props.cancelledAt === undefined) {
        throw new NotificationException(
          'A CANCELLED notification delivery must have a cancelled date.',
        );
      }

      if (props.deliveredAt !== undefined) {
        throw new NotificationException(
          'A CANCELLED notification delivery cannot have a delivered date.',
        );
      }

      if (props.failedAt !== undefined) {
        throw new NotificationException(
          'A CANCELLED notification delivery cannot have a failed date.',
        );
      }

      return;
    }

    throw new NotificationException(
      'Notification delivery lifecycle status is invalid.',
    );
  }

  // ===========================================================================
  // Date Guards
  // ===========================================================================

  /**
   * Validates a required Date.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new NotificationException(
        `Notification delivery ${fieldName} must be a valid date.`,
      );
    }
  }

  /**
   * Validates an optional Date.
   */
  private static ensureOptionalDate(
    value: Date | undefined,
    fieldName: string,
  ): void {
    if (value === undefined) {
      return;
    }

    NotificationDeliveryEntity.ensureValidDate(value, fieldName);
  }

  // ===========================================================================
  // Date Clone
  // ===========================================================================

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    NotificationDeliveryEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
