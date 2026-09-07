// -----------------------------------------------------------------------------
// Notification Delivery — Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from './notification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Notification Delivery child entity cannot be found
 * within its Notification aggregate.
 */
export class NotificationDeliveryNotFoundException extends NotificationException {
  public constructor(message: string = 'Notification delivery was not found.') {
    super(message);
  }
}
