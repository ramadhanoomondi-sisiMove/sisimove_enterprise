// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Completion dispute has already been resolved.
 */
export class JourneyCompletionDisputeAlreadyResolvedException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion dispute "${publicId}" has already been resolved.`
        : 'Journey completion dispute has already been resolved.',
    );
  }
}
