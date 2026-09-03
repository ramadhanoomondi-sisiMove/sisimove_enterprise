// -----------------------------------------------------------------------------
// Device — Invalid Status Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { DeviceException } from './device.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation cannot be performed because the Device is in an
 * invalid lifecycle state for that operation.
 *
 * This exception represents a Device-domain-specific lifecycle violation.
 */
export class DeviceInvalidStatusException extends DeviceException {
  public constructor(
    message: string = 'Device has an invalid status for this operation.',
  ) {
    super(message);
  }
}
