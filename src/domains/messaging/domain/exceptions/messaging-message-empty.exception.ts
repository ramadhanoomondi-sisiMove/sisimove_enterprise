// -----------------------------------------------------------------------------
// Messaging — Message Empty Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { MessagingException } from './messaging.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Messaging Message does not contain the required content
 * or attachment for its message type.
 */
export class MessagingMessageEmptyException extends MessagingException {
  public constructor(message: string = 'Messaging message cannot be empty.') {
    super(message);
  }
}
