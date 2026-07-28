// src/domains/identity/domain/value-objects/authentication-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class AuthenticationId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'AUTH');
  }
}
