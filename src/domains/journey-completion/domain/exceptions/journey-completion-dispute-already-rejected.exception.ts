// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Completion dispute has already been rejected.
 */
export class JourneyCompletionDisputeAlreadyRejectedException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion dispute "${publicId}" has already been rejected.`
        : 'Journey completion dispute has already been rejected.',
    );
  }
}
