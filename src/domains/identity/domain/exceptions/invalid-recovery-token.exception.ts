// src/domains/identity/domain/exceptions/invalid-recovery-token.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidRecoveryTokenException extends DomainException {
  constructor() {
    super('IDENTITY_INVALID_RECOVERY_TOKEN', 'The recovery token is invalid.');
  }
}
