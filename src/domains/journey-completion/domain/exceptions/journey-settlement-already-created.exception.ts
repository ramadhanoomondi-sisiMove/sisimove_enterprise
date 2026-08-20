// -----------------------------------------------------------------------------
// Journey Settlement
// -----------------------------------------------------------------------------

import { JourneyCompletionException } from './journey-completion.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Settlement already exists for a Journey Completion.
 */
export class JourneySettlementAlreadyCreatedException extends JourneyCompletionException {
  constructor(settlementPublicId?: string, completionPublicId?: string) {
    if (settlementPublicId && completionPublicId) {
      super(
        `Journey settlement "${settlementPublicId}" has already been created for journey completion "${completionPublicId}".`,
      );

      return;
    }

    if (settlementPublicId) {
      super(
        `Journey settlement "${settlementPublicId}" has already been created.`,
      );

      return;
    }

    if (completionPublicId) {
      super(
        `A journey settlement has already been created for journey completion "${completionPublicId}".`,
      );

      return;
    }

    super('Journey settlement has already been created.');
  }
}
