// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation attempts to modify a cancelled
 * Journey Completion.
 */
export class JourneyCompletionCannotModifyCancelledException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion "${publicId}" cannot be modified because it has been cancelled.`
        : 'Journey completion cannot be modified because it has been cancelled.',
    );
  }
}
