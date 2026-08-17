// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Journey Demand domain.
 *
 * All Journey Demand-specific domain exceptions should ultimately extend
 * this exception.
 */
export class JourneyDemandException extends DomainException {
  constructor(message: string = 'A journey demand domain error occurred.') {
    super('JOURNEY_DEMAND.DOMAIN.ERROR', message);
  }
}
