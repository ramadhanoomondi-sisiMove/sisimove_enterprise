// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a confirmation operation is attempted while the
 * Journey Completion is not awaiting confirmation.
 */
export class JourneyCompletionNotConfirmationRequiredException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion "${publicId}" is not awaiting confirmation.`
        : 'Journey completion is not awaiting confirmation.',
    );
  }
}
