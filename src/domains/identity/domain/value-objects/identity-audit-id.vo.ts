// src/domains/identity/domain/value-objects/identity-audit-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class IdentityAuditId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'AUD');
  }
}
