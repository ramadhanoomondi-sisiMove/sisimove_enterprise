// -----------------------------------------------------------------------------
// Notification Delivery — Sent Domain Event
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
// PENDING → SENT
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
// - eventName     = NotificationDeliverySent
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
 * Raised when a Notification Delivery is sent.
 */
export class NotificationDeliverySentEvent extends NotificationDomainEvent {
  public constructor(
    notificationId: string,
    public readonly notificationPublicId: string,
    public readonly deliveryPublicId: string,
    public readonly channel: string,
    public readonly status: string,
    public readonly providerReference: string | undefined,
    public readonly sentAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      notificationId,
      'Notification',
      'NotificationDeliverySent',
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
   * providerReference is intentionally treated as opaque metadata. The
   * Notification domain does not interpret provider-specific identifiers.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      notificationPublicId: this.notificationPublicId,

      deliveryPublicId: this.deliveryPublicId,

      channel: this.channel,

      status: this.status,

      providerReference: this.providerReference,

      sentAt: new Date(this.sentAt.getTime()),
    };
  }
}
