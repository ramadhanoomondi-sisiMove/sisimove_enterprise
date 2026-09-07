// -----------------------------------------------------------------------------
// Notification Delivery — Cancelled Domain Event
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
// This event represents the transition:
//
// PENDING → CANCELLED
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// Aggregate identity:
//
// - aggregateId   = Notification internal identity
// - aggregateType = Notification
// - eventName     = NotificationDeliveryCancelled
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
 * Raised when a Notification Delivery is cancelled.
 */
export class NotificationDeliveryCancelledEvent extends NotificationDomainEvent {
  public constructor(
    notificationId: string,
    public readonly notificationPublicId: string,
    public readonly deliveryPublicId: string,
    public readonly channel: string,
    public readonly status: string,
    public readonly cancelledAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      notificationId,
      'Notification',
      'NotificationDeliveryCancelled',
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
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      notificationPublicId: this.notificationPublicId,

      deliveryPublicId: this.deliveryPublicId,

      channel: this.channel,

      status: this.status,

      cancelledAt: new Date(this.cancelledAt.getTime()),
    };
  }
}
