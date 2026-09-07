// -----------------------------------------------------------------------------
// Notification — Invalid Status Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from './notification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation cannot be performed because the Notification
 * is in an invalid status.
 */
export class NotificationInvalidStatusException extends NotificationException {
  public constructor(
    message: string = 'Notification has an invalid status for this operation.',
  ) {
    super(message);
  }
}
