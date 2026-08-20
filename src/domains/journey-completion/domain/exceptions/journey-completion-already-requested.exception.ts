// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when completion has already been requested for the Journey.
 */
export class JourneyCompletionAlreadyRequestedException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion "${publicId}" has already been requested.`
        : 'Journey completion has already been requested.',
    );
  }
}
