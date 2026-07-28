// src/domains/authorization/domain/exceptions/permission-not-assigned.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PermissionNotAssignedException extends DomainException {
  constructor(permissionId: string) {
    super(
      `Permission '${permissionId}' is not assigned to the role.`,
      'PERMISSION_NOT_ASSIGNED',
    );

    Object.freeze(this);
  }
}
