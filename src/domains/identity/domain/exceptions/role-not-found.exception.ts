// src/domains/authorization/domain/exceptions/role-not-found.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RoleNotFoundException extends DomainException {
  constructor(roleId: string) {
    super(`Role '${roleId}' was not found.`, 'ROLE_NOT_FOUND');

    Object.freeze(this);
  }
}
