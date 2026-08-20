// -----------------------------------------------------------------------------
// Journey Settlement
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Settlement cannot be found.
 */
export class JourneySettlementNotFoundException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey settlement "${publicId}" was not found.`
        : 'Journey settlement was not found.',
    );
  }
}
