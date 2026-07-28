// src/domains/authorization/domain/value-objects/role-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class RoleId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'ROL');
  }
}
