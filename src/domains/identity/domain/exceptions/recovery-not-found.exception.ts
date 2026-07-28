// src/domains/identity/domain/exceptions/recovery-not-found.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RecoveryNotFoundException extends DomainException {
  constructor() {
    super('RECOVERY_NOT_FOUND', 'The requested recovery could not be found.');

    Object.setPrototypeOf(this, RecoveryNotFoundException.prototype);
  }
}
