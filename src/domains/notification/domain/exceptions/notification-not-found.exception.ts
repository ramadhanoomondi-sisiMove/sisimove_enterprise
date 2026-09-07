// -----------------------------------------------------------------------------
// Notification — Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from './notification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Notification cannot be found.
 */
export class NotificationNotFoundException extends NotificationException {
  public constructor(message: string = 'Notification was not found.') {
    super(message);
  }
}
