// -----------------------------------------------------------------------------
// Support Case Message — Already Edited Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an attempt is made to edit a message that has already
 * been edited according to the domain's message-editing rules.
 */
export class SupportCaseMessageAlreadyEditedException extends SupportCaseException {
  public constructor(
    message: string = 'Support case message has already been edited.',
  ) {
    super(message);
  }
}
