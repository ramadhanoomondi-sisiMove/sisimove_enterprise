// src/domains/journey/domain/exceptions/journey-already-exists.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Journey Already Exists
// -----------------------------------------------------------------------------

export class JourneyAlreadyExistsException extends JourneyException {
  constructor(message: string = 'Journey already exists.') {
    super(message);
  }
}
