// -----------------------------------------------------------------------------
// Messaging — Message Already Deleted Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { MessagingException } from './messaging.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation attempts to modify or delete a Messaging
 * Message that has already been deleted.
 */
export class MessagingMessageAlreadyDeletedException extends MessagingException {
  public constructor(
    message: string = 'Messaging message is already deleted.',
  ) {
    super(message);
  }
}
