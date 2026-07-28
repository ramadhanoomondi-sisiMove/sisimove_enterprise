import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class DeviceAlreadyTrustedException extends DomainException {
  constructor() {
    super('DEVICE_ALREADY_TRUSTED', 'The device has already been trusted.');

    Object.setPrototypeOf(this, DeviceAlreadyTrustedException.prototype);
  }
}
