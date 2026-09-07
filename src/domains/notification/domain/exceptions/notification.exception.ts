// -----------------------------------------------------------------------------
// Notification
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Notification domain.
 *
 * All Notification-specific domain exceptions should ultimately extend
 * this exception.
 */
export class NotificationException extends DomainException {
  public constructor(
    message: string = 'A notification domain error occurred.',
  ) {
    super('NOTIFICATION.DOMAIN.ERROR', message);
  }
}
