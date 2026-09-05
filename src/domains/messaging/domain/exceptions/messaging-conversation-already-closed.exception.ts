// -----------------------------------------------------------------------------
// Messaging — Conversation Already Closed Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { MessagingException } from './messaging.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation attempts to close a Messaging Conversation
 * that is already closed.
 */
export class MessagingConversationAlreadyClosedException extends MessagingException {
  public constructor(
    message: string = 'Messaging conversation is already closed.',
  ) {
    super(message);
  }
}
