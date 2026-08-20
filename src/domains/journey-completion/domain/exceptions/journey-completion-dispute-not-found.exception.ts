// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Completion dispute cannot be found.
 */
export class JourneyCompletionDisputeNotFoundException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion dispute "${publicId}" was not found.`
        : 'Journey completion dispute was not found.',
    );
  }
}
