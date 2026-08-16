// src/domains/journey/domain/exceptions/journey-invalid-transition.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Invalid Journey Transition
// -----------------------------------------------------------------------------

export class JourneyInvalidTransitionException extends JourneyException {
  constructor(
    message: string = 'Journey cannot transition to the requested status.',
  ) {
    super(message);
  }
}
