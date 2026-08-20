// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Completion has already been confirmed.
 */
export class JourneyCompletionAlreadyConfirmedException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion "${publicId}" has already been confirmed.`
        : 'Journey completion has already been confirmed.',
    );
  }
}
