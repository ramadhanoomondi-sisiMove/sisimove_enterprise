// src/domains/authorization/domain/exceptions/permission-inactive.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PermissionInactiveException extends DomainException {
  constructor() {
    super('Permission is inactive.', 'PERMISSION_INACTIVE');

    Object.freeze(this);
  }
}
