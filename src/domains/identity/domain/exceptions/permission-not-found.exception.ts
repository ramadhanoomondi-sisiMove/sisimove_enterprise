// src/domains/authorization/domain/exceptions/permission-not-found.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PermissionNotFoundException extends DomainException {
  constructor(permissionId: string) {
    super(
      `Permission '${permissionId}' was not found.`,
      'PERMISSION_NOT_FOUND',
    );

    Object.freeze(this);
  }
}
