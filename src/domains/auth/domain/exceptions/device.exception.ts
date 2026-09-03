// -----------------------------------------------------------------------------
// Device
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Device domain.
 *
 * All Device-specific domain exceptions should ultimately extend
 * this exception.
 */
export class DeviceException extends DomainException {
  public constructor(message: string = 'A device domain error occurred.') {
    super('DEVICE.DOMAIN.ERROR', message);
  }
}
