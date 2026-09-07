// -----------------------------------------------------------------------------
// Notification Delivery — Created Domain Event
// -----------------------------------------------------------------------------
//
// Raised by:
//
// NotificationAggregate
//
// Child entity:
//
// NotificationDeliveryEntity
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// This event represents the creation of a Notification Delivery child entity.
//
// The event remains rooted in the Notification aggregate. The delivery public
// identity is included in the payload because it identifies the affected child
// entity.
//
// Aggregate identity:
//
// - aggregateId   = Notification internal identity
// - aggregateType = Notification
// - eventName     = NotificationDeliveryCreated
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
 * Raised when a Notification Delivery is created.
 *
 * The delivery belongs to a NotificationAggregate and is therefore not an
 * independent aggregate root.
 */
export class NotificationDeliveryCreatedEvent extends NotificationDomainEvent {
  public constructor(
    notificationId: string,
    public readonly notificationPublicId: string,
    public readonly deliveryPublicId: string,
    public readonly channel: string,
    public readonly status: string,
    public readonly createdAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      notificationId,
      'Notification',
      'NotificationDeliveryCreated',
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
   * The Notification aggregate identity remains in metadata.aggregateId.
   *
   * Public identifiers are included because consumers may need to identify the
   * Notification and the affected delivery without accessing internal IDs.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      notificationPublicId: this.notificationPublicId,

      deliveryPublicId: this.deliveryPublicId,

      channel: this.channel,

      status: this.status,

      createdAt: new Date(this.createdAt.getTime()),
    };
  }
}
