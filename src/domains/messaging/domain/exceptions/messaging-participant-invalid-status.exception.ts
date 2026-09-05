// -----------------------------------------------------------------------------
// Messaging — Participant Invalid Status Exception
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
 * Conversation Participant is in an invalid status.
 */
export class MessagingParticipantInvalidStatusException extends MessagingException {
  public constructor(
    message: string = 'Messaging participant has an invalid status for this operation.',
  ) {
    super(message);
  }
}
