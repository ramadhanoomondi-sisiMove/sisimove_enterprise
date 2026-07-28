import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class DeviceNotPendingException extends DomainException {
  constructor() {
    super('DEVICE_NOT_PENDING', 'Only pending devices can be trusted.');
  }
}
