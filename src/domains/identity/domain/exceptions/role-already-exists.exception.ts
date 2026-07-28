// src/domains/authorization/domain/exceptions/role-already-exists.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RoleAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Role '${name}' already exists.`, 'ROLE_ALREADY_EXISTS');

    Object.freeze(this);
  }
}
