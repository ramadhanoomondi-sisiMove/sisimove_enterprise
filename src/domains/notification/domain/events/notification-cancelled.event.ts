// -----------------------------------------------------------------------------
// Notification — Cancelled Domain Event
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
// This event represents the transition of a Notification from PENDING to
// CANCELLED.
//
// Event identity is rooted in the Notification aggregate:
//
// - aggregateId   = notification internal identity
// - aggregateType = Notification
// - eventName     = NotificationCancelled
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
 * Raised when a Notification is cancelled.
 */
export class NotificationCancelledEvent extends NotificationDomainEvent {
  public constructor(
    notificationId: string,
    public readonly publicId: string,
    public readonly recipientPublicId: string,
    public readonly type: string,
    public readonly priority: string,
    public readonly status: string,
    public readonly cancelledAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      notificationId,
      'Notification',
      'NotificationCancelled',
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

      cancelledAt: new Date(this.cancelledAt.getTime()),
    };
  }
}
