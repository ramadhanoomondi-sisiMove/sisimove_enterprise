// -----------------------------------------------------------------------------
// Notification — Failed Domain Event
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
// FAILED.
//
// Event identity is rooted in the Notification aggregate:
//
// - aggregateId   = notification internal identity
// - aggregateType = Notification
// - eventName     = NotificationFailed
//
// The failure reason is included as domain-level failure information.
//
// Individual delivery failures are represented separately by
// NotificationDeliveryFailedEvent and are not duplicated here.
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
 * Raised when a Notification fails.
 */
export class NotificationFailedEvent extends NotificationDomainEvent {
  public constructor(
    notificationId: string,
    public readonly publicId: string,
    public readonly recipientPublicId: string,
    public readonly type: string,
    public readonly priority: string,
    public readonly status: string,
    public readonly failureReason: string,
    public readonly failedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      notificationId,
      'Notification',
      'NotificationFailed',
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

      failureReason: this.failureReason,

      failedAt: new Date(this.failedAt.getTime()),
    };
  }
}
