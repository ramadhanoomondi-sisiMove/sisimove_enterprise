// -----------------------------------------------------------------------------
// Messaging — Message Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { MessagingException } from './messaging.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Messaging Message cannot be found.
 */
export class MessagingMessageNotFoundException extends MessagingException {
  public constructor(message: string = 'Messaging message was not found.') {
    super(message);
  }
}
