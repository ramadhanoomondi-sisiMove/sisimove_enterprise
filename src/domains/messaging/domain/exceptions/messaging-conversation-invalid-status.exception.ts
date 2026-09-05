// -----------------------------------------------------------------------------
// Messaging — Conversation Invalid Status Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { MessagingException } from './messaging.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation cannot be performed because the Messaging
 * Conversation is in an invalid status.
 */
export class MessagingConversationInvalidStatusException extends MessagingException {
  public constructor(
    message: string = 'Messaging conversation has an invalid status for this operation.',
  ) {
    super(message);
  }
}
