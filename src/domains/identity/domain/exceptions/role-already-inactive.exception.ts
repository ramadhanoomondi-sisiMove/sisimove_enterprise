// src/domains/authorization/domain/exceptions/role-already-inactive.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RoleAlreadyInactiveException extends DomainException {
  constructor() {
    super('Role is already inactive.', 'ROLE_ALREADY_INACTIVE');

    Object.freeze(this);
  }
}
