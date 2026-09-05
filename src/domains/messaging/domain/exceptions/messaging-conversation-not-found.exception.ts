// -----------------------------------------------------------------------------
// Messaging — Conversation Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { MessagingException } from './messaging.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Messaging Conversation cannot be found.
 */
export class MessagingConversationNotFoundException extends MessagingException {
  public constructor(
    message: string = 'Messaging conversation was not found.',
  ) {
    super(message);
  }
}
