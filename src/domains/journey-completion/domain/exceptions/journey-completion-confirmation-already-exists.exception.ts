// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a confirmation already exists for the specified member
 * on a Journey Completion.
 */
export class JourneyCompletionConfirmationAlreadyExistsException extends JourneyCompletionException {
  constructor(memberPublicId?: string, completionPublicId?: string) {
    if (memberPublicId && completionPublicId) {
      super(
        `Journey completion "${completionPublicId}" already has a confirmation for member "${memberPublicId}".`,
      );

      return;
    }

    if (memberPublicId) {
      super(
        `A journey completion confirmation already exists for member "${memberPublicId}".`,
      );

      return;
    }

    if (completionPublicId) {
      super(
        `Journey completion "${completionPublicId}" already has a confirmation for this member.`,
      );

      return;
    }

    super('A journey completion confirmation already exists for this member.');
  }
}
