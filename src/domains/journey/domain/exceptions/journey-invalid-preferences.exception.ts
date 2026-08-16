// src/domains/journey/domain/exceptions/journey-invalid-preferences.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Invalid Journey Preferences
// -----------------------------------------------------------------------------

export class JourneyInvalidPreferencesException extends JourneyException {
  constructor(message: string = 'Journey preferences are invalid.') {
    super(message);
  }
}
