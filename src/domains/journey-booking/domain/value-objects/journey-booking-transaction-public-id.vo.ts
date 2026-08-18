// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the transaction associated with a Journey Booking
 * payment.
 *
 * This is a cross-domain reference to the Payment/Transaction bounded
 * context.
 *
 * It intentionally does not establish a Prisma relation.
 */
export class JourneyBookingTransactionPublicId extends PublicEntityId {
  constructor(value: string) {
    super(value, 'TXN');
  }
}
