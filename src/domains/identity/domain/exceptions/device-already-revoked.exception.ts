import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class DeviceAlreadyRevokedException extends DomainException {
  constructor() {
    super('DEVICE_ALREADY_REVOKED', 'The device has already been revoked.');

    Object.setPrototypeOf(this, DeviceAlreadyRevokedException.prototype);
  }
}
