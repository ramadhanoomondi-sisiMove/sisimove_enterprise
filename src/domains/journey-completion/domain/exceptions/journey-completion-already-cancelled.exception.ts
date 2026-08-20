// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Completion has already been cancelled.
 */
export class JourneyCompletionAlreadyCancelledException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion "${publicId}" has already been cancelled.`
        : 'Journey completion has already been cancelled.',
    );
  }
}
