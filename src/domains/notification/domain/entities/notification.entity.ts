// -----------------------------------------------------------------------------
// Notification — Entity
// -----------------------------------------------------------------------------
//
// Represents a notification within the Notification domain.
//
// Aggregate context:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// The Notification entity is the authoritative owner of:
//
// - Notification identity;
// - Notification public identity;
// - recipient public identity;
// - notification type;
// - notification priority;
// - notification status;
// - notification title;
// - notification body;
// - optional domain reference;
// - optional source event reference;
// - notification lifecycle;
// - notification lifecycle timestamps;
// - notification failure information.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain notification identity;
// - maintain notification public identity;
// - maintain recipient public identity;
// - maintain notification type;
// - maintain notification priority;
// - maintain notification status;
// - maintain notification title;
// - maintain notification body;
// - maintain optional reference metadata;
// - maintain optional source-event metadata;
// - manage notification lifecycle;
// - enforce notification-level invariants;
// - provide lifecycle-safe predicates;
// - maintain notification audit timestamps.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - create notification deliveries;
// - send through Push providers;
// - send through Email providers;
// - send through SMS providers;
// - communicate with external notification providers;
// - resolve Identity aggregates;
// - resolve Journey aggregates;
// - resolve Booking aggregates;
// - resolve Financial aggregates;
// - resolve Support aggregates;
// - access Prisma;
// - persist itself;
// - access repositories;
// - perform external API calls;
// - perform authorization checks.
//
// Delivery-channel behavior belongs to NotificationDeliveryEntity and the
// Notification aggregate/application workflow.
//
// Cross-domain orchestration belongs to the application/integration layers.
//
// Persistence belongs to infrastructure.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// recipientPublicId references Identity.publicId.
//
// referenceType + referencePublicId identify an optional domain resource
// associated with this notification.
//
// eventType + eventPublicId identify an optional source event that caused
// this notification.
//
// These are opaque cross-domain references.
//
// Notification does not load, validate, own, or mutate the referenced
// aggregates or events.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
// PENDING
//    ├──> SENT ──> READ
//    ├──> FAILED
//    └──> CANCELLED
//
// READ, FAILED, and CANCELLED are terminal notification states.
//
// A notification cannot be sent again after it has been sent, read,
// failed, or cancelled.
//
// A notification cannot be read unless it has first been sent.
//
// A failed or cancelled notification cannot be sent or read.
//
// -----------------------------------------------------------------------------
//
// Persistence mapping:
//
// Prisma:
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
// Notification deliveries are persisted through the owning aggregate
// persistence workflow.
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

import { NotificationInvalidStatusException } from '../exceptions/notification-invalid-status.exception';

import { NotificationTitleEmptyException } from '../exceptions/notification-title-empty.exception';

import { NotificationBodyEmptyException } from '../exceptions/notification-body-empty.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { NotificationMemberPublicId } from '../value-objects/notification-member-public-id.vo';

import type { NotificationType } from '../value-objects/notification-type.vo';

import type { NotificationPriority } from '../value-objects/notification-priority.vo';

import { NotificationStatus } from '../value-objects/notification-status.vo';

import type { NotificationTitle } from '../value-objects/notification-title.vo';

import type { NotificationBody } from '../value-objects/notification-body.vo';

import { NotificationPublicId } from '../value-objects/notification-public-id.vo';

import type { NotificationReferenceType } from '../value-objects/notification-reference-type.vo';

import type { NotificationReferencePublicId } from '../value-objects/notification-reference-public-id.vo';

import type { NotificationEventType } from '../value-objects/notification-event-type.vo';

import type { NotificationEventPublicId } from '../value-objects/notification-event-public-id.vo';

// =============================================================================
// Props
// =============================================================================

export interface NotificationProps {
  /**
   * Public identity of the Identity-domain member who receives
   * this notification.
   */
  recipientPublicId: NotificationMemberPublicId;

  /**
   * Notification business type.
   */
  type: NotificationType;

  /**
   * Notification priority.
   */
  priority: NotificationPriority;

  /**
   * Notification lifecycle status.
   */
  status: NotificationStatus;

  /**
   * Notification title.
   */
  title: NotificationTitle;

  /**
   * Notification body.
   */
  body: NotificationBody;

  /**
   * Optional type of the domain resource associated with this notification.
   *
   * This is an opaque cross-domain reference.
   */
  referenceType: NotificationReferenceType | undefined;

