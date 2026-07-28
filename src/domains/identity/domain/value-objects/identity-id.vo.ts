// src/domains/identity/domain/value-objects/identity-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class IdentityId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'IDT');
  }
}
