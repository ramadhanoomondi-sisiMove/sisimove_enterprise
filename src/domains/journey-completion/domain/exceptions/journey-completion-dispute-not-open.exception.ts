// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation requires an open Journey Completion dispute
 * but the dispute is in another state.
 */
export class JourneyCompletionDisputeNotOpenException extends JourneyCompletionException {
  constructor(publicId?: string, status?: string) {
    if (publicId && status) {
      super(
        `Journey completion dispute "${publicId}" is not open; current status is "${status}".`,
      );

      return;
    }

    if (publicId) {
      super(`Journey completion dispute "${publicId}" is not open.`);

      return;
    }

    if (status) {
      super(
        `Journey completion dispute is not open; current status is "${status}".`,
      );

      return;
    }

    super('Journey completion dispute is not open.');
  }
}
