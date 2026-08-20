// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a member is not authorized to perform an operation
 * on a Journey Completion dispute.
 */
export class JourneyCompletionDisputeNotAuthorizedException extends JourneyCompletionException {
  constructor(memberPublicId?: string, disputePublicId?: string) {
    if (memberPublicId && disputePublicId) {
      super(
        `Member "${memberPublicId}" is not authorized to manage journey completion dispute "${disputePublicId}".`,
      );

      return;
    }

    if (memberPublicId) {
      super(
        `Member "${memberPublicId}" is not authorized to manage the journey completion dispute.`,
      );

      return;
    }

    if (disputePublicId) {
      super(
        `The actor is not authorized to manage journey completion dispute "${disputePublicId}".`,
      );

      return;
    }

    super(
      'The actor is not authorized to manage the journey completion dispute.',
    );
  }
}
