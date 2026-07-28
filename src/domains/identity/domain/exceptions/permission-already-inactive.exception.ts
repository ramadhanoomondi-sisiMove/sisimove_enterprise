// src/domains/authorization/domain/exceptions/permission-already-inactive.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PermissionAlreadyInactiveException extends DomainException {
  constructor() {
    super('Permission is already inactive.', 'PERMISSION_ALREADY_INACTIVE');

    Object.freeze(this);
  }
}
