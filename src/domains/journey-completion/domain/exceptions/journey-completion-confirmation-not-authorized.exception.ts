// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a member is not authorized to create, confirm, or withdraw
 * a Journey Completion confirmation.
 */
export class JourneyCompletionConfirmationNotAuthorizedException extends JourneyCompletionException {
  constructor(memberPublicId?: string, completionPublicId?: string) {
    if (memberPublicId && completionPublicId) {
      super(
        `Member "${memberPublicId}" is not authorized to manage confirmation for journey completion "${completionPublicId}".`,
      );

      return;
    }

    if (memberPublicId) {
      super(
        `Member "${memberPublicId}" is not authorized to manage the journey completion confirmation.`,
      );

      return;
    }

    if (completionPublicId) {
      super(
        `The actor is not authorized to manage confirmation for journey completion "${completionPublicId}".`,
      );

      return;
    }

    super(
      'The actor is not authorized to manage the journey completion confirmation.',
    );
  }
}
