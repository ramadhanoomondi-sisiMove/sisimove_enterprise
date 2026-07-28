// src/domains/authorization/domain/exceptions/role-assignment-already-expired.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RoleAssignmentAlreadyExpiredException extends DomainException {
  constructor() {
    super(
      'Role assignment has already expired.',
      'ROLE_ASSIGNMENT_ALREADY_EXPIRED',
    );

    Object.freeze(this);
  }
}
