// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation attempts to modify a confirmed
 * Journey Completion.
 */
export class JourneyCompletionCannotModifyConfirmedException extends JourneyCompletionException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey completion "${publicId}" cannot be modified because it has already been confirmed.`
        : 'Journey completion cannot be modified because it has already been confirmed.',
    );
  }
}
