// src/domains/journey/domain/exceptions/journey-cannot-be-started.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Journey Cannot Be Started
// -----------------------------------------------------------------------------

export class JourneyCannotBeStartedException extends JourneyException {
  constructor(message: string = 'Journey cannot be started.') {
    super(message);
  }
}
