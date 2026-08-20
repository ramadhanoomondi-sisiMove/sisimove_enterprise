// -----------------------------------------------------------------------------
// Journey Settlement
// -----------------------------------------------------------------------------

import { JourneySettlementException } from './journey-settlement.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Settlement violates an aggregate invariant.
 */
export class JourneySettlementInvariantException extends JourneySettlementException {
  constructor(
    message: string = 'Journey settlement violates an aggregate invariant.',
  ) {
    super(message);
  }
}
