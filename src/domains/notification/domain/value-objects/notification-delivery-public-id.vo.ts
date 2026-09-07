// -----------------------------------------------------------------------------
// Notification Delivery Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of a Notification Delivery.
 *
 * Represents the externally exposed identifier used to reference a
 * Notification Delivery without exposing its internal database identifier.
 *
 * The Notification Delivery remains owned by the Notification domain.
 */
export class NotificationDeliveryPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'NTD');
  }
}
