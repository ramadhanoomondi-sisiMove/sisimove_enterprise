// src/domains/identity/domain/value-objects/recovery-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class RecoveryId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'RCV');
  }
}
