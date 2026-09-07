// -----------------------------------------------------------------------------
// Notification Delivery — Delivered Domain Event
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
// Transition:
//
// SENT → DELIVERED
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
// - eventName     = NotificationDeliveryDelivered
//
// Event identity:
//
// - notificationPublicId = public identity of the Notification
// - deliveryPublicId     = public identity of the Notification Delivery
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - represent the successful delivery of a Notification Delivery;
// - preserve the Notification aggregate identity;
// - identify the affected Notification publicly;
// - identify the affected Delivery publicly;
// - expose the delivery channel and resulting status;
// - expose the delivery confirmation timestamp;
// - carry correlation and causation metadata.
//
// This event contains no business logic.
//
// -----------------------------------------------------------------------------

import { NotificationDomainEvent } from './notification-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Raised when a Notification Delivery transitions from SENT to DELIVERED.
 *
 * The Notification aggregate remains the aggregate boundary.
 *
 * The delivery is a child of the Notification aggregate and is therefore
 * identified in the event through its public identity.
 */
export class NotificationDeliveryDeliveredEvent extends NotificationDomainEvent {
  public constructor(
    /**
     * Internal identity of the Notification aggregate.
     *
     * This is the aggregate identity used by the domain-event infrastructure.
     */
    notificationId: string,

    /**
     * Public identity of the Notification aggregate.
     */
    public readonly notificationPublicId: string,

    /**
     * Public identity of the delivered Notification Delivery.
     */
    public readonly deliveryPublicId: string,

    /**
     * Channel through which the Notification Delivery was delivered.
     */
    public readonly channel: string,

    /**
     * Resulting delivery status.
     *
     * Expected value:
     *
     * DELIVERED
     */
    public readonly status: string,

    /**
     * Timestamp at which delivery was confirmed.
     */
    public readonly deliveredAt: Date,

    /**
     * Correlation identifier for the operation that produced this event.
     */
    correlationId?: string,

    /**
     * Causation identifier for the message/command that caused this event.
     */
    causationId?: string,
  ) {
    super(
      notificationId,
      'Notification',
      'NotificationDeliveryDelivered',
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
   * The payload contains only serializable event data.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      notificationPublicId: this.notificationPublicId,

      deliveryPublicId: this.deliveryPublicId,

      channel: this.channel,

      status: this.status,

      deliveredAt: new Date(this.deliveredAt.getTime()),
    };
  }
}
