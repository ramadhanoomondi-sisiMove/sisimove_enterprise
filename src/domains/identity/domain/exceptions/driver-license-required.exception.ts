import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class DriverLicenseRequiredException extends DomainException {
  constructor() {
    super(
      'DRIVER_LICENSE_REQUIRED',
      'A verified driver license is required for driver verification.',
    );

    Object.setPrototypeOf(this, DriverLicenseRequiredException.prototype);
  }
}
