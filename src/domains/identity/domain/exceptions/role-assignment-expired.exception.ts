// src/domains/authorization/domain/exceptions/role-assignment-expired.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RoleAssignmentExpiredException extends DomainException {
  constructor() {
    super('Role assignment has expired.', 'ROLE_ASSIGNMENT_EXPIRED');

    Object.freeze(this);
  }
}