  /**
   * Optional public identity of the domain resource associated with
   * this notification.
   *
   * This is an opaque cross-domain reference.
   */
  referencePublicId: NotificationReferencePublicId | undefined;

  /**
   * Optional type of the source event that caused this notification.
   *
   * This is an opaque cross-domain event reference.
   */
  eventType: NotificationEventType | undefined;

  /**
   * Optional public identity of the source event that caused this
   * notification.
   *
   * This is an opaque cross-domain event reference.
   */
  eventPublicId: NotificationEventPublicId | undefined;

  /**
   * Timestamp when the notification was sent.
   */
  sentAt: Date | undefined;

  /**
   * Timestamp when the notification was read.
   */
  readAt: Date | undefined;

  /**
   * Timestamp when notification processing failed.
   */
  failedAt: Date | undefined;

  /**
   * Timestamp when the notification was cancelled.
   */
  cancelledAt: Date | undefined;

  /**
   * Optional human-readable failure reason.
   */
  failureReason: string | undefined;

  /**
   * Notification creation timestamp.
   */
  createdAt: Date;

  /**
   * Notification last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class NotificationEntity extends Entity<
  NotificationProps,
  NotificationPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: NotificationProps,
    id?: UniqueEntityId,
    publicId?: NotificationPublicId,
  ) {
    super(props, id, publicId);

    this.validateInvariants();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Notification entity.
   *
   * Newly created notifications begin in PENDING state.
   *
   * Notification delivery is intentionally not created here.
   * Deliveries are child entities owned by NotificationAggregate.
   */
  public static create(
    recipientPublicId: NotificationMemberPublicId,
    type: NotificationType,
    priority: NotificationPriority,
    title: NotificationTitle,
    body: NotificationBody,
    referenceType: NotificationReferenceType | undefined = undefined,
    referencePublicId: NotificationReferencePublicId | undefined = undefined,
    eventType: NotificationEventType | undefined = undefined,
    eventPublicId: NotificationEventPublicId | undefined = undefined,
    createdAt: Date = new Date(),
  ): NotificationEntity {
    NotificationEntity.ensureRecipientPublicId(recipientPublicId);

    NotificationEntity.ensureType(type);

    NotificationEntity.ensurePriority(priority);

    NotificationEntity.ensureStatus(NotificationStatus.pending());

    NotificationEntity.ensureTitle(title);

    NotificationEntity.ensureBody(body);

    NotificationEntity.ensureOptionalReferenceType(referenceType);

    NotificationEntity.ensureOptionalReferencePublicId(referencePublicId);

    NotificationEntity.ensureOptionalEventType(eventType);

    NotificationEntity.ensureOptionalEventPublicId(eventPublicId);

    NotificationEntity.ensureReferencePair(referenceType, referencePublicId);

    NotificationEntity.ensureEventPair(eventType, eventPublicId);

    NotificationEntity.ensureValidDate(createdAt, 'creation date');

    const timestamp = NotificationEntity.cloneDate(createdAt);

    const entity = new NotificationEntity(
      {
        recipientPublicId,

        type,

        priority,

        status: NotificationStatus.pending(),

        title,

        body,

        referenceType,

        referencePublicId,

        eventType,

        eventPublicId,

        sentAt: undefined,

        readAt: undefined,

        failedAt: undefined,

        cancelledAt: undefined,

        failureReason: undefined,

        createdAt: NotificationEntity.cloneDate(timestamp),

        updatedAt: NotificationEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new NotificationPublicId(),
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Notification entity.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    props: NotificationProps,
    id: UniqueEntityId,
    publicId: NotificationPublicId,
  ): NotificationEntity {
    if (props === undefined) {
      throw new NotificationException(
        'Notification properties are required for rehydration.',
      );
    }

    NotificationEntity.ensureInternalId(id);

    if (publicId === undefined) {
      throw new NotificationException(
        'Notification public identity is required for rehydration.',
      );
    }

    NotificationEntity.ensureRecipientPublicId(props.recipientPublicId);

    NotificationEntity.ensureType(props.type);

    NotificationEntity.ensurePriority(props.priority);

    NotificationEntity.ensureStatus(props.status);

    NotificationEntity.ensureTitle(props.title);

    NotificationEntity.ensureBody(props.body);

    NotificationEntity.ensureOptionalReferenceType(props.referenceType);

    NotificationEntity.ensureOptionalReferencePublicId(props.referencePublicId);

    NotificationEntity.ensureOptionalEventType(props.eventType);

    NotificationEntity.ensureOptionalEventPublicId(props.eventPublicId);

    NotificationEntity.ensureReferencePair(
      props.referenceType,
      props.referencePublicId,
    );

    NotificationEntity.ensureEventPair(props.eventType, props.eventPublicId);

    NotificationEntity.ensureOptionalDate(props.sentAt, 'sent date');

    NotificationEntity.ensureOptionalDate(props.readAt, 'read date');

    NotificationEntity.ensureOptionalDate(props.failedAt, 'failed date');

    NotificationEntity.ensureOptionalDate(props.cancelledAt, 'cancelled date');

    NotificationEntity.ensureOptionalFailureReason(props.failureReason);

    NotificationEntity.ensureValidDate(props.createdAt, 'creation date');

    NotificationEntity.ensureValidDate(props.updatedAt, 'updated date');

    const entity = new NotificationEntity(
      {
        recipientPublicId: props.recipientPublicId,

        type: props.type,

        priority: props.priority,

        status: props.status,

        title: props.title,

        body: props.body,

        referenceType: props.referenceType,

        referencePublicId: props.referencePublicId,

        eventType: props.eventType,

        eventPublicId: props.eventPublicId,

        sentAt:
          props.sentAt !== undefined
            ? NotificationEntity.cloneDate(props.sentAt)
            : undefined,

        readAt:
          props.readAt !== undefined
            ? NotificationEntity.cloneDate(props.readAt)
            : undefined,

        failedAt:
          props.failedAt !== undefined
            ? NotificationEntity.cloneDate(props.failedAt)
            : undefined,

        cancelledAt:
          props.cancelledAt !== undefined
            ? NotificationEntity.cloneDate(props.cancelledAt)
            : undefined,

        failureReason:
          props.failureReason !== undefined
            ? NotificationEntity.normalizeFailureReason(props.failureReason)
            : undefined,

        createdAt: NotificationEntity.cloneDate(props.createdAt),

        updatedAt: NotificationEntity.cloneDate(props.updatedAt),
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
   * Public identity of the Notification.
   */
  public override get publicId(): NotificationPublicId {
    return super.publicId;
  }

  /**
   * Internal identity of the Notification.
   */
  public override get id(): UniqueEntityId {
    return super.id;
  }

  // ===========================================================================
  // Recipient
  // ===========================================================================

  /**
   * Public identity of the member receiving the notification.
   */
  public get recipientPublicId(): NotificationMemberPublicId {
    return this.props.recipientPublicId;
  }

  /**
   * Determines whether this notification belongs to the supplied member.
   */
  public belongsToRecipient(
    memberPublicId: NotificationMemberPublicId,
  ): boolean {
    if (memberPublicId === undefined) {
      return false;
    }

    return this.props.recipientPublicId.equals(memberPublicId);
  }

  // ===========================================================================
  // Notification Type
  // ===========================================================================

  /**
   * Current notification type.
   */
  public get type(): NotificationType {
    return this.props.type;
  }

  /**
   * Determines whether this is a Journey notification.
   */
  public isJourney(): boolean {
    return this.props.type.isJourney();
  }

  /**
   * Determines whether this is a Booking notification.
   */
  public isBooking(): boolean {
    return this.props.type.isBooking();
  }

  /**
   * Determines whether this is a Payment notification.
   */
  public isPayment(): boolean {
    return this.props.type.isPayment();
  }

  /**
   * Determines whether this is a Wallet notification.
   */
  public isWallet(): boolean {
    return this.props.type.isWallet();
  }

  /**
   * Determines whether this is a Trust notification.
   */
  public isTrust(): boolean {
    return this.props.type.isTrust();
  }

  /**
   * Determines whether this is a Verification notification.
   */
  public isVerification(): boolean {
    return this.props.type.isVerification();
  }

  /**
   * Determines whether this is a Message notification.
   */
  public isMessage(): boolean {
    return this.props.type.isMessage();
  }

  /**
   * Determines whether this is a Support notification.
   */
  public isSupport(): boolean {
    return this.props.type.isSupport();
  }

  /**
   * Determines whether this is a System notification.
   */
  public isSystem(): boolean {
    return this.props.type.isSystem();
  }

  // ===========================================================================
  // Priority
  // ===========================================================================

  /**
   * Current notification priority.
   */
  public get priority(): NotificationPriority {
    return this.props.priority;
  }

  /**
   * Determines whether this notification has LOW priority.
   */
  public isLowPriority(): boolean {
    return this.props.priority.isLow();
  }

  /**
   * Determines whether this notification has NORMAL priority.
   */
  public isNormalPriority(): boolean {
    return this.props.priority.isNormal();
  }

  /**
   * Determines whether this notification has HIGH priority.
   */
  public isHighPriority(): boolean {
    return this.props.priority.isHigh();
  }

  /**
   * Determines whether this notification has CRITICAL priority.
   */
  public isCriticalPriority(): boolean {
    return this.props.priority.isCritical();
  }

  // ===========================================================================
  // Content
  // ===========================================================================

  /**
   * Current notification title.
   */
  public get title(): NotificationTitle {
    return this.props.title;
  }

  /**
   * Current notification body.
   */
  public get body(): NotificationBody {
    return this.props.body;
  }

  /**
   * Changes the notification title.
   *
   * Title changes are allowed only while the notification is PENDING.
   */
  public changeTitle(title: NotificationTitle): void {
    this.ensurePending();

    NotificationEntity.ensureTitle(title);

    if (this.props.title.equals(title)) {
      return;
    }

    this.props.title = title;

    this.touch();

    this.validateInvariants();
  }

  /**
   * Changes the notification body.
   *
   * Body changes are allowed only while the notification is PENDING.
   */
  public changeBody(body: NotificationBody): void {
    this.ensurePending();

    NotificationEntity.ensureBody(body);

    if (this.props.body.equals(body)) {
      return;
    }

    this.props.body = body;

    this.touch();

    this.validateInvariants();
  }

  // ===========================================================================
  // Cross-domain Reference
  // ===========================================================================

  /**
   * Optional type of the referenced domain resource.
   */
  public get referenceType(): NotificationReferenceType | undefined {
    return this.props.referenceType;
  }

  /**
   * Optional public identity of the referenced domain resource.
   */
  public get referencePublicId(): NotificationReferencePublicId | undefined {
    return this.props.referencePublicId;
  }

  /**
   * Determines whether this notification references a domain resource.
   */
  public hasReference(): boolean {
    return (
      this.props.referenceType !== undefined &&
      this.props.referencePublicId !== undefined
    );
  }

  /**
   * Determines whether this notification references the supplied
   * resource identity.
   */
  public references(
    referenceType: NotificationReferenceType,
    referencePublicId: NotificationReferencePublicId,
  ): boolean {
    if (referenceType === undefined || referencePublicId === undefined) {
      return false;
    }

    return (
      this.props.referenceType?.equals(referenceType) === true &&
      this.props.referencePublicId?.equals(referencePublicId) === true
    );
  }

  // ===========================================================================
  // Source Event
  // ===========================================================================

  /**
   * Optional source event type.
   */
  public get eventType(): NotificationEventType | undefined {
    return this.props.eventType;
  }

  /**
   * Optional source event public identity.
   */
  public get eventPublicId(): NotificationEventPublicId | undefined {
    return this.props.eventPublicId;
  }

  /**
   * Determines whether this notification has a source event.
   */
  public hasSourceEvent(): boolean {
    return (
      this.props.eventType !== undefined &&
      this.props.eventPublicId !== undefined
    );
  }

  /**
   * Determines whether this notification was caused by the supplied
   * event identity.
   */
  public wasCausedBy(
    eventType: NotificationEventType,
    eventPublicId: NotificationEventPublicId,
  ): boolean {
    if (eventType === undefined || eventPublicId === undefined) {
      return false;
    }

    return (
      this.props.eventType?.equals(eventType) === true &&
      this.props.eventPublicId?.equals(eventPublicId) === true
    );
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current notification lifecycle status.
   */
  public get status(): NotificationStatus {
    return this.props.status;
  }

  /**
   * Determines whether the notification is pending.
   */
  public isPending(): boolean {
    return this.props.status.isPending();
  }

  /**
   * Determines whether the notification has been sent.
   */
  public isSent(): boolean {
    return this.props.status.isSent();
  }

  /**
   * Determines whether the notification has been read.
   */
  public isRead(): boolean {
    return this.props.status.isRead();
  }

  /**
   * Determines whether notification processing failed.
   */
  public isFailed(): boolean {
    return this.props.status.isFailed();
  }

  /**
   * Determines whether the notification was cancelled.
   */
  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  /**
   * Determines whether the notification can still be modified.
   */
  public canBeModified(): boolean {
    return this.isPending();
  }

  /**
   * Determines whether the notification can be sent.
   */
  public canBeSent(): boolean {
    return this.isPending();
  }

  /**
   * Determines whether the notification can be read.
   */
  public canBeRead(): boolean {
    return this.isSent();
  }

  /**
   * Determines whether the notification can fail.
   */
  public canBeFailed(): boolean {
    return this.isPending();
  }

  /**
   * Determines whether the notification can be cancelled.
   */
  public canBeCancelled(): boolean {
    return this.isPending();
  }

  /**
   * Determines whether the notification is terminal.
   */
  public isTerminal(): boolean {
    return this.isRead() || this.isFailed() || this.isCancelled();
  }

  // ===========================================================================
  // Lifecycle — Send
  // ===========================================================================

  /**
   * Marks the notification as sent.
   *
   * Only PENDING notifications can be sent.
   */
  public send(sentAt: Date = new Date()): void {
    this.ensurePending();

    NotificationEntity.ensureValidDate(sentAt, 'sent date');

    if (sentAt.getTime() < this.props.createdAt.getTime()) {
      throw new NotificationInvalidStatusException(
        'Notification sent date cannot be before creation date.',
      );
    }

    this.props.status = NotificationStatus.sent();

    this.props.sentAt = NotificationEntity.cloneDate(sentAt);

    this.touch(sentAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Lifecycle — Read
  // ===========================================================================

  /**
   * Marks the notification as read.
   *
   * A notification must first be SENT.
   */
  public read(readAt: Date = new Date()): void {
    if (!this.isSent()) {
      throw new NotificationInvalidStatusException(
        'Only a sent notification can be marked as read.',
      );
    }

    NotificationEntity.ensureValidDate(readAt, 'read date');

    if (this.props.sentAt === undefined) {
      throw new NotificationException(
        'A sent notification must have a sent date.',
      );
    }

    if (readAt.getTime() < this.props.sentAt.getTime()) {
      throw new NotificationInvalidStatusException(
        'Notification read date cannot be before sent date.',
      );
    }

    this.props.status = NotificationStatus.read();

    this.props.readAt = NotificationEntity.cloneDate(readAt);

    this.touch(readAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Lifecycle — Fail
  // ===========================================================================

  /**
   * Marks the notification as failed.
   *
   * Only PENDING notifications can transition directly to FAILED.
   */
  public fail(failureReason: string, failedAt: Date = new Date()): void {
    this.ensurePending();

    NotificationEntity.ensureFailureReason(failureReason);

    NotificationEntity.ensureValidDate(failedAt, 'failed date');

    if (failedAt.getTime() < this.props.createdAt.getTime()) {
      throw new NotificationInvalidStatusException(
        'Notification failed date cannot be before creation date.',
      );
    }

    this.props.status = NotificationStatus.failed();

    this.props.failedAt = NotificationEntity.cloneDate(failedAt);

    this.props.failureReason =
      NotificationEntity.normalizeFailureReason(failureReason);

    this.touch(failedAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Lifecycle — Cancel
  // ===========================================================================

  /**
   * Cancels the notification.
   *
   * Only PENDING notifications can be cancelled.
   */
  public cancel(cancelledAt: Date = new Date()): void {
    this.ensurePending();

    NotificationEntity.ensureValidDate(cancelledAt, 'cancelled date');

    if (cancelledAt.getTime() < this.props.createdAt.getTime()) {
      throw new NotificationInvalidStatusException(
        'Notification cancelled date cannot be before creation date.',
      );
    }

    this.props.status = NotificationStatus.cancelled();

    this.props.cancelledAt = NotificationEntity.cloneDate(cancelledAt);

    this.touch(cancelledAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Failure Information
  // ===========================================================================

  /**
   * Optional notification failure reason.
   */
  public get failureReason(): string | undefined {
    return this.props.failureReason;
  }

  /**
   * Determines whether the notification contains a failure reason.
   */
  public hasFailureReason(): boolean {
    return this.props.failureReason !== undefined;
  }

  // ===========================================================================
  // Lifecycle Timestamps
  // ===========================================================================

  /**
   * Notification sent timestamp.
   */
  public get sentAt(): Date | undefined {
    return this.props.sentAt !== undefined
      ? NotificationEntity.cloneDate(this.props.sentAt)
      : undefined;
  }

  /**
   * Notification read timestamp.
   */
  public get readAt(): Date | undefined {
    return this.props.readAt !== undefined
      ? NotificationEntity.cloneDate(this.props.readAt)
      : undefined;
  }

  /**
   * Notification failed timestamp.
   */
  public get failedAt(): Date | undefined {
    return this.props.failedAt !== undefined
      ? NotificationEntity.cloneDate(this.props.failedAt)
      : undefined;
  }

  /**
   * Notification cancelled timestamp.
   */
  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt !== undefined
      ? NotificationEntity.cloneDate(this.props.cancelledAt)
      : undefined;
  }

  /**
   * Notification creation timestamp.
   */
  public get createdAt(): Date {
    return NotificationEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Notification last-update timestamp.
   */
  public get updatedAt(): Date {
    return NotificationEntity.cloneDate(this.props.updatedAt);
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
    NotificationEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = NotificationEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new NotificationException(
        'Notification updated date cannot be before creation date.',
      );
    }

    if (timestamp.getTime() < this.props.updatedAt.getTime()) {
      throw new NotificationException(
        'Notification updated date cannot move backwards.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Invariants
  // ===========================================================================

  /**
   * Validates all Notification entity-level invariants.
   */
  private validateInvariants(): void {
    NotificationEntity.ensureRecipientPublicId(this.props.recipientPublicId);

    NotificationEntity.ensureType(this.props.type);

    NotificationEntity.ensurePriority(this.props.priority);

    NotificationEntity.ensureStatus(this.props.status);

    NotificationEntity.ensureTitle(this.props.title);

    NotificationEntity.ensureBody(this.props.body);

    NotificationEntity.ensureOptionalReferenceType(this.props.referenceType);

    NotificationEntity.ensureOptionalReferencePublicId(
      this.props.referencePublicId,
    );

    NotificationEntity.ensureOptionalEventType(this.props.eventType);

    NotificationEntity.ensureOptionalEventPublicId(this.props.eventPublicId);

    NotificationEntity.ensureReferencePair(
      this.props.referenceType,
      this.props.referencePublicId,
    );

    NotificationEntity.ensureEventPair(
      this.props.eventType,
      this.props.eventPublicId,
    );

    NotificationEntity.ensureOptionalDate(this.props.sentAt, 'sent date');

    NotificationEntity.ensureOptionalDate(this.props.readAt, 'read date');

    NotificationEntity.ensureOptionalDate(this.props.failedAt, 'failed date');

    NotificationEntity.ensureOptionalDate(
      this.props.cancelledAt,
      'cancelled date',
    );

    NotificationEntity.ensureOptionalFailureReason(this.props.failureReason);

    NotificationEntity.ensureValidDate(this.props.createdAt, 'creation date');

    NotificationEntity.ensureValidDate(this.props.updatedAt, 'updated date');

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new NotificationException(
        'Notification updated date cannot be before creation date.',
      );
    }

    NotificationEntity.ensureLifecycleTimestamps(this.props);
  }

  // ===========================================================================
  // Status Guards
  // ===========================================================================

  /**
   * Ensures the notification is currently PENDING.
   */
  private ensurePending(): void {
    if (!this.isPending()) {
      throw new NotificationInvalidStatusException(
        'Notification must be pending for this operation.',
      );
    }
  }

  // ===========================================================================
  // Identity Guards
  // ===========================================================================

  private static ensureInternalId(id: UniqueEntityId): void {
    if (!(id instanceof UniqueEntityId)) {
      throw new NotificationException(
        'Notification internal identity must be a valid entity identity.',
      );
    }
  }

  // ===========================================================================
  // Recipient Guards
  // ===========================================================================

  private static ensureRecipientPublicId(
    recipientPublicId: NotificationMemberPublicId,
  ): void {
    if (recipientPublicId === undefined) {
      throw new NotificationException(
        'Notification recipient public identity is required.',
      );
    }
  }

  // ===========================================================================
  // Type Guards
  // ===========================================================================

  private static ensureType(type: NotificationType): void {
    if (type === undefined) {
      throw new NotificationException('Notification type is required.');
    }
  }

  // ===========================================================================
  // Priority Guards
  // ===========================================================================

  private static ensurePriority(priority: NotificationPriority): void {
    if (priority === undefined) {
      throw new NotificationException('Notification priority is required.');
    }
  }

  // ===========================================================================
  // Status Guards
  // ===========================================================================

  private static ensureStatus(status: NotificationStatus): void {
    if (status === undefined) {
      throw new NotificationException('Notification status is required.');
    }
  }

  // ===========================================================================
  // Title Guards
  // ===========================================================================

  private static ensureTitle(title: NotificationTitle): void {
    if (title === undefined) {
      throw new NotificationTitleEmptyException(
        'Notification title is required.',
      );
    }

    if (title.value.trim().length === 0) {
      throw new NotificationTitleEmptyException(
        'Notification title cannot be empty.',
      );
    }
  }

  // ===========================================================================
  // Body Guards
  // ===========================================================================

  private static ensureBody(body: NotificationBody): void {
    if (body === undefined) {
      throw new NotificationBodyEmptyException(
        'Notification body is required.',
      );
    }

    if (body.value.trim().length === 0) {
      throw new NotificationBodyEmptyException(
        'Notification body cannot be empty.',
      );
    }
  }

  // ===========================================================================
  // Reference Guards
  // ===========================================================================

  private static ensureOptionalReferenceType(
    referenceType: NotificationReferenceType | undefined,
  ): void {
    if (referenceType === undefined) {
      return;
    }

    if (referenceType.value.trim().length === 0) {
      throw new NotificationException(
        'Notification reference type cannot be empty.',
      );
    }
  }

  private static ensureOptionalReferencePublicId(
    referencePublicId: NotificationReferencePublicId | undefined,
  ): void {
    if (referencePublicId === undefined) {
      return;
    }

    if (referencePublicId.value.trim().length === 0) {
      throw new NotificationException(
        'Notification reference public ID cannot be empty.',
      );
    }
  }

  /**
   * A resource reference must either contain both components or neither.
   */
  private static ensureReferencePair(
    referenceType: NotificationReferenceType | undefined,
    referencePublicId: NotificationReferencePublicId | undefined,
  ): void {
    const hasType = referenceType !== undefined;

    const hasPublicId = referencePublicId !== undefined;

    if (hasType !== hasPublicId) {
      throw new NotificationException(
        'Notification reference type and reference public ID must be provided together.',
      );
    }
  }

  // ===========================================================================
  // Event Guards
  // ===========================================================================

  private static ensureOptionalEventType(
    eventType: NotificationEventType | undefined,
  ): void {
    if (eventType === undefined) {
      return;
    }

    if (eventType.value.trim().length === 0) {
      throw new NotificationException(
        'Notification event type cannot be empty.',
      );
    }
  }

  private static ensureOptionalEventPublicId(
    eventPublicId: NotificationEventPublicId | undefined,
  ): void {
    if (eventPublicId === undefined) {
      return;
    }

    if (eventPublicId.value.trim().length === 0) {
      throw new NotificationException(
        'Notification event public ID cannot be empty.',
      );
    }
  }

  /**
   * A source event reference must either contain both components or neither.
   */
  private static ensureEventPair(
    eventType: NotificationEventType | undefined,
    eventPublicId: NotificationEventPublicId | undefined,
  ): void {
    const hasType = eventType !== undefined;

    const hasPublicId = eventPublicId !== undefined;

    if (hasType !== hasPublicId) {
      throw new NotificationException(
        'Notification event type and event public ID must be provided together.',
      );
    }
  }

  // ===========================================================================
  // Failure Guards
  // ===========================================================================

  private static ensureFailureReason(failureReason: string): void {
    if (typeof failureReason !== 'string') {
      throw new NotificationException(
        'Notification failure reason must be a string.',
      );
    }

    if (failureReason.trim().length === 0) {
      throw new NotificationException(
        'Notification failure reason cannot be empty.',
      );
    }
  }

  private static ensureOptionalFailureReason(
    failureReason: string | undefined,
  ): void {
    if (failureReason === undefined) {
      return;
    }

    NotificationEntity.ensureFailureReason(failureReason);
  }

  private static normalizeFailureReason(failureReason: string): string {
    NotificationEntity.ensureFailureReason(failureReason);

    return failureReason.trim();
  }

  // ===========================================================================
  // Lifecycle Timestamp Guards
  // ===========================================================================

  private static ensureLifecycleTimestamps(props: NotificationProps): void {
    // -------------------------------------------------------------------------
    // sentAt
    // -------------------------------------------------------------------------

    if (props.sentAt !== undefined) {
      if (props.sentAt.getTime() < props.createdAt.getTime()) {
        throw new NotificationException(
          'Notification sent date cannot be before creation date.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // readAt
    // -------------------------------------------------------------------------

    if (props.readAt !== undefined) {
      if (props.sentAt === undefined) {
        throw new NotificationException(
          'Notification read date requires a sent date.',
        );
      }

      if (props.readAt.getTime() < props.sentAt.getTime()) {
        throw new NotificationException(
          'Notification read date cannot be before sent date.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // failedAt
    // -------------------------------------------------------------------------

    if (props.failedAt !== undefined) {
      if (props.failedAt.getTime() < props.createdAt.getTime()) {
        throw new NotificationException(
          'Notification failed date cannot be before creation date.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // cancelledAt
    // -------------------------------------------------------------------------

    if (props.cancelledAt !== undefined) {
      if (props.cancelledAt.getTime() < props.createdAt.getTime()) {
        throw new NotificationException(
          'Notification cancelled date cannot be before creation date.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Failure reason consistency
    // -------------------------------------------------------------------------

    if (props.status.isFailed() && props.failureReason === undefined) {
      throw new NotificationException(
        'A FAILED notification must have a failure reason.',
      );
    }

    if (!props.status.isFailed() && props.failureReason !== undefined) {
      throw new NotificationException(
        'Only a FAILED notification may contain a failure reason.',
      );
    }

    // -------------------------------------------------------------------------
    // Status ↔ timestamp consistency
    // -------------------------------------------------------------------------

    if (props.status.isPending()) {
      if (props.sentAt !== undefined) {
        throw new NotificationException(
          'A PENDING notification cannot have a sent date.',
        );
      }

      if (props.readAt !== undefined) {
        throw new NotificationException(
          'A PENDING notification cannot have a read date.',
        );
      }

      if (props.failedAt !== undefined) {
        throw new NotificationException(
          'A PENDING notification cannot have a failed date.',
        );
      }

      if (props.cancelledAt !== undefined) {
        throw new NotificationException(
          'A PENDING notification cannot have a cancelled date.',
        );
      }

      return;
    }

    if (props.status.isSent()) {
      if (props.sentAt === undefined) {
        throw new NotificationException(
          'A SENT notification must have a sent date.',
        );
      }

      if (props.readAt !== undefined) {
        throw new NotificationException(
          'A SENT notification cannot have a read date.',
        );
      }

      if (props.failedAt !== undefined) {
        throw new NotificationException(
          'A SENT notification cannot have a failed date.',
        );
      }

      if (props.cancelledAt !== undefined) {
        throw new NotificationException(
          'A SENT notification cannot have a cancelled date.',
        );
      }

      return;
    }

    if (props.status.isRead()) {
      if (props.sentAt === undefined) {
        throw new NotificationException(
          'A READ notification must have a sent date.',
        );
      }

      if (props.readAt === undefined) {
        throw new NotificationException(
          'A READ notification must have a read date.',
        );
      }

      if (props.failedAt !== undefined) {
        throw new NotificationException(
          'A READ notification cannot have a failed date.',
        );
      }

      if (props.cancelledAt !== undefined) {
        throw new NotificationException(
          'A READ notification cannot have a cancelled date.',
        );
      }

      return;
    }

    if (props.status.isFailed()) {
      if (props.failedAt === undefined) {
        throw new NotificationException(
          'A FAILED notification must have a failed date.',
        );
      }

      if (props.readAt !== undefined) {
        throw new NotificationException(
          'A FAILED notification cannot have a read date.',
        );
      }

      if (props.cancelledAt !== undefined) {
        throw new NotificationException(
          'A FAILED notification cannot have a cancelled date.',
        );
      }

      return;
    }

    if (props.status.isCancelled()) {
      if (props.cancelledAt === undefined) {
        throw new NotificationException(
          'A CANCELLED notification must have a cancelled date.',
        );
      }

      if (props.readAt !== undefined) {
        throw new NotificationException(
          'A CANCELLED notification cannot have a read date.',
        );
      }

      if (props.failedAt !== undefined) {
        throw new NotificationException(
          'A CANCELLED notification cannot have a failed date.',
        );
      }

      return;
    }

    throw new NotificationException(
      'Notification lifecycle status is invalid.',
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
        `Notification ${fieldName} must be a valid date.`,
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

    NotificationEntity.ensureValidDate(value, fieldName);
  }

  // ===========================================================================
  // Date Clone
  // ===========================================================================

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    NotificationEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
