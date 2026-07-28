// src/domains/authorization/domain/exceptions/system-role-deletion-not-allowed.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class SystemRoleDeletionNotAllowedException extends DomainException {
  constructor() {
    super(
      'System roles cannot be deleted.',
      'SYSTEM_ROLE_DELETION_NOT_ALLOWED',
    );

    Object.freeze(this);
  }
}
