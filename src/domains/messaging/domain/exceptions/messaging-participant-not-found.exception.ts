// -----------------------------------------------------------------------------
// Messaging — Participant Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { MessagingException } from './messaging.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Messaging Conversation Participant cannot be found.
 */
export class MessagingParticipantNotFoundException extends MessagingException {
  public constructor(message: string = 'Messaging participant was not found.') {
    super(message);
  }
}
