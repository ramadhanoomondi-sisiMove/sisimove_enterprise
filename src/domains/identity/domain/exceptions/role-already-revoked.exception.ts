// src/domains/authorization/domain/exceptions/role-already-revoked.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RoleAlreadyRevokedException extends DomainException {
  constructor() {
    super('Role assignment has already been revoked.', 'ROLE_ALREADY_REVOKED');

    Object.freeze(this);
  }
}
