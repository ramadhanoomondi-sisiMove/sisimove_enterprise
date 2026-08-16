// src/domains/journey/domain/exceptions/journey-cannot-be-published.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Journey Cannot Be Published
// -----------------------------------------------------------------------------

export class JourneyCannotBePublishedException extends JourneyException {
  constructor(message: string = 'Journey cannot be published.') {
    super(message);
  }
}
