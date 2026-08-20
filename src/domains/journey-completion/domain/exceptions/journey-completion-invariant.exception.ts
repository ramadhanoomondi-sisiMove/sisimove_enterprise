// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Completion domain invariant is violated.
 *
 * This exception represents a business rule that prevents the aggregate
 * from entering or remaining in an invalid state.
 */
export class JourneyCompletionInvariantException extends JourneyCompletionException {
  constructor(message: string = 'Journey completion invariant violated.') {
    super(message);
  }
}
