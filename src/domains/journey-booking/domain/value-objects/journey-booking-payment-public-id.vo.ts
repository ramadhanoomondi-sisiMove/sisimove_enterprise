// -----------------------------------------------------------------------------
// Journey Booking Payment Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Booking Payment entity.
 *
 * This identifies the payment record itself, not the parent booking and not
 * the external payment transaction.
 */
export class JourneyBookingPaymentPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JBP');
  }
}
