// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Messaging domain.
 *
 * All Messaging-specific domain exceptions should ultimately extend
 * this exception.
 */
export class MessagingException extends DomainException {
  public constructor(message: string = 'A messaging domain error occurred.') {
    super('MESSAGING.DOMAIN.ERROR', message);
  }
}
