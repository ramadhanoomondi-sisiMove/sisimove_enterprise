// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Completion dispute has already been withdrawn.
 */
export class JourneyCompletionDisputeAlreadyWithdrawnException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion dispute "${publicId}" has already been withdrawn.`
        : 'Journey completion dispute has already been withdrawn.',
    );
  }
}
