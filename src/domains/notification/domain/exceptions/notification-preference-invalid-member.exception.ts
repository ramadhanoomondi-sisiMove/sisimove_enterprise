// -----------------------------------------------------------------------------
// Notification Preference — Invalid Member Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from './notification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Notification Preference is created or operated on
 * with an invalid member public ID.
 *
 * The member belongs to the Identity domain.
 *
 * Notification only stores the member's public identity as an
 * opaque cross-domain reference.
 */
export class NotificationPreferenceInvalidMemberException extends NotificationException {
  public constructor(
    message: string = 'Notification preference member public ID is invalid.',
  ) {
    super(message);
  }
}
