// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Completion cannot be disputed because
 * the required business conditions are not satisfied.
 */
export class JourneyCompletionCannotDisputeException extends JourneyCompletionException {
  constructor(publicId?: string, reason?: string) {
    if (publicId && reason) {
      super(`Journey completion "${publicId}" cannot be disputed: ${reason}`);

      return;
    }

    if (publicId) {
      super(`Journey completion "${publicId}" cannot be disputed.`);

      return;
    }

    if (reason) {
      super(`Journey completion cannot be disputed: ${reason}`);

      return;
    }

    super('Journey completion cannot be disputed.');
  }
}
