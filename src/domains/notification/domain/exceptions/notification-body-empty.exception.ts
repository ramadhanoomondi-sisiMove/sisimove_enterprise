// -----------------------------------------------------------------------------
// Notification — Body Empty Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from './notification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Notification body is empty or contains only whitespace.
 */
export class NotificationBodyEmptyException extends NotificationException {
  public constructor(message: string = 'Notification body cannot be empty.') {
    super(message);
  }
}
