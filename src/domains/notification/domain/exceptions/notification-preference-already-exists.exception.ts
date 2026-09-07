// -----------------------------------------------------------------------------
// Notification Preference — Already Exists Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from './notification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an attempt is made to create more than one Notification
 * Preference for the same member.
 *
 * The domain requires exactly one Notification Preference aggregate
 * per member.
 */
export class NotificationPreferenceAlreadyExistsException extends NotificationException {
  public constructor(
    message: string = 'Notification preference already exists for this member.',
  ) {
    super(message);
  }
}
