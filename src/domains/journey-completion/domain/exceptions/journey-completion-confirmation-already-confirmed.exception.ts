// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Completion confirmation has already been confirmed.
 */
export class JourneyCompletionConfirmationAlreadyConfirmedException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion confirmation "${publicId}" has already been confirmed.`
        : 'Journey completion confirmation has already been confirmed.',
    );
  }
}
