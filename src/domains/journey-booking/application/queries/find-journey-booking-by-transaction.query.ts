// -----------------------------------------------------------------------------
// Journey Booking — Find Journey Booking By Transaction Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyBookingTransactionPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Retrieves a Journey Booking aggregate using the Financial transaction
 * public identifier associated with its payment.
 *
 * The transaction identifier is treated as a cross-domain reference.
 */
export class FindJourneyBookingByTransactionQuery extends Query {
  constructor(
    /**
     * Public identifier of the Financial transaction associated with the
     * Journey Booking payment.
     */
    public readonly transactionPublicId: JourneyBookingTransactionPublicId,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FindJourneyBookingByTransactionQuery;
