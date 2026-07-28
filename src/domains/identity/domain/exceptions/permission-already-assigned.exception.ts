// src/domains/authorization/domain/exceptions/permission-already-assigned.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PermissionAlreadyAssignedException extends DomainException {
  constructor(permissionId: string) {
    super(
      `Permission '${permissionId}' is already assigned to the role.`,
      'PERMISSION_ALREADY_ASSIGNED',
    );

    Object.freeze(this);
  }
}
