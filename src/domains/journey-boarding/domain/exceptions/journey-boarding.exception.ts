// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Journey Boarding domain.
 *
 * All Journey Boarding-specific domain exceptions should ultimately extend
 * this exception.
 */
export class JourneyBoardingException extends DomainException {
  constructor(message: string = 'A journey boarding domain error occurred.') {
    super('JOURNEY_BOARDING.DOMAIN.ERROR', message);
  }
}
