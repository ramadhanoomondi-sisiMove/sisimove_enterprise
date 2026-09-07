// -----------------------------------------------------------------------------
// Notification Delivery — Channel Already Exists Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from './notification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Notification already contains a delivery for the
 * requested channel.
 *
 * A Notification may have at most one delivery per channel.
 *
 * This domain invariant is also reinforced by the persistence constraint:
 *
 * @@unique([notificationId, channel])
 */
export class NotificationDeliveryChannelAlreadyExistsException extends NotificationException {
  public constructor(
    message: string = 'Notification delivery channel already exists.',
  ) {
    super(message);
  }
}
