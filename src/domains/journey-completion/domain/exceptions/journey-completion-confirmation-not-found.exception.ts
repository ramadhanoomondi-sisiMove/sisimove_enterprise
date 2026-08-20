// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Completion confirmation cannot be found.
 */
export class JourneyCompletionConfirmationNotFoundException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion confirmation "${publicId}" was not found.`
        : 'Journey completion confirmation was not found.',
    );
  }
}
