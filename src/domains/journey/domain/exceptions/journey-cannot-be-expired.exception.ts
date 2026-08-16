// src/domains/journey/domain/exceptions/journey-cannot-be-expired.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Journey Cannot Be Expired
// -----------------------------------------------------------------------------

export class JourneyCannotBeExpiredException extends JourneyException {
  constructor(message: string = 'Journey cannot be expired.') {
    super(message);
  }
}
