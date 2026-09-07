// -----------------------------------------------------------------------------
// Notification — Sent Domain Event
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
// This event represents the transition of a Notification from PENDING to SENT.
//
// Event identity is rooted in the Notification aggregate:
//
// - aggregateId   = notification internal identity
// - aggregateType = Notification
// - eventName     = NotificationSent
//
// The event represents Notification-level lifecycle state.
//
// Individual channel delivery state is represented by NotificationDelivery
// domain events and is intentionally not duplicated here.
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
 * Raised when a Notification is marked as SENT.
 */
export class NotificationSentEvent extends NotificationDomainEvent {
  public constructor(
    notificationId: string,
    public readonly publicId: string,
    public readonly recipientPublicId: string,
    public readonly type: string,
    public readonly priority: string,
    public readonly status: string,
    public readonly sentAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      notificationId,
      'Notification',
      'NotificationSent',
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

      publicId: this.publicId,

      recipientPublicId: this.recipientPublicId,

      type: this.type,

      priority: this.priority,

      status: this.status,

      sentAt: new Date(this.sentAt.getTime()),
    };
  }
}
