// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an invalid Journey Completion status transition is requested.
 */
export class JourneyCompletionInvalidStatusTransitionException extends JourneyCompletionException {
  constructor(fromStatus?: string, toStatus?: string, publicId?: string) {
    if (publicId && fromStatus && toStatus) {
      super(
        `Journey completion "${publicId}" cannot transition from status "${fromStatus}" to "${toStatus}".`,
      );

      return;
    }

    if (fromStatus && toStatus) {
      super(
        `Journey completion cannot transition from status "${fromStatus}" to "${toStatus}".`,
      );

      return;
    }

    if (publicId) {
      super(
        `Journey completion "${publicId}" has an invalid status transition.`,
      );

      return;
    }

    super('Journey completion has an invalid status transition.');
  }
}
