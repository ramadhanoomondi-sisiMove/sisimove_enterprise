// src/domains/authorization/domain/exceptions/role-not-revoked.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RoleNotRevokedException extends DomainException {
  constructor() {
    super('Role assignment is not revoked.', 'ROLE_NOT_REVOKED');

    Object.freeze(this);
  }
}
