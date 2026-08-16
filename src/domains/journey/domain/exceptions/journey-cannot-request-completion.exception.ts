// src/domains/journey/domain/exceptions/journey-cannot-request-completion.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Journey Cannot Request Completion
// -----------------------------------------------------------------------------

export class JourneyCannotRequestCompletionException extends JourneyException {
  constructor(message: string = 'Journey cannot request completion.') {
    super(message);
  }
}
