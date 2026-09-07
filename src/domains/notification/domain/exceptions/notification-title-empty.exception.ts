// -----------------------------------------------------------------------------
// Notification — Title Empty Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from './notification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Notification title is empty or contains only whitespace.
 */
export class NotificationTitleEmptyException extends NotificationException {
  public constructor(message: string = 'Notification title cannot be empty.') {
    super(message);
  }
}
