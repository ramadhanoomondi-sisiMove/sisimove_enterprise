// src/domains/authorization/domain/exceptions/system-permission-deletion-not-allowed.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class SystemPermissionDeletionNotAllowedException extends DomainException {
  constructor() {
    super(
      'System permissions cannot be deleted.',
      'SYSTEM_PERMISSION_DELETION_NOT_ALLOWED',
    );

    Object.freeze(this);
  }
}
