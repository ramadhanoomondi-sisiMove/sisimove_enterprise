// -----------------------------------------------------------------------------
// Device — Already Exists Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { DeviceException } from './device.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation attempts to create or register a Device that
 * already exists.
 *
 * This may occur when another Device already owns a unique domain identity,
 * such as the same device fingerprint within the applicable Identity scope.
 */
export class DeviceAlreadyExistsException extends DeviceException {
  public constructor(message: string = 'Device already exists.') {
    super(message);
  }
}
