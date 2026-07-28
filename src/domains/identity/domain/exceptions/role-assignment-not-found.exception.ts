// src/domains/authorization/domain/exceptions/role-assignment-not-found.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RoleAssignmentNotFoundException extends DomainException {
  constructor(identityId: string, roleId: string) {
    super(
      `Role '${roleId}' is not assigned to Identity '${identityId}'.`,
      'ROLE_ASSIGNMENT_NOT_FOUND',
    );

    Object.freeze(this);
  }
}
