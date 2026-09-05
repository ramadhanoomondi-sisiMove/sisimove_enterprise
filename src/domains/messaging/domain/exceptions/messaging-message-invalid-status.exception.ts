// -----------------------------------------------------------------------------
// Messaging — Message Invalid Status Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { MessagingException } from './messaging.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation cannot be performed because a Messaging
 * Message is in an invalid status.
 */
export class MessagingMessageInvalidStatusException extends MessagingException {
  public constructor(
    message: string = 'Messaging message has an invalid status for this operation.',
  ) {
    super(message);
  }
}
