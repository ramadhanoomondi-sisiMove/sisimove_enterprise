// -----------------------------------------------------------------------------
// Journey Settlement
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Base exception for all Journey Settlement domain errors.
 */
export abstract class JourneySettlementException extends DomainException {
  protected constructor(message: string) {
    super('JOURNEY_SETTLEMENT_ERROR', message);
  }
}
