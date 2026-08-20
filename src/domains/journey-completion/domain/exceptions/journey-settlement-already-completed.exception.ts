// -----------------------------------------------------------------------------
// Journey Settlement
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Settlement has already been completed.
 */
export class JourneySettlementAlreadyCompletedException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey settlement "${publicId}" has already been completed.`
        : 'Journey settlement has already been completed.',
    );
  }
}
