// src/domains/authorization/domain/exceptions/system-permission-modification-not-allowed.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class SystemPermissionModificationNotAllowedException extends DomainException {
  constructor() {
    super(
      'System permissions cannot be modified.',
      'SYSTEM_PERMISSION_MODIFICATION_NOT_ALLOWED',
    );

    Object.freeze(this);
  }
}
