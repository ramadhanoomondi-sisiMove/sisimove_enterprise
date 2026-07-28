// src/domains/authorization/domain/value-objects/permission-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class PermissionId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'PER');
  }
}
