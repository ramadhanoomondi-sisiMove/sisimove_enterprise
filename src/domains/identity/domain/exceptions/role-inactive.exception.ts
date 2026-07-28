// src/domains/authorization/domain/exceptions/role-inactive.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RoleInactiveException extends DomainException {
  constructor() {
    super('Role is inactive.', 'ROLE_INACTIVE');

    Object.freeze(this);
  }
}
