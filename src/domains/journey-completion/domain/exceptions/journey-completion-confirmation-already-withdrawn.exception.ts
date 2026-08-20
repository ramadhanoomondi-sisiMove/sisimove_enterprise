// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Completion confirmation has already been withdrawn.
 */
export class JourneyCompletionConfirmationAlreadyWithdrawnException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion confirmation "${publicId}" has already been withdrawn.`
        : 'Journey completion confirmation has already been withdrawn.',
    );
  }
}
