// src/domains/identity/domain/value-objects/device-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class DeviceId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'DEV');
  }
}
