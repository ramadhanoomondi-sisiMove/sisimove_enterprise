// -----------------------------------------------------------------------------
// Notification Delivery — Invalid Status Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from './notification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation cannot be performed because a Notification
 * Delivery is in an invalid status.
 */
export class NotificationDeliveryInvalidStatusException extends NotificationException {
  public constructor(
    message: string = 'Notification delivery has an invalid status for this operation.',
  ) {
    super(message);
  }
}
