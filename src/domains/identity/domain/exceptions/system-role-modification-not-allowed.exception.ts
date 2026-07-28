// src/domains/authorization/domain/exceptions/system-role-modification-not-allowed.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class SystemRoleModificationNotAllowedException extends DomainException {
  constructor() {
    super(
      'System roles cannot be modified.',
      'SYSTEM_ROLE_MODIFICATION_NOT_ALLOWED',
    );

    Object.freeze(this);
  }
}
