// src/domains/authorization/domain/exceptions/role-code-already-exists.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RoleCodeAlreadyExistsException extends DomainException {
  constructor(code: string) {
    super(`Role code '${code}' already exists.`, 'ROLE_CODE_ALREADY_EXISTS');

    Object.freeze(this);
  }
}
