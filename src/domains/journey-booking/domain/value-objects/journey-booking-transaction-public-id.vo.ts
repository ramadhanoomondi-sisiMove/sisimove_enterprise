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
 *
 * When no value is supplied, PublicEntityId generates a readable identifier
 * using the TXN prefix.
 *
 * Example:
 *
 *     TXN-8K3P2Q1A
 */
export class JourneyBookingTransactionPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TXN');
  }
}
