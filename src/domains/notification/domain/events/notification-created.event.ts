// -----------------------------------------------------------------------------
// Notification — Created Domain Event
// -----------------------------------------------------------------------------
//
// Raised by:
//
// NotificationAggregate
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// This event represents the creation of a Notification aggregate.
//
// Event identity is rooted in the Notification aggregate:
//
// - aggregateId   = notification internal identity
// - aggregateType = Notification
// - eventName     = NotificationCreated
//
// Public/domain values are serialized to primitives in the event payload.
//
// The aggregate internal identity remains in
// DomainEvent.metadata.aggregateId.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Notification Domain Event
// -----------------------------------------------------------------------------

import { NotificationDomainEvent } from './notification-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Raised when a Notification aggregate is created.
 *
 * The event contains the domain state required by consumers without exposing
 * persistence-specific representations.
 */
export class NotificationCreatedEvent extends NotificationDomainEvent {
  public constructor(
    notificationId: string,
    public readonly publicId: string,
    public readonly recipientPublicId: string,
    public readonly type: string,
    public readonly priority: string,
    public readonly status: string,
    public readonly title: string,
    public readonly body: string,
    public readonly referenceType: string | undefined,
    public readonly referencePublicId: string | undefined,
    public readonly eventType: string | undefined,
    public readonly eventPublicId: string | undefined,
    public readonly createdAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      notificationId,
      'Notification',
      'NotificationCreated',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  /**
   * Builds the event payload.
   *
   * Value objects have already been converted to primitive values before
   * constructing this event.
   *
   * Date values are defensively copied.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,

      recipientPublicId: this.recipientPublicId,

      type: this.type,

      priority: this.priority,

      status: this.status,

      title: this.title,

      body: this.body,

      referenceType: this.referenceType,

      referencePublicId: this.referencePublicId,

      eventType: this.eventType,

      eventPublicId: this.eventPublicId,

      createdAt: new Date(this.createdAt.getTime()),
    };
  }
}
