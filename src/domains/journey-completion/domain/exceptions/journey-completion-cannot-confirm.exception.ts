// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Completion cannot accept a confirmation
 * because the required business conditions are not satisfied.
 */
export class JourneyCompletionCannotConfirmException extends JourneyCompletionException {
  constructor(publicId?: string, reason?: string) {
    if (publicId && reason) {
      super(`Journey completion "${publicId}" cannot be confirmed: ${reason}`);

      return;
    }

    if (publicId) {
      super(`Journey completion "${publicId}" cannot be confirmed.`);

      return;
    }

    if (reason) {
      super(`Journey completion cannot be confirmed: ${reason}`);

      return;
    }

    super('Journey completion cannot be confirmed.');
  }
}
