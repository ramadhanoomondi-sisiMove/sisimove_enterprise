// -----------------------------------------------------------------------------
// Notification Delivery — Failed Domain Event
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
// PENDING → FAILED
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
// - eventName     = NotificationDeliveryFailed
//
// The failure reason is included as domain-level failure information.
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
 * Raised when a Notification Delivery fails.
 */
export class NotificationDeliveryFailedEvent extends NotificationDomainEvent {
  public constructor(
    notificationId: string,
    public readonly notificationPublicId: string,
    public readonly deliveryPublicId: string,
    public readonly channel: string,
    public readonly status: string,
    public readonly failureReason: string,
    public readonly failedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      notificationId,
      'Notification',
      'NotificationDeliveryFailed',
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

      failureReason: this.failureReason,

      failedAt: new Date(this.failedAt.getTime()),
    };
  }
}
