// src/domains/authorization/domain/exceptions/permission-already-active.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PermissionAlreadyActiveException extends DomainException {
  constructor() {
    super('Permission is already active.', 'PERMISSION_ALREADY_ACTIVE');

    Object.freeze(this);
  }
}
