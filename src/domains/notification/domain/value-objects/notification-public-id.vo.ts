// -----------------------------------------------------------------------------
// Notification Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of a Notification.
 *
 * Represents the externally exposed identifier used to reference a
 * Notification without exposing its internal database identifier.
 *
 * The Notification remains owned by the Notification domain.
 */
export class NotificationPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'NTF');
  }
}
