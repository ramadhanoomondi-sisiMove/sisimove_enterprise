// -----------------------------------------------------------------------------
// Messaging — Participant Already Exists Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { MessagingException } from './messaging.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when attempting to add a participant who already belongs
 * to the Messaging Conversation.
 */
export class MessagingParticipantAlreadyExistsException extends MessagingException {
  public constructor(
    message: string = 'Messaging participant already exists in the conversation.',
  ) {
    super(message);
  }
}
