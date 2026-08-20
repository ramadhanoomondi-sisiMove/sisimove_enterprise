// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Journey Completion domain.
 *
 * All Journey Completion-specific domain exceptions should ultimately
 * extend this exception.
 */
export class JourneyCompletionException extends DomainException {
  constructor(message: string = 'A journey completion domain error occurred.') {
    super('JOURNEY_COMPLETION.DOMAIN.ERROR', message);
  }
}
