// -----------------------------------------------------------------------------
// Notification — Read Domain Event
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
// This event represents the transition of a Notification from SENT to READ.
//
// Event identity is rooted in the Notification aggregate:
//
// - aggregateId   = notification internal identity
// - aggregateType = Notification
// - eventName     = NotificationRead
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
 * Raised when a Notification is marked as READ.
 */
export class NotificationReadEvent extends NotificationDomainEvent {
  public constructor(
    notificationId: string,
    public readonly publicId: string,
    public readonly recipientPublicId: string,
    public readonly type: string,
    public readonly priority: string,
    public readonly status: string,
    public readonly readAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      notificationId,
      'Notification',
      'NotificationRead',
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

      readAt: new Date(this.readAt.getTime()),
    };
  }
}
