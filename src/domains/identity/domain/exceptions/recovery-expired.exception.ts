// src/domains/identity/domain/exceptions/recovery-expired.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RecoveryExpiredException extends DomainException {
  constructor() {
    super('IDENTITY_RECOVERY_EXPIRED', 'The recovery request has expired.');
  }
}
