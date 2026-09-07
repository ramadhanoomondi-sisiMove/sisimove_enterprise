// -----------------------------------------------------------------------------
// Notification Preference — Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from './notification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Notification Preference cannot be found.
 */
export class NotificationPreferenceNotFoundException extends NotificationException {
  public constructor(
    message: string = 'Notification preference was not found.',
  ) {
    super(message);
  }
}
