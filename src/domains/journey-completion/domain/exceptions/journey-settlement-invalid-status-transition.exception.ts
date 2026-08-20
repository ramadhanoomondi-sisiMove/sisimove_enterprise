// -----------------------------------------------------------------------------
// Journey Settlement
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an invalid Journey Settlement status transition is requested.
 */
export class JourneySettlementInvalidStatusTransitionException extends JourneyCompletionException {
  constructor(fromStatus?: string, toStatus?: string, publicId?: string) {
    if (publicId && fromStatus && toStatus) {
      super(
        `Journey settlement "${publicId}" cannot transition from status "${fromStatus}" to "${toStatus}".`,
      );

      return;
    }

    if (fromStatus && toStatus) {
      super(
        `Journey settlement cannot transition from status "${fromStatus}" to "${toStatus}".`,
      );

      return;
    }

    if (publicId) {
      super(
        `Journey settlement "${publicId}" has an invalid status transition.`,
      );

      return;
    }

    super('Journey settlement has an invalid status transition.');
  }
}
