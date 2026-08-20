// -----------------------------------------------------------------------------
// Journey Settlement
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Settlement has already failed.
 */
export class JourneySettlementAlreadyFailedException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey settlement "${publicId}" has already failed.`
        : 'Journey settlement has already failed.',
    );
  }
}
