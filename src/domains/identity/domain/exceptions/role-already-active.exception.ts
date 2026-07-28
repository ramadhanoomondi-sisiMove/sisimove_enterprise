// src/domains/authorization/domain/exceptions/role-already-active.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RoleAlreadyActiveException extends DomainException {
  constructor() {
    super('Role is already active.', 'ROLE_ALREADY_ACTIVE');

    Object.freeze(this);
  }
}
